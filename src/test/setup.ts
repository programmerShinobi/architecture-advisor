import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount any rendered tree after each test so renders don't accumulate in document.body
// (keeps axe scans fast and avoids cross-test duplicate-id / leakage).
afterEach(() => {
  cleanup();
});

// jsdom implements no scrolling API, so any component that scrolls (the chat transcript, the
// Guide's table of contents) throws on render under test rather than failing for a real reason.
// These are no-op stubs: scroll POSITION is never asserted here — that is what the browser-driven
// E2E specs are for — so faking it costs no coverage.
Element.prototype.scrollIntoView ??= () => {};
Element.prototype.scrollTo ??= () => {};
