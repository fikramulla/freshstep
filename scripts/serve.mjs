import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../docs/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };
export function createServer() {
  return http.createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    try {
      const requested = decodeURIComponent(req.url.split('?')[0]);
      if (!requested.startsWith('/') || requested.includes('\\') || requested.includes('\0') || requested.split('/').some(part => part === '..' || part.startsWith('.'))) {
        res.writeHead(403).end('Forbidden'); return;
      }
      const target = await realpath(path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested)));
      if (!target.startsWith(root)) { res.writeHead(403).end('Forbidden'); return; }
      const body = await readFile(target);
      res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
      res.writeHead(error instanceof URIError ? 400 : 404).end('Not found');
    }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.on('error', error => { console.error(`Cannot start FreshStep on port 4173: ${error.message}`); process.exitCode = 1; });
  server.listen(4173, '127.0.0.1', () => console.log('FreshStep: http://localhost:4173/ (Ctrl+C to stop)'));
}
