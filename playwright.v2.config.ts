import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/v2',
  testMatch: '**/*.spec.ts',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5190',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge',
    headless: true,
  },
  webServer: {
    command: process.env.V2_TEST_DEV === '1' ? 'pnpm dev:v2' : 'pnpm serve:v2',
    url: 'http://127.0.0.1:5190/health',
    reuseExistingServer: false,
    env: {
      PORT: '5190',
      HOST: '127.0.0.1',
      APP_ENV: 'development',
      LUMORA_SERVER_TEST_SENTINEL: 'PHASE1_SYNTHETIC_SERVER_SENTINEL_2026',
    },
    timeout: 30000,
  },
  reporter: 'list',
});
