// Local-only preview. Visit /repository-preview/ to test project-site paths.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    pathname = pathname.replace(/^\/repository-preview(?=\/|$)/, '') || '/';
    if (pathname.endsWith('/')) pathname += 'index.html';
    const target = path.resolve(root, `.${pathname}`);
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !/^(index\.html|projects\.html|404\.html|assets[\\/][\w.-]+|projects[\\/][\w-]+\.html)$/.test(relative)) {
      throw new Error('Not a public file');
    }
    if (!(await stat(target)).isFile()) throw new Error('Missing file');
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(path.join(root, '404.html')));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
process.on('SIGINT', () => server.close());
