import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';
import { hydrateFromUrl } from './lib/urlState';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
// Aurora Slate display face (ADR-009)
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import './index.css';

// Recover from a stale lazy chunk after a deploy replaced the hashed files mid-session (the classic
// SPA + auto-updating service worker footgun). Vite fires `vite:preloadError` when a code-split
// chunk fails to load; reload once to fetch the fresh index.html + new hashed chunks. Time-boxed so
// a genuinely missing chunk can never cause a reload loop.
window.addEventListener('vite:preloadError', () => {
  const key = 'aa-chunk-reload-at';
  const last = Number(sessionStorage.getItem(key) ?? 0);
  if (Date.now() - last < 10_000) return;
  sessionStorage.setItem(key, String(Date.now()));
  window.location.reload();
});

// Apply a shared scenario (#s=...) into localStorage before the app reads its persisted state.
// A shared link should land on the Advisor (to show the restored scenario), not the home landing.
if (hydrateFromUrl()) {
  try {
    localStorage.setItem('aa.main', JSON.stringify('advisor'));
  } catch {
    /* ignore storage errors */
  }
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
