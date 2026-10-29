const fs = require('fs');
const path = require('path');
const https = require('https');

const LOCAL_DIR = 'E:/Projects/Tools Website/site-clean';
const files = fs.readdirSync(LOCAL_DIR).sort().filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.svg') || f.endsWith('.txt'));

const AUTH = 'Basic ' + Buffer.from('admin:blN6 9Gou SFKq J8E5 7X2b 4sKu').toString('base64');

function uploadFile(fileName, targetDir) {
  return new Promise((resolve) => {
    const localPath = path.join(LOCAL_DIR, fileName);
    const fileData = fs.readFileSync(localPath);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const CRLF = '\r\n';
    
    // Build multipart body
    let body = '';
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="action"' + CRLF + CRLF;
    body += 'mk_file_folder_manager' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="_wpnonce"' + CRLF + CRLF;
    body += '6cd1ee161d' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="cmd"' + CRLF + CRLF;
    body += 'upload' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="target"' + CRLF + CRLF;
    body += targetDir + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="networkhref"' + CRLF + CRLF;
    body += '' + CRLF;
    
    body += '--' + boundary + CRLF;
    body += 'Content-Disposition: form-data; name="upload[]"; filename="' + fileName + '"' + CRLF;
    body += 'Content-Type: application/octet-stream' + CRLF + CRLF;
    
    // Convert body to buffer and append file data
    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf8'),
      fileData,
      Buffer.from(CRLF + '--' + boundary + '--' + CRLF, 'utf8')
    ]);
    
    const options = {
      hostname: 'techmanagerlab.com',
      port: 443,
      path: '/wp-admin/admin-ajax.php',
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': bodyBuffer.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data.substring(0, 200), file: fileName });
      });
    });
    req.on('error', (e) => {
      resolve({ status: 0, error: e.message, file: fileName });
    });
    req.write(bodyBuffer);
    req.end();
  });
}

;(async () => {
  let success = 0, fail = 0;
  for (const fileName of files) {
    const res1 = await uploadFile(fileName, 'l1_dG9vbHM');
    if (res1.status === 200) { success++; } else { fail++; console.log('FAIL /tools/', fileName, ':', res1.body ? res1.body.substring(0, 60) : res1.error); }
    
    const res2 = await uploadFile(fileName, 'l1_dG9vbHM');
    if (res2.status === 200) { success++; } else { fail++; console.log('FAIL /freetools/', fileName, ':', res2.body ? res2.body.substring(0, 60) : res2.error); }
    
    if ((success + fail) % 10 === 0) {
      console.log('Progress:', success + fail, 'of', files.length * 2, '| Success:', success, 'Fail:', fail);
    }
  }
  console.log('\nDone! Success:', success, 'Failures:', fail);
})();