import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from './App';
import { renderWithI18n } from './test/render';

// AC-15 (the names / roles / ARIA half) — automated with axe-core against WCAG A/AA rules.
// color-contrast is excluded because jsdom has no layout engine to compute it; AA contrast stays
// on the manual release checklist (it needs a real browser). Asserting on results.violations (not
// a custom matcher) keeps the tsc build free of matcher type-augmentation.
async function violations(container: HTMLElement): Promise<string[]> {
  const results = await axe(container, {
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    rules: { 'color-contrast': { enabled: false } },
    // Only fully process violations — skipping pass/incomplete node detail keeps axe fast on the
    // large composed-App DOM (otherwise it crawls under parallel worker load).
    resultTypes: ['violations'],
  });
  return (results.violations ?? []).map((v) => `${v.id} — ${v.nodes.length} node(s)`);
}

// A generous timeout: axe on the whole app is heavier than a unit test, especially when the
// vitest workers run in parallel.
const A11Y_TIMEOUT = 30_000;

describe('Accessibility (AC-15) — axe-core, WCAG A/AA', () => {
  beforeEach(() => localStorage.clear());

  it(
    'the composed app has no WCAG A/AA violations',
    async () => {
      const { container } = renderWithI18n(<App />, 'en');
      expect(await violations(container)).toEqual([]);
    },
    A11Y_TIMEOUT,
  );

  it(
    'no violations with Expert mode + the weight-override panel open',
    async () => {
      const { container } = renderWithI18n(<App />, 'en');
      fireEvent.click(screen.getByRole('button', { name: 'Expert' }));
      fireEvent.click(screen.getByRole('button', { name: /Adjust weights/ }));
      expect(await violations(container)).toEqual([]);
    },
    A11Y_TIMEOUT,
  );

  it(
    'no violations in the Manual/Guide with the detailed architecture explanations (lazy-loaded)',
    async () => {
      const { container } = renderWithI18n(<App />, 'en');
      fireEvent.click(screen.getByRole('button', { name: 'Guide' }));
      // Wait for the lazy Manual chunk to resolve and render its dialog.
      await screen.findByRole('dialog', { name: /Manual/i });
      expect(await violations(container)).toEqual([]);
    },
    A11Y_TIMEOUT,
  );

  it(
    'no violations in the Learn content area, including an open article (lazy-loaded)',
    async () => {
      const { container } = renderWithI18n(<App />, 'en');
      fireEvent.click(screen.getByRole('button', { name: 'Insights' }));
      // Drill into the Catalog (data-driven, all architectures) and open one architecture page.
      fireEvent.click(await screen.findByRole('button', { name: /Catalog/ }));
      fireEvent.click(await screen.findByRole('button', { name: /Microservices/ }));
      await screen.findByText('TL;DR');
      expect(await violations(container)).toEqual([]);
    },
    A11Y_TIMEOUT,
  );
});
