import { test } from 'node:test';
import assert from 'node:assert/strict';

test('node test harness is ready', () => {
  assert.equal(typeof test, 'function');
  assert.ok(true);
});
