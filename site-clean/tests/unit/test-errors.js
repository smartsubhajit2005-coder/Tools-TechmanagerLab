import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatError, formatSuccess, escapeHTML } from '../../shared/errors.js';

test('escapeHTML: strips dangerous chars', () => {
  assert.equal(escapeHTML('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  assert.equal(escapeHTML("it's"), 'it&#39;s');
  assert.equal(escapeHTML('a & b'), 'a &amp; b');
});

test('formatError: escapes message', () => {
  const r = formatError('<b>bad</b>');
  assert.equal(r.text, '<b>bad</b>');
  assert.match(r.html, /&lt;b&gt;bad&lt;\/b&gt;/);
  assert.doesNotMatch(r.html, /<b>bad<\/b>/);
});

test('formatError: includes code', () => {
  const r = formatError('fail', { code: 404 });
  assert.match(r.html, /404/);
});

test('formatError: null safe', () => {
  const r = formatError(null);
  assert.equal(r.text, 'Unknown error');
});

test('formatSuccess: polite role', () => {
  const r = formatSuccess('done');
  assert.match(r.html, /role="status"/);
  assert.match(r.html, /aria-live="polite"/);
});
