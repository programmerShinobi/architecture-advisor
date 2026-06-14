import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';
import { hydrateFromUrl } from './lib/urlState';
import './index.css';

// Apply a shared scenario (#s=...) into localStorage before the app reads its persisted state.
hydrateFromUrl();

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
