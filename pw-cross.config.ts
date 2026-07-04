import { defineConfig, devices } from '@playwright/test';

// OPTIONAL cross-engine E2E config (test-plan §3.3) — NOT run in CI. CI gates on Chromium
// (playwright.config.ts); this config re-runs the same specs on the Firefox (Gecko) and
// Safari (WebKit) engines, incl. an iPhone emulation, for pre-release manual verification
// of the evergreen baseline (SRS §2.3).
//
// One-time setup:  npx playwright install webkit firefox
//                  sudo npx playwright install-deps   # WebKit needs a few host libraries
// Run:             npx playwright test --config=pw-cross.config.ts
// Or one engine:   npx playwright test --config=pw-cross.config.ts --project=webkit
//
// Known quirk: a11y "Expert + light theme" can flake on non-Chromium engines — axe may scan
// mid theme-transition (0.15s) and report blended colors (e.g. #366fed). Verified not a real
// contrast defect: applying the theme pre-paint yields 0 violations on every engine.
const PORT = 5173;

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'safari-ios', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}/architecture-advisor/`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
