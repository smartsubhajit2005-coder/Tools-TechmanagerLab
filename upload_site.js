const https = require('https');
const fs = require('fs');
const path = require('path');

const NONCE = '6cd1ee161d';
const AJAX_URL = 'https://techmanagerlab.com/wp-admin/admin-ajax.php';
const AUTH = 'Basic ' + Buffer.from('admin:blN6 9Gou SFKq J8E5 7X2b 4sKu').toString('base64');
const LOCAL_DIR = 'E:/Projects/Tools Website/site';

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function targetHash(dirPath) {
  // elFinder hash: l1_ + base64 of path (with / prefix)
  const p = dirPath.startsWith('/') ? dirPath : '/' + dirPath;
  return 'l1_' + Buffer.from(p).toString('base64').replace(/=/g, '');
}

function uploadFile(localPath, remoteDir) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(localPath);
    const fileData = fs.readFileSync(localPath);
    const target = targetHash(remoteDir);
    
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const CRLF = '\r\n';
    
    let body = '';
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="action"' + CRLF + CRLF;
    body += 'mk_file_folder_manager' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="_wpnonce"' + CRLF + CRLF;
    body += NONCE + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="cmd"' + CRLF + CRLF;
    body += 'upload' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="target"' + CRLF + CRLF;
    body += target + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="upload[]"; filename="' + fileName + '"' + CRLF;
    body += 'Content-Type: application/octet-stream' + CRLF + CRLF;
    
    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf8'),
      fileData,
      Buffer.from(CRLF + '--' + boundary + '--' + CRLF, 'utf8')
    ]);
    
    const url = new URL(AJAX_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': bodyBuffer.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data.substring(0, 200) });
      });
    });
    
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

function createDir(dirName) {
  return new Promise((resolve, reject) => {
    const target = targetHash('/');
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const CRLF = '\r\n';
    
    let body = '';
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="action"' + CRLF + CRLF;
    body += 'mk_file_folder_manager' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="_wpnonce"' + CRLF + CRLF;
    body += NONCE + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="cmd"' + CRLF + CRLF;
    body += 'mkdir' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="target"' + CRLF + CRLF;
    body += target + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="name"' + CRLF + CRLF;
    body += dirName + CRLF;
    
    body += '--' + boundary + '--' + CRLF;
    
    const url = new URL(AJAX_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data.substring(0, 300) });
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // First, get all files recursively
  function getAllFiles(dir, baseDir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else {
        files.push({ fullPath, relPath });
      }
    }
    return files;
  }
  
  const files = getAllFiles(LOCAL_DIR, LOCAL_DIR);
  console.log('Found', files.length, 'files to upload');
  
  // Create tools and freetools directories
  console.log('Creating /tools/ directory...');
  let res = await createDir('tools');
  console.log('  tools dir:', res.status, res.body.substring(0, 100));
  
  console.log('Creating /freetools/ directory...');
  res = await createDir('freetools');
  console.log('  freetools dir:', res.status, res.body.substring(0, 100));
  
  // Upload files to both destinations
  for (const { fullPath, relPath } of files) {
    const remoteDir = 'tools/' + (path.dirname(relPath) === '.' ? '' : path.dirname(relPath) + '/');
    // Clean up double slashes
    const cleanDir = remoteDir.replace(/\/+/g, '/').replace(/\/$/, '');
    
    console.log('Uploading to /tools/:', relPath);
    res = await uploadFile(fullPath, cleanDir || 'tools');
    console.log('  ->', res.status, res.body.substring(0, 80));
    
    // Also upload to freetools
    const freeDir = cleanDir.replace(/^tools/, 'freetools');
    console.log('Uploading to /freetools/:', relPath);
    res = await uploadFile(fullPath, freeDir || 'freetools');
    console.log('  ->', res.status, res.body.substring(0, 80));
  }
  
  console.log('Done!');
}

main().catch(err => console.error('Error:', err));