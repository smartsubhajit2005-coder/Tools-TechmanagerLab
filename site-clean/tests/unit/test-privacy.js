import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getDisclosureText } from '../../shared/privacy.js';

test('local tool: generic local text', () => {
  const t = getDisclosureText('word-counter', 'local');
  assert.match(t, /browser tab/i);
  assert.match(t, /no data is sent to a server/i);
});

test('network tool: dns discloses google', () => {
  const t = getDisclosureText('dns-lookup', 'network');
  assert.match(t, /dns\.google/i);
  assert.match(t, /Google/i);
});

test('network tool: status checker discloses proxies', () => {
  const t = getDisclosureText('website-status-checker', 'network');
  assert.match(t, /allorigins/i);
  assert.match(t, /corsproxy/i);
});

test('network tool: unknown slug gets generic network text', () => {
  const t = getDisclosureText('mystery-tool', 'network');
  assert.match(t, /external/i);
});

test('local tool: never mentions external', () => {
  const t = getDisclosureText('json-formatter', 'local');
  assert.doesNotMatch(t, /external|proxy|upload/i);
});
