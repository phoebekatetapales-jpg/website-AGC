/* =====================================================================
   Local preview of the website, served like Vercel does it
   (clean URLs: /plans opens plans.html).

   Run:   node tools/preview.js          (or double-click "Preview website.cmd")
   Then:  http://localhost:8080          Stop with Ctrl+C or by closing the window.

   Edit any file, then refresh the browser to see the change.
   ===================================================================== */
const http = require('http'), fs = require('fs'), path = require('path'), { exec } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.pdf': 'application/pdf'
};

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p = fs.existsSync(path.join(ROOT, p, 'index.html')) ? p + 'index.html' : p.slice(0, -1);
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) return null;                                   // no ../ escapes
  if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html'; // clean URLs
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

const server = http.createServer((req, res) => {
  const file = resolve(req.url);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    console.log('  404', req.url);
    return res.end('Not found: ' + req.url);
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

function start(port, triesLeft) {
  server.once('error', err => {
    if (err.code === 'EADDRINUSE' && triesLeft > 0) return start(port + 1, triesLeft - 1);
    console.error('Could not start the preview:', err.message); process.exit(1);
  });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}/`;
    console.log(`\n  AGC Tutorials website preview\n  ${url}\n\n  Refresh the browser after editing a file. Press Ctrl+C to stop.\n`);
    if (!process.argv.includes('--no-open')) {
      const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
      exec(cmd);
    }
  });
}
start(+(process.env.PORT || 8080), 10);
