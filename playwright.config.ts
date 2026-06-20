import { defineConfig, devices } from '@playwright/test';

// E2E runs against the dev server at the GitHub-Pages sub-path (vite `base`). A real browser is
// used so we can verify the things jsdom can't: color-contrast, keyboard operability, and the
// share-URL deep-link round-trip end to end.
const PORT = 5173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}/architecture-advisor/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
