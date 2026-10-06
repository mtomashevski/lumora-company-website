import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createRequestHandler } from 'react-router';
const result = spawnSync(
  process.execPath,
  [resolve('node_modules/@react-router/dev/bin.js'), 'build'],
  {
    cwd: resolve('v2'),
    env: { ...process.env, V2_VERCEL_BUILD: '1' },
    stdio: 'inherit',
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
if (result.status === 0) {
  // Run the actual generated Node bundle; this is a local check, not a deployment.
  const output = JSON.parse(await readFile('v2/.vercel/react-router-build-result.json', 'utf8'));
  const bundles = Object.values(output.buildManifest.serverBundles);
  assert(bundles.length > 0, 'Vercel preset produced no server bundle');
  for (const bundle of bundles) {
    const server = await import(pathToFileURL(resolve('v2', bundle.file)).href);
    const response = await createRequestHandler(
      server,
      'production',
    )(new Request('http://127.0.0.1:5190/en/'));
    assert.equal(response.status, 200);
    assert((await response.text()).includes('Lumora Company'));
    assert.equal(server.ssr, true);
  }
  console.log(`PASS: ${bundles.length} Vercel Node server bundle(s) executed locally with SSR.`);
}
