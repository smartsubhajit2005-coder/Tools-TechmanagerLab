const fs = require('fs');
const path = require('path');

const file = 'index.html';
const content = fs.readFileSync(path.join('E:/Projects/Tools Website/site', file), 'utf8');
const base64 = Buffer.from(content).toString('base64');
console.log('FILE:' + file);
console.log('SIZE:' + content.length);
console.log('BASE64:' + base64);