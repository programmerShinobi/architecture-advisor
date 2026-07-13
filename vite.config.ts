/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves the app from a sub-path (the repo name). See
// docs/06-deployment/deployment-github-pages.md. Override at build time with `vite build --base=/`.
export default defineConfig({
  base: '/architecture-advisor/',
  plugins: [
    react(),
    // PWA: installable + offline app shell. `autoUpdate` → Workbox generates a precache of the
    // (hashed) shell assets and the SW skip-waits/claims so a new deploy replaces the old cache with
    // no stale-version footgun. Fonts are runtime-cached on demand (kept out of precache to keep it
    // lean); the crawlable SEO snapshots under insights/ are excluded (served from network).
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Architecture Advisor',
        short_name: 'ArchAdvisor',
        description:
          'A transparent, quality-attribute-driven decision-support tool for choosing software architecture — and always explaining why.',
        lang: 'en',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#05060f',
        theme_color: '#05060f',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        globIgnores: ['**/insights/**'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\/insights\//, /\/sitemap\.xml$/, /\/robots\.txt$/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\.woff2$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aa-fonts',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      // The SW is disabled in dev so it never interferes with local dev / Playwright e2e.
      devOptions: { enabled: false },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    // Vitest owns the unit/component tests in src/; the e2e/ Playwright specs run via `playwright test`.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
