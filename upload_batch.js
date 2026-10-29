const fs = require('fs');
const path = require('path');

const LOCAL_DIR = 'E:/Projects/Tools Website/site';
const files = fs.readdirSync(LOCAL_DIR).filter(f => f.endsWith('.html') || f.endsWith('.png') || f.endsWith('.css') || f.endsWith('.js'));
console.log(JSON.stringify(files.slice(0, 10)));
console.log('Total files:', files.length);