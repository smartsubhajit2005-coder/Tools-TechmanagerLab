const fs = require('fs');
const https = require('https');

const AUTH = 'Basic ' + Buffer.from('admin:blN6 9Gou SFKq J8E5 7X2b 4sKu').toString('base64');
const content = fs.readFileSync('E:/Projects/Tools Website/site-clean/index.html', 'utf8');

// Try the 'save' command
const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
const CRLF = '\r\n';

let body = '';
body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="action"' + CRLF + CRLF;
body += 'mk_file_folder_manager' + CRLF;

body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="_wpnonce"' + CRLF + CRLF;
body += 'd65e0c3657' + CRLF;

body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="cmd"' + CRLF + CRLF;
body += 'save' + CRLF;

body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="target"' + CRLF + CRLF;
body += 'l1_aW5kZXguaHRtbA' + CRLF;

body += '--' + boundary + CRLF;
body += 'Content-Disposition: form-data; name="content"' + CRLF + CRLF;
body += content + CRLF;

body += '--' + boundary + '--' + CRLF;

const bodyBuffer = Buffer.from(body, 'utf8');

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