const fs = require('fs');
const path = require('path');

const dir = 'site-clean';
const catMap = {
  'word-counter':'Document Tools','case-converter':'Document Tools','text-diff':'Document Tools','docx-word-count':'Document Tools',
  'json-formatter':'Developer Tools','base64':'Developer Tools','url-encode':'Developer Tools','jwt-decoder':'Developer Tools',
  'uuid-generator':'Developer Tools','color-converter':'Developer Tools','regex-tester':'Developer Tools','cron-parser':'Developer Tools',
  'calculator':'Developer Tools','url-shortener':'Developer Tools','redirect-page-generator':'Developer Tools','hash-generator':'Developer Tools',
  'timestamp-converter':'Developer Tools',
  'subnet-calculator':'Network Tools','dns-lookup':'Network Tools','http-headers':'Network Tools',
  'password-strength':'Security Tools','password-generator':'Security Tools','security-headers':'Security Tools',
  'email-header-analyzer':'Security Tools','spf-dkim-dmarc':'Security Tools',
  'qr-code':'Productivity','qr-decoder':'Productivity','notepad':'Productivity','timezone-converter':'Productivity',
  'unit-converter':'Productivity','currency-converter':'Productivity','carbon-footprint-calculator':'Productivity',
  'image-compressor':'Image Tools','image-resizer':'Image Tools','image-convert':'Image Tools','image-cropper':'Image Tools',
  'image-metadata-viewer':'Image Tools','image-metadata-remover':'Image Tools','image-to-svg':'Image Tools',
  'pdf-merge':'PDF Tools','pdf-compress':'PDF Tools','pdf-to-images':'PDF Tools','pdf-split':'PDF Tools',
  'income-tax-calculator':'Indian Finance','gst-calculator':'Indian Finance','loan-calculator':'Indian Finance',
  'website-status-checker':'Web Tools'
};
const hubPages = ['index','document-tools','developer-tools','network-tools','security-tools','productivity-tools','image-tools','pdf-tools','finance-tools','web-tools','guides','guide-subnet-planning','guide-email-spoofing'];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const rows = [];
for (const f of files) {
  const slug = f.replace(/\.html$/, '');
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [, ''])[1].trim();
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1].trim();
  const hasFetch = /fetch\(/.test(html);
  const hasXHR = /XMLHttpRequest/.test(html);
  const hasFileInput = /<input[^>]+type=["']file["']/.test(html);
  const cdn = [...html.matchAll(/https:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)\/[^"'\s)]+/g)].map(m => m[0]);
  const extApi = [...html.matchAll(/https:\/\/(?!cdn\.|unpkg|cdnjs)[a-z0-9.-]+\.[a-z]{2,}\/[^"'\s)]*/gi)].map(m => m[0]).filter(u => !/techmanagerlab\.com|google\.com\/maps|schema\.org|w3\.org/.test(u));
  const isHub = hubPages.includes(slug);
  const category = isHub ? (slug === 'index' ? 'Hub' : slug.startsWith('guide') ? 'Guides' : 'Category Hub') : (catMap[slug] || 'UNMAPPED');
  const model = (hasFetch || hasXHR) ? 'network' : hasFileInput ? 'local-file' : 'local';
  rows.push({
    name: title.replace(/\s*—\s*TML.*$/, ''),
    slug, url: f, category,
    processingModel: model,
    dependencies: [...new Set(cdn.map(u => u.split('/').slice(4, 6).join('/')))],
    externalEndpoints: [...new Set(extApi.map(u => u.split('/').slice(0, 3).join('/')))],
    hasFileInput,
    metaDescription: desc ? 'yes' : 'NO',
    testStatus: 'untested',
    lastVerified: '2026-10-31'
  });
}

rows.sort((a, b) => a.category.localeCompare(b.category) || a.slug.localeCompare(b.slug));
fs.writeFileSync(path.join(dir, 'tools-inventory.json'), JSON.stringify(rows, null, 2));

const missing = Object.keys(catMap).filter(s => !files.includes(s + '.html'));
const noDesc = rows.filter(r => r.metaDescription === 'NO' && r.category !== 'Hub').map(r => r.slug);
const net = rows.filter(r => r.processingModel === 'network').map(r => r.slug);
const unmapped = rows.filter(r => r.category === 'UNMAPPED').map(r => r.slug);

console.log('total html:', rows.length);
console.log('tools:', rows.filter(r => !['Hub','Category Hub','Guides'].includes(r.category)).length);
console.log('missing (in catMap, no file):', missing.join(', ') || 'none');
console.log('unmapped slugs:', unmapped.join(', ') || 'none');
console.log('no meta description:', noDesc.join(', ') || 'none');
console.log('network tools:', net.join(', ') || 'none');
const byCat = {};
for (const r of rows) byCat[r.category] = (byCat[r.category] || 0) + 1;
console.log('by category:', JSON.stringify(byCat));