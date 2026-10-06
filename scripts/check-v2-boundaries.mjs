import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const sentinel = 'PHASE1_SYNTHETIC_SERVER_SENTINEL_2026';
const cli = resolve('node_modules/@react-router/dev/bin.js');
function build(extra = {}) {
  return spawnSync(process.execPath, [cli, 'build'], {
    cwd: resolve('v2'),
    env: {
      ...process.env,
      LUMORA_SERVER_TEST_SENTINEL: sentinel,
      PAYPAL_CLIENT_SECRET: sentinel,
      SUPABASE_SECRET_KEY: sentinel,
      RESEND_API_KEY: sentinel,
      ...extra,
    },
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
}
const result = build();
assert.equal(result.status, 0, result.stdout + result.stderr);
async function scan(directory) {
  let files = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files += await scan(path);
      continue;
    }
    if (!/\.(js|json|map|html|css)$/.test(entry.name)) continue;
    const source = await readFile(path, 'utf8');
    assert(!source.includes(sentinel), `Server sentinel leaked: ${path}`);
    assert(!source.includes('node:crypto'), `Node server module leaked: ${path}`);
    assert(
      !source.includes('LUMORA_SERVER_TEST_SENTINEL'),
      `Server environment access leaked: ${path}`,
    );
    files++;
  }
  return files;
}
const files = await scan(resolve('v2/build/client'));

// Exercise the framework's actual negative-build guard, restoring source in finally.
// Do not run this mutation test concurrently with another V2 build/dev server.
const route = resolve('v2/app/routes/catalog.tsx');
const original = await readFile(route, 'utf8');
const anchor = 'const [clicks, setClicks] = useState(0);';
assert(original.includes(anchor), 'Boundary test anchor changed; update the test deliberately');
try {
  await writeFile(route, original.replace(anchor, anchor + '\n  serverProof();'));
  const rejected = build({ V2_BOUNDARY_TEST: '1' });
  assert.notEqual(rejected.status, 0, 'Client import of a .server module was accepted');
  assert.match(rejected.stdout + rejected.stderr, /Server-only module referenced by client/);
} finally {
  await writeFile(route, original);
}
console.log(
  `PASS: scanned ${files} browser artifacts; framework rejected a client/server boundary violation.`,
);
