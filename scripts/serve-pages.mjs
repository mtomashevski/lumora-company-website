// Local QA only: emulate Pages directory indexes and custom HTTP 404, without SPA rewrites.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { githubPagesBasePath, normalizeBasePath } from '../src/utils/deployment.ts';

const root = path.resolve('dist');
const base = normalizeBasePath(process.env.TEST_BASE_PATH || githubPagesBasePath);
const port = Number(process.env.TEST_PAGES_PORT || 4180);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) {
      response.writeHead(404);
      response.end('Outside application base');
      return;
    }
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    const info = await stat(file).catch(() => undefined);
    if (info?.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(301, { Location: url.pathname + '/' + url.search });
        response.end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    const content = await readFile(file).catch(() => undefined);
    // Read the fallback before sending headers, including during a local rebuild.
    const body = content || (await readFile(path.join(root, '404.html')));
    response.writeHead(content ? 200 : 404, {
      'Content-Type': content
        ? mime[path.extname(file)] || 'application/octet-stream'
        : mime['.html'],
    });
    response.end(body);
  } catch {
    if (response.headersSent) response.destroy();
    else {
      response.writeHead(500);
      response.end('Static preview error');
    }
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Pages QA: http://127.0.0.1:${port}${base}`));
