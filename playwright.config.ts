import { defineConfig, devices } from '@playwright/test';

const E2E_PORT = 4273;
const E2E_BASE_URL = `http://127.0.0.1:${E2E_PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node scripts/serve-dist.mjs ${E2E_PORT}`,
    timeout: 120_000,
    url: E2E_BASE_URL,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
