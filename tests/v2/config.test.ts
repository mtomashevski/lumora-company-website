import test from 'node:test';
import assert from 'node:assert/strict';
import { readServerConfig } from '../../v2/app/server/config.server.ts';
import { isLocale, contentLocale } from '../../v2/app/locales.ts';

test('development defaults are safe and public DTO excludes supplied secrets', () => {
  const fixture = 'synthetic-test-value';
  const result = readServerConfig({
    PAYPAL_CLIENT_SECRET: fixture,
    SUPABASE_SECRET_KEY: fixture,
  });
  assert.deepEqual(result, { appEnv: 'development', siteOrigin: 'http://127.0.0.1:5190' });
  assert(!JSON.stringify(result).includes('synthetic-test-value'));
});
test('staging/production require explicit HTTPS origin', () => {
  assert.throws(() => readServerConfig({ VERCEL: '1' }), /explicit APP_ENV/);
  assert.throws(
    () => readServerConfig({ VERCEL: '1', APP_ENV: 'development' }),
    /explicit APP_ENV/,
  );
  for (const appEnv of ['staging', 'production']) {
    assert.throws(() => readServerConfig({ APP_ENV: appEnv }), /SITE_ORIGIN/);
    assert.throws(() => readServerConfig({ APP_ENV: appEnv, SITE_ORIGIN: 'http://example.test' }));
    assert.deepEqual(readServerConfig({ APP_ENV: appEnv, SITE_ORIGIN: 'https://example.test' }), {
      appEnv,
      siteOrigin: 'https://example.test',
    });
  }
});
test('reject invalid environments, credentials, paths and remote HTTP origins', () => {
  assert.throws(() => readServerConfig({ APP_ENV: 'preview' }));
  const credentialUrl = new URL('https://example.test');
  credentialUrl.username = 'x';
  credentialUrl.password = 'x';
  for (const origin of [
    credentialUrl.href,
    'https://example.test/path',
    'https://example.test/',
    'javascript:alert(1)',
    'http://example.test',
  ]) {
    assert.throws(() => readServerConfig({ SITE_ORIGIN: origin }));
  }
});
test('reject nonempty unapproved VITE variables without printing values', () => {
  for (const key of [
    'VITE_PAYPAL_CLIENT_SECRET',
    'VITE_SUPABASE_SERVICE_ROLE_KEY',
    'VITE_ANY_TOKEN',
    'VITE_UNREVIEWED',
  ]) {
    assert.throws(
      () => readServerConfig({ [key]: 'synthetic-private-value' }),
      (error: Error) =>
        error.message.includes(key) && !error.message.includes('synthetic-private-value'),
    );
  }
  assert.doesNotThrow(() =>
    readServerConfig({ VITE_SITE_URL: '', VITE_BASE_PATH: '', VITE_PAYPAL_CLIENT_SECRET: '' }),
  );
});
test('four locale routes have explicit existing-content fallback', () => {
  for (const locale of ['en', 'mk', 'it', 'tr']) assert(isLocale(locale));
  assert(!isLocale('de'));
  assert(!isLocale('../../admin'));
  assert.equal(contentLocale('mk'), 'mk');
  assert.equal(contentLocale('it'), 'en');
  assert.equal(contentLocale('tr'), 'en');
});
