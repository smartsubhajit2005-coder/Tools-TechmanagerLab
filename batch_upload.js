const fs = require('fs');
const path = require('path');

const LOCAL_DIR = 'E:/Projects/Tools Website/site';
const files = fs.readdirSync(LOCAL_DIR).filter(f => f.endsWith('.html') || f.endsWith('.png') || f.endsWith('.css') || f.endsWith('.js'));

// Output the first 5 files as JSON with their content base64-encoded
const batch = files.slice(0, 5).map(f => {
  const content = fs.readFileSync(path.join(LOCAL_DIR, f));
  return { name: f, base64: content.toString('base64') };
});

fs.writeFileSync('E:/Projects/Tools Website/batch1.json', JSON.stringify(batch));
console.log('Batch 1 prepared:', batch.map(b => b.name));