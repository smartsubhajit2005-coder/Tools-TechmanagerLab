import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidText,
  isValidFile,
  isValidURL,
  isValidJSON,
  isValidBase64,
  formatFileSize,
} from '../../shared/validators.js';

test('isValidText: empty fails', () => {
  assert.equal(isValidText('').valid, false);
  assert.equal(isValidText('   ').valid, false);
});

test('isValidText: normal passes', () => {
  assert.equal(isValidText('hello').valid, true);
});

test('isValidText: max enforced', () => {
  const big = 'x'.repeat(101);
  assert.equal(isValidText(big, { max: 100 }).valid, false);
});

test('isValidText: non-string fails', () => {
  assert.equal(isValidText(null).valid, false);
  assert.equal(isValidText(123).valid, false);
});

test('isValidFile: rejects oversize', () => {
  const f = { name: 'a.pdf', size: 50 * 1024 * 1024, type: 'application/pdf' };
  const r = isValidFile(f, { maxSize: 10 * 1024 * 1024 });
  assert.equal(r.valid, false);
  assert.match(r.error, /maximum/i);
});

test('isValidFile: rejects wrong type', () => {
  const f = { name: 'a.exe', size: 100, type: 'application/x-msdownload' };
  const r = isValidFile(f, { allowedTypes: ['application/pdf'] });
  assert.equal(r.valid, false);
  assert.match(r.error, /unsupported/i);
});

test('isValidFile: accepts valid', () => {
  const f = { name: 'a.pdf', size: 1000, type: 'application/pdf' };
  assert.equal(isValidFile(f, { allowedTypes: ['application/pdf'] }).valid, true);
});

test('isValidFile: extension fallback when type empty', () => {
  const f = { name: 'a.pdf', size: 100, type: '' };
  assert.equal(isValidFile(f, { allowedTypes: ['application/pdf'] }).valid, true);
});

test('isValidURL: rejects non-http', () => {
  assert.equal(isValidURL('ftp://x.com').valid, false);
  assert.equal(isValidURL('javascript:alert(1)').valid, false);
});

test('isValidURL: accepts https', () => {
  assert.equal(isValidURL('https://example.com').valid, true);
});

test('isValidJSON: valid passes', () => {
  assert.equal(isValidJSON('{"a":1}').valid, true);
});

test('isValidJSON: invalid reports line', () => {
  const r = isValidJSON('{\n  "a": ,\n}');
  assert.equal(r.valid, false);
  assert.match(r.error, /line \d+/);
});

test('isValidBase64: valid passes', () => {
  assert.equal(isValidBase64('SGVsbG8=').valid, true);
});

test('isValidBase64: invalid chars fail', () => {
  assert.equal(isValidBase64('!!!not base64!!!').valid, false);
});

test('formatFileSize: bytes', () => {
  assert.equal(formatFileSize(500), '500 B');
  assert.equal(formatFileSize(2048), '2 KB');
  assert.equal(formatFileSize(1536), '1.5 KB');
  assert.equal(formatFileSize(5 * 1024 * 1024), '5 MB');
});

test('formatFileSize: negative/NaN safe', () => {
  assert.equal(formatFileSize(-1), '0 B');
  assert.equal(formatFileSize(NaN), '0 B');
});
