import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer:
    process.env.TEST_PAGES_MODE === '1'
      ? {
          command: 'node --experimental-strip-types scripts/serve-pages.mjs',
          url: `http://127.0.0.1:4180${process.env.TEST_BASE_PATH || '/lumora-company-website/'}`,
          reuseExistingServer: false,
          timeout: 10000,
        }
      : undefined,
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:5173',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge',
    headless: true,
  },
  reporter: 'list',
});
