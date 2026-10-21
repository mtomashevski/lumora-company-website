// Run against real Nginx serving a root-path production build, not the Pages emulator.
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { URL } from 'node:url';
import { readFile, readdir } from 'node:fs/promises';
import { request as httpRequest } from 'node:http';
import path from 'node:path';
import { test } from 'node:test';

const origin = process.env.NGINX_TEST_ORIGIN || 'http://127.0.0.1:8080';
const headers = { Host: 'university.example', 'X-Forwarded-Proto': 'https' };
const request = (route) =>
  new Promise((resolve, reject) => {
    const outgoing = httpRequest(origin + route, { headers }, (incoming) => {
      const chunks = [];
      incoming.on('data', (chunk) => chunks.push(chunk));
      incoming.on('error', reject);
      incoming.on('end', () =>
        resolve({
          status: incoming.statusCode,
          headers: { get: (name) => incoming.headers[name] ?? null },
          text: async () => Buffer.concat(chunks).toString('utf8'),
        }),
      );
    });
    outgoing.on('error', reject);
    outgoing.setTimeout(5000, () => outgoing.destroy(new Error('Nginx request timed out')));
    outgoing.end();
  });
const routes = [];
async function discover(directory, route = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory())
      await discover(path.join(directory, entry.name), route + entry.name + '/');
    else if (entry.name === 'index.html') routes.push('/' + route);
  }
}
await discover('dist');
assert.equal(routes.length, 16, 'Build all public routes before running the Nginx regression');

for (const route of routes) {
  test(`Nginx serves ${route} directly and keeps redirects behind ingress`, async () => {
    const expected = await readFile(path.join('dist', route.slice(1), 'index.html'), 'utf8');
    assert.match(expected, /src="\/assets\//, 'This check requires the RepoRun root build');
    assert.doesNotMatch(expected, /rel="canonical"|property="og:url"/);
    for (const query of ['', '?source=refresh&language=mk']) {
      const response = await request(route + query);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('location'), null);
      assert.match(response.headers.get('content-type'), /text\/html/);
      assert.equal(await response.text(), expected);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      if (route !== '/') {
        const redirect = await request(route.slice(0, -1) + query);
        assert.equal(redirect.status, 301);
        assert.equal(redirect.headers.get('location'), route + query);
        const resolved = new URL(redirect.headers.get('location'), 'https://university.example');
        assert.equal(resolved.origin, 'https://university.example');
      }
    }
  });
}

test('Nginx health, error handling, private paths and compiled assets remain available', async () => {
  const health = await request('/healthz');
  assert.equal(health.status, 200);
  assert.equal(await health.text(), 'ok\n');
  for (const route of [
    '/missing',
    '/news/missing/',
    '/experiences/missing/',
    '/assets/missing.js',
  ]) {
    assert.equal((await request(route)).status, 404, route);
  }
  for (const route of ['/.env', '/.git/config', '/src/App.tsx', '/Dockerfile']) {
    assert.equal((await request(route)).status, 403, route);
  }
  const html = await readFile('dist/index.html', 'utf8');
  for (const asset of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    const response = await request(asset[1]);
    assert.equal(response.status, 200, asset[1]);
    assert.match(response.headers.get('cache-control'), /immutable/);
  }
});
