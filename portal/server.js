const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8888;
const BASE = __dirname;
const MIME = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  const fp = path.join(BASE, url);
  if (!fp.startsWith(BASE)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(fp);
    res.writeHead(200, {'Content-Type': MIME[ext]||'application/octet-stream', 'Access-Control-Allow-Origin':'*'});
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log('Serving on http://localhost:'+PORT));
