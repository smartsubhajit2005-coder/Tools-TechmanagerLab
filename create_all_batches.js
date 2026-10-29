const fs = require('fs');
const path = require('path');

const LOCAL_DIR = 'E:/Projects/Tools Website/site-clean';
const batches = JSON.parse(fs.readFileSync('E:/Projects/Tools Website/batches.json', 'utf8'));

for (let i = 0; i < batches.length; i++) {
  const batch = batches[i];
  // Filter out _filedata files
  const files = batch.filter(f => !f.startsWith('_filedata'));
  
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>File Data</title></head><body><script>\n';
  html += 'window.fileData = {};\n';
  
  for (const fileName of files) {
    const filePath = path.join(LOCAL_DIR, fileName);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath);
    const base64 = content.toString('base64');
    html += "window.fileData['" + fileName + "'] = '" + base64 + "';\n";
  }
  
  html += '</script></body></html>';
  
  const outPath = path.join(LOCAL_DIR, '_batch' + i + '.html');
  fs.writeFileSync(outPath, html);
  console.log('Created _batch' + i + '.html with', files.length, 'files');
}