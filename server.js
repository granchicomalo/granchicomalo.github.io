// SPA Fallback Web Server (ES Module)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const server = http.createServer((req, res) => {
  const safeUrl = req.url.split('?')[0];
  if (safeUrl === '/logo.png' || safeUrl === '/logo') {
    const logoPath = 'C:/Users/granc/.gemini/antigravity/brain/e4056c59-c4d1-4348-952a-6eac831616b0/.user_uploaded/logo_transparent.png';
    fs.readFile(logoPath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not Found'); }
      else { res.writeHead(200, { 'Content-Type': 'image/png' }); res.end(data); }
    });
    return;
  }
  if (safeUrl === '/hero_consulting.jpg') {
    const imgPath = 'C:/Users/granc/.gemini/antigravity/brain/e4056c59-c4d1-4348-952a-6eac831616b0/.user_uploaded/media__1785686164652.jpg';
    fs.readFile(imgPath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not Found'); }
      else { res.writeHead(200, { 'Content-Type': 'image/jpeg' }); res.end(data); }
    });
    return;
  }
  if (safeUrl === '/store_success.jpg') {
    const imgPath = 'C:/Users/granc/.gemini/antigravity/brain/e4056c59-c4d1-4348-952a-6eac831616b0/.user_uploaded/media__1785686168829.jpg';
    fs.readFile(imgPath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not Found'); }
      else { res.writeHead(200, { 'Content-Type': 'image/jpeg' }); res.end(data); }
    });
    return;
  }
  if (safeUrl === '/data_analysis.jpg') {
    const imgPath = 'C:/Users/granc/.gemini/antigravity/brain/e4056c59-c4d1-4348-952a-6eac831616b0/.user_uploaded/media__1785686175993.jpg';
    fs.readFile(imgPath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not Found'); }
      else { res.writeHead(200, { 'Content-Type': 'image/jpeg' }); res.end(data); }
    });
    return;
  }

  let filePath = path.join(PUBLIC_DIR, safeUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html; charset=utf-8';
    
    if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 SPA Web Server is running on http://localhost:${PORT}`);
  console.log(`- 6-Step 창업 진단 Wizard: http://localhost:${PORT}/diagnosis`);
  console.log(`- 영업자 CRM 로그인: http://localhost:${PORT}/admin/login`);
  console.log(`==================================================\n`);
});
