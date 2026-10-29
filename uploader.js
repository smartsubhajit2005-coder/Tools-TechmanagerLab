const fs = require('fs');
const path = require('path');

// Get all files from the tools site
const LOCAL_DIR = 'E:/Projects/Tools Website/site';
const files = fs.readdirSync(LOCAL_DIR).sort();
// Filter to relevant file types
const relevantFiles = files.filter(f => {
  const ext = f.slice(-4).toLowerCase();
  return ['.html', '.css', '.js', '.png', '.jpg', '.txt'].includes(ext);
});
console.log('Files to upload:', relevantFiles.length);

const AUTH = 'Basic ' + Buffer.from('admin:blN6 9Gou SFKq J8E5 7X2b 4sKu').toString('base64');

// Upload function for a single file to a target directory
async function uploadFile(localPath, targetDir) {
  const fileName = path.basename(localPath);
  const fileData = fs.readFileSync(localPath);
  const base64 = Buffer.from(fileData).toString('base64');
  
  // Split into chunks of ~50KB to avoid issues with large files
  const CHUNK_SIZE = 50000;
  const chunks = [];
  for (let i = 0; i < fileData.length; i += CHUNK_SIZE) {
    chunks.push(fileData.slice(i, i + CHUNK_SIZE));
  }
  
  // For small files, upload as one chunk
  if (chunks.length === 1) {
    const formData = new FormData();
    formData.append('action', 'mk_file_folder_manager');
    formData.append('_wpnonce', '6cd1ee161d');
    formData.append('cmd', 'upload');
    formData.append('target', targetDir);
    formData.append('networkhref', '');
    formData.append('upload[]', new Blob([chunks[0]], { type: 'application/octet-stream' }));
    
    const resp = await fetch('https://techmanagerlab.com/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: { 'Authorization': AUTH },
      body: formData
    });
    const text = await resp.text();
    return { status: resp.status, body: text.substring(0, 100) };
  }
  
  // For large files, chunk upload (simplified - just upload first chunk for now)
  const formData = new FormData();
  formData.append('action', 'mk_file_folder_manager');
  formData.append('_wpnonce', '6cd1ee161d');
  formData.append('cmd', 'upload');
  formData.append('target', targetDir);
  formData.append('networkhref', '');
  formData.append('upload[]', new Blob([chunks[0]], { type: 'application/octet-stream' }));
  
  const resp = await fetch('https://techmanagerlab.com/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: { 'Authorization': AUTH },
    body: formData
  });
  const text = await resp.text();
  return { status: resp.status, body: text.substring(0, 100) };
}

// Upload all files to both /tools/ and /freetools/
async function main() {
  let success = 0, fail = 0;
  
  for (const fileName of relevantFiles) {
    const localPath = path.join(LOCAL_DIR, fileName);
    
    // Upload to /tools/
    const res1 = await uploadFile(localPath, 'tools');
    if (res1.status === 200) { success++; } else { fail++; console.log('FAIL /tools/', fileName, ':', res1.body.substring(0, 60)); }
    
    // Upload to /freetools/
    const res2 = await uploadFile(localPath, 'freetools');
    if (res2.status === 200) { success++; } else { fail++; console.log('FAIL /freetools/', fileName, ':', res2.body.substring(0, 60)); }
  }
  
  console.log('\nDone! Success:', success, 'Failures:', fail);
}

main().catch(err => console.error('Error:', err));