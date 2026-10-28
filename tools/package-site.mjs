// Stage only public website files, never repository tools or documentation.
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, '_site');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const name of ['index.html', 'projects.html', '404.html', '.nojekyll', 'assets', 'projects']) {
  await cp(path.join(root, name), path.join(destination, name), { recursive: true });
}
// A 404 is served at arbitrary depths; inject the actual Pages base path.
const basePath = process.env.SITE_BASE_PATH || '';
if (!/^(?:\/[A-Za-z0-9._-]+)*\/?$/.test(basePath)) throw new Error('Invalid SITE_BASE_PATH');
const notFound = path.join(destination, '404.html');
await writeFile(notFound, (await readFile(notFound, 'utf8')).replace('const siteBase = "";', `const siteBase = ${JSON.stringify(basePath)};`));
console.log('Website prepared in _site/');
