const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = 'site-clean';
const files = [
  'index.html',
  'word-counter.html',
  'case-converter.html',
  'text-diff.html',
  'docx-word-count.html',
  'json-formatter.html',
  'base64.html',
  'url-encode.html',
  'jwt-decoder.html',
  'uuid-generator.html',
  'color-converter.html',
  'regex-tester.html',
  'cron-parser.html',
  'calculator.html',
  'url-shortener.html',
  'redirect-page-generator.html',
  'hash-generator.html',
  'timestamp-converter.html',
  'subnet-calculator.html',
  'dns-lookup.html',
  'http-headers.html',
  'password-strength.html',
  'password-generator.html',
  'security-headers.html',
  'email-header-analyzer.html',
  'spf-dkim-dmarc.html',
  'qr-code.html',
  'qr-decoder.html',
  'notepad.html',
  'carbon-footprint-calculator.html',
  'timezone-converter.html',
  'unit-converter.html',
  'currency-converter.html',
  'image-compressor.html',
  'image-resizer.html',
  'image-convert.html',
  'image-cropper.html',
  'image-metadata-viewer.html',
  'image-metadata-remover.html',
  'image-to-svg.html',
  'pdf-merge.html',
  'pdf-compress.html',
  'pdf-to-images.html',
  'pdf-split.html',
  'income-tax-calculator.html',
  'gst-calculator.html',
  'loan-calculator.html',
  'website-status-checker.html',
  'document-tools.html',
  'developer-tools.html',
  'network-tools.html',
  'security-tools.html',
  'productivity-tools.html',
  'image-tools.html',
  'pdf-tools.html',
  'finance-tools.html',
  'web-tools.html',
  'guides.html',
  'guide-subnet-planning.html',
  'guide-email-spoofing.html',
  'robots.txt',
  'logo-badge-800-transparent.png'
];

function fetchFile(url, outPath) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchFile(res.headers.location, outPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(res.statusCode + ' for ' + url)); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(outPath, buf);
        resolve({ file: path.basename(outPath), bytes: buf.length });
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

(async () => {
  const results = [];
  for (const f of files) {
    const url = 'https://techmanagerlab.com/tools/' + f;
    const outPath = path.join(outDir, f);
    try {
      const r = await fetchFile(url, outPath);
      results.push(r);
      console.log('OK ' + r.file.padEnd(38) + ' ' + r.bytes);
    } catch (e) {
      console.log('FAIL ' + f.padEnd(38) + ' ' + e.message);
    }
  }
  console.log('\nDone: ' + results.length + '/' + files.length + ' files');
})();