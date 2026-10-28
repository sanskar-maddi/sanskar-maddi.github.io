import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index.html', 'projects.html', '404.html', ...(await readdir(path.join(root, 'projects'))).filter(name => name.endsWith('.html')).map(name => `projects/${name}`)];
const documents = new Map();
let links = 0;

for (const page of pages) {
  const html = await readFile(path.join(root, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: duplicate IDs`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page}: expected one h1`);
  assert.match(html, /<html lang="en">/, `${page}: missing language`);
  assert.match(html, /<title>[^<]+<\/title>/, `${page}: missing title`);
  assert.match(html, /name="description" content="[^"]+"/, `${page}: missing description`);
  assert.match(html, /name="viewport"/, `${page}: missing viewport`);
  assert(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffd]/.test(html), `${page}: invalid encoding`);
  documents.set(path.join(root, page), { html, ids });
}

for (const [file, { html }] of documents) {
  for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|data:)/.test(url)) continue;
    assert(!url.startsWith('/'), `${file}: root-relative URL breaks repository sites: ${url}`);
    const [relative, fragment] = url.split('#');
    const target = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : file;
    const relativeTarget = path.relative(root, target);
    assert(!relativeTarget.startsWith('..') && !path.isAbsolute(relativeTarget), `${file}: link escapes site: ${url}`);
    await stat(target).catch(() => assert.fail(`${file}: missing target ${url}`));
    // Exact spelling matters on Linux, even when checked on Windows.
    const segments = relativeTarget.split(path.sep);
    let directory = root;
    for (const segment of segments) {
      assert((await readdir(directory)).includes(segment), `${file}: incorrect path case: ${url}`);
      directory = path.join(directory, segment);
    }
    if (fragment) {
      const targetDocument = documents.get(target);
      assert(targetDocument?.ids.includes(decodeURIComponent(fragment)), `${file}: broken anchor ${url}`);
    }
    links++;
  }
}

for (const page of pages.filter(page => page !== '404.html')) {
  const { html } = documents.get(path.join(root, page));
  assert.match(html, /aria-controls="navigation"/, `${page}: missing accessible menu`);
  assert.match(html, /aria-label="Main navigation"/, `${page}: missing navigation label`);
  if (page.startsWith('projects/')) {
    assert.match(html, /aria-label="Breadcrumb"/, `${page}: missing breadcrumb`);
    assert.match(html, /class="project-sidebar"/, `${page}: missing project navigation`);
  }
}
const home = documents.get(path.join(root, 'index.html')).html;
for (const page of pages.filter(page => page.startsWith('projects/'))) {
  assert(home.includes(`href="${page}"`), `Home must link to ${page}`);
}
new vm.Script(await readFile(path.join(root, 'assets/app.js'), 'utf8'));
assert(!(await readFile(path.join(root, 'assets/styles.css'), 'utf8')).includes('@import'), 'Styles should work without external font requests');
console.log(`PASS: ${pages.length} pages, ${links} local links/assets/anchors, exact path case, metadata, UTF-8, navigation, JavaScript syntax.`);
