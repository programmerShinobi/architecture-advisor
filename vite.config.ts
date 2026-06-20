/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the app from a sub-path (the repo name). See
// docs/06-deployment/deployment-github-pages.md. Override at build time with `vite build --base=/`.
export default defineConfig({
  base: '/architecture-advisor/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    // Vitest owns the unit/component tests in src/; the e2e/ Playwright specs run via `playwright test`.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
