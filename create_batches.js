const fs = require('fs');
const path = require('path');

const LOCAL_DIR = 'E:/Projects/Tools Website/site-clean';
const allFiles = fs.readdirSync(LOCAL_DIR).sort().filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.svg') || f.endsWith('.txt'));

const BATCH_SIZE = 5;
const batches = [];
for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
  batches.push(allFiles.slice(i, i + BATCH_SIZE));
}

console.log('Total files:', allFiles.length);
console.log('Total batches:', batches.length);

// Save batch info
fs.writeFileSync('E:/Projects/Tools Website/batches.json', JSON.stringify(batches));
console.log('Saved batches.json');