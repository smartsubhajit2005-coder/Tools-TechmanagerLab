const fs = require('fs');
const path = require('path');

const LOCAL_DIR = 'E:/Projects/Tools Website/site-clean';
const files = ['base64.html', 'calculator.html', 'case-converter.html', 'color-converter.html', 'cron-parser.html'];

let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>File Data</title></head><body><script>\n';
html += 'window.fileData = {};\n';

for (const fileName of files) {
  const filePath = path.join(LOCAL_DIR, fileName);
  const content = fs.readFileSync(filePath);
  const base64 = content.toString('base64');
  html += "window.fileData['" + fileName + "'] = '" + base64 + "';\n";
}

html += '</script></body></html>';

fs.writeFileSync('E:/Projects/Tools Website/site-clean/_filedata5.html', html);
console.log('Created _filedata5.html with', files.length, 'files');