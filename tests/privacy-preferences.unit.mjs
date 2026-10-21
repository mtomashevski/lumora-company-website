import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePrivacyPreferences } from '../src/utils/privacyPreferences.ts';

const valid = {
  version: 1,
  necessary: true,
  rememberLanguage: false,
  savedAt: '2026-10-21T10:00:00.000Z',
};
test('accepts current valid preferences without adding tracking categories', () => {
  assert.deepEqual(parsePrivacyPreferences(JSON.stringify(valid)), valid);
});
test('rejects missing, malformed, obsolete and incomplete records', () => {
  for (const value of [
    null,
    '',
    '{',
    'null',
    '[]',
    '{}',
    JSON.stringify({ ...valid, version: 2 }),
    JSON.stringify({ ...valid, necessary: false }),
    JSON.stringify({ ...valid, rememberLanguage: 'yes' }),
    JSON.stringify({ ...valid, savedAt: 'invalid' }),
  ]) {
    assert.equal(parsePrivacyPreferences(value), null, String(value));
  }
});
test('retains only known preference fields, never unrelated personal data', () => {
  assert.deepEqual(
    parsePrivacyPreferences(JSON.stringify({ ...valid, email: 'do-not-store@example.com' })),
    valid,
  );
});
