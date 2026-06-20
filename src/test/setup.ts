import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount any rendered tree after each test so renders don't accumulate in document.body
// (keeps axe scans fast and avoids cross-test duplicate-id / leakage).
afterEach(() => {
  cleanup();
});
