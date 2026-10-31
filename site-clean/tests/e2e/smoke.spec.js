import { test, expect } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, '..', '..');

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const filePath = path.join(siteDir, p);
      if (!filePath.startsWith(siteDir)) { res.writeHead(403); res.end('forbidden'); return; }
      fs.readFile(filePath, (err, buf) => {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        const ext = path.extname(filePath).toLowerCase();
        const types = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(buf);
      });
    });
    server.listen(0, () => resolve(server));
  });
}

const tools = [
  ['word-counter', 'textarea'],
  ['json-formatter', 'textarea'],
  ['subnet-calculator', 'input'],
  ['password-strength', 'input'],
  ['jwt-decoder', 'textarea'],
  ['income-tax-calculator', 'input'],
];

for (const [slug, tag] of tools) {
  test(`${slug} loads and renders`, async ({ page }) => {
    const server = await startServer();
    const port = server.address().port;
    const url = `http://localhost:${port}/${slug}.html`;
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const banner = await page.locator('.tml-privacy').first();
    await expect(banner).toBeVisible();
    const input = await page.locator(tag).first();
    await expect(input).toBeVisible();
    const out = await page.locator('#out, #msg, .out, .box, .lbl, #l, #h, #p, #f').first();
    await expect(out).toBeVisible();
    expect(errors).toEqual([]);
    server.close();
  });
}

test('dns-lookup loads and shows network banner', async ({ page }) => {
  const server = await startServer();
  const port = server.address().port;
  const url = `http://localhost:${port}/dns-lookup.html`;
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const banner = await page.locator('.tml-privacy-net').first();
  await expect(banner).toBeVisible();
  expect(errors).toEqual([]);
  server.close();
});