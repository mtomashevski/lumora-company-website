import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const result = spawnSync(
  process.execPath,
  [resolve('node_modules/@playwright/test/cli.js'), 'test', '--config', 'playwright.v2.config.ts'],
  {
    env: { ...process.env, V2_TEST_DEV: '1' },
    stdio: 'inherit',
  },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
