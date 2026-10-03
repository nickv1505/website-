// Serves out/ the way Netlify does (pretty URLs, _redirects rewrites, 404.html).
// Usage: node scripts/serve-static.mjs [port]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const root = path.resolve('out');
const port = Number(process.argv[2] || 4000);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json' };
const rules = existsSync(path.join(root, '_redirects'))
  ? readFileSync(path.join(root, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/))
  : [];

function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath).replace(/\/+$/, '') || '/';
  for (const candidate of [clean, `${clean}.html`, path.join(clean, 'index.html')]) {
    const full = path.join(root, candidate);
    if (full.startsWith(root) && existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

function rewrite(urlPath) {
  for (const [from, to] of rules) {
    const re = new RegExp('^' + from.replace(/:[a-z]+/gi, '[^/]+') + '/?$');
    if (re.test(urlPath)) return to;
  }
  return null;
}

createServer((req, res) => {
  const urlPath = new URL(req.url, 'http://x').pathname;
  let file = fileFor(urlPath);
  if (!file) {
    const target = rewrite(urlPath);
    if (target) file = path.join(root, target);
  }
  const status = file ? 200 : 404;
  file ??= path.join(root, '404.html');
  res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving out/ on http://localhost:${port}`));
