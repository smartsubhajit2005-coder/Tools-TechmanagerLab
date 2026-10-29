const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('admin:blN6 9Gou SFKq J8E5 7X2b 4sKu').toString('base64');
const NONCE = '6cd1ee161d';
const AJAX_URL = 'https://techmanagerlab.com/wp-admin/admin-ajax.php';
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
body += 'l1_dG9vbHM' + CRLF;
body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="networkhref"' + CRLF + CRLF;
body += '' + CRLF;
body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="upload[]"; filename="test_tools.txt"' + CRLF;
body += 'Content-Type: application/octet-stream' + CRLF + CRLF;

const fileData = Buffer.from('hello from tools dir test');
const bodyBuffer = Buffer.concat([
  Buffer.from(body, 'utf8'),
  fileData,
  Buffer.from(CRLF + '--' + boundary + '--' + CRLF, 'utf8')
]);

const url = new URL(AJAX_URL);
const options = {
  hostname: url.hostname, port: 443, path: url.pathname, method: 'POST',
  headers: { 'Authorization': AUTH, 'Content-Type': 'multipart/form-data; boundary=' + boundary, 'Content-Length': bodyBuffer.length }
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