import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeFilename } from '../../shared/downloads.js';

test('sanitizeFilename: strips path chars', () => {
  assert.equal(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j'), 'abcdefghij');
});

test('sanitizeFilename: keeps dots and spaces', () => {
  assert.equal(sanitizeFilename('my file v2.pdf'), 'my file v2.pdf');
});

test('sanitizeFilename: empty falls back', () => {
  assert.equal(sanitizeFilename('', 'out.txt'), 'out.txt');
  assert.equal(sanitizeFilename(null, 'fallback'), 'fallback');
});

test('sanitizeFilename: collapses whitespace', () => {
  assert.equal(sanitizeFilename('a   b'), 'a b');
});
