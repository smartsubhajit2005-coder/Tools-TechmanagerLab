const fs = require('fs');
const https = require('https');

const AUTH = 'Basic ' + Buffer.from('admin:blN6 9Gou SFKq J8E5 7X2b 4sKu').toString('base64');
const localPath = 'E:/Projects/Tools Website/site-clean/index.html';
const fileName = 'index.html';
const targetDir = 'l1_dG9vbHM';

const fileData = fs.readFileSync(localPath);
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const CRLF = '\r\n';

// Build the multipart body
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
body += 'Content-Type: text/html' + CRLF + CRLF;

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
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', data.substring(0, 500));
  });
});
req.on('error', e => console.log('ERR:', e.message));
req.write(bodyBuffer);
req.end();