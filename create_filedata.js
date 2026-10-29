const fs = require('fs');
const path = require('path');

const LOCAL_DIR = 'E:/Projects/Tools Website/site-clean';
const files = fs.readdirSync(LOCAL_DIR).sort().filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.svg') || f.endsWith('.txt'));

let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>File Data</title></head><body><script>\n';
html += 'window.fileData = {};\n';

for (const fileName of files) {
  const filePath = path.join(LOCAL_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  // Escape the content for JavaScript string
  const escaped = content.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  html += "window.fileData['" + fileName + "'] = '" + escaped + "';\n";
}

html += '</script></body></html>';

fs.writeFileSync('E:/Projects/Tools Website/site-clean/_filedata.html', html);
console.log('Created _filedata.html with', files.length, 'files');