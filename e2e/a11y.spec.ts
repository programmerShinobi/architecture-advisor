import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const APP = '/architecture-advisor/';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// AC-15 in a REAL browser — full WCAG A/AA including color-contrast (which needs layout/computed
// styles, so jsdom can't do it). Covers both themes and both modes.
function scan(page: Page) {
  return new AxeBuilder({ page }).withTags(TAGS).analyze();
}

// Scan under reduced-motion so the app's colour transitions (which it disables globally under
// prefers-reduced-motion) can't leave a half-toggled theme frame under axe — contrast is evaluated
// on the settled computed colours, which are identical with or without motion.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('no WCAG A/AA violations incl. color-contrast (Guided, dark theme)', async ({ page }) => {
  await page.goto(APP);
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Expert mode + light theme)', async ({ page }) => {
  await page.goto(APP);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('button', { name: 'Advisor', exact: true }).click(); // default view is now Home
  await page.getByRole('button', { name: 'Expert', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click(); // → light
  await page.getByRole('button', { name: /Adjust weights/ }).click(); // mount the override panel
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Manual/Guide, dark theme)', async ({ page }) => {
  await page.goto(APP);
  // Exact match: with English default, /Guide/ would also hit the "Guided" mode toggle.
  await page.getByRole('button', { name: /^(Guide|Panduan)$/ }).click();
  await expect(page.getByRole('dialog', { name: /Manual/ })).toBeVisible(); // lazy Manual chunk loaded
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Manual/Guide, light theme)', async ({ page }) => {
  await page.goto(APP);
  await page.getByRole('button', { name: /Toggle theme|Ganti tema/ }).click(); // → light
  await page.getByRole('button', { name: /^(Guide|Panduan)$/ }).click();
  await expect(page.getByRole('dialog', { name: /Manual/ })).toBeVisible();
  expect((await scan(page)).violations).toEqual([]);
});

async function openSeedArticle(page: Page) {
  // Works in either language (default is English; the ID toggle keeps "Wawasan" / "Katalog" alive).
  await page.getByRole('button', { name: /Insights|Wawasan/ }).click();
  await page.getByRole('button', { name: /Catalog|Katalog/ }).click();
  await page.getByRole('button', { name: /^Microservices/ }).first().click();
  // The architecture page rendered (option name is language-neutral, so this is i18n-agnostic).
  await expect(page.getByRole('heading', { name: 'Microservices' })).toBeVisible();
}

test('no WCAG A/AA violations incl. color-contrast (Learn article, dark theme)', async ({ page }) => {
  await page.goto(APP);
  await openSeedArticle(page);
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Learn article, light theme)', async ({ page }) => {
  await page.goto(APP);
  await page.getByRole('button', { name: /Toggle theme|Ganti tema/ }).click(); // → light before navigating
  await openSeedArticle(page);
  expect((await scan(page)).violations).toEqual([]);
});

test('controls are keyboard-operable', async ({ page }) => {
  await page.goto(APP);
  // Tab from the top lands on an interactive control (not stuck on <body>)
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  // a focused control activates via the keyboard (Enter on the language toggle switches to EN,
  // which renames the Indonesian preset chips to their English labels)
  await page.getByRole('button', { name: 'EN', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Advisor', exact: true }).click(); // default view is now Home
  await page.getByText('Choose a starting scenario').click();
  await expect(page.getByRole('button', { name: /Busy online shop/ })).toBeVisible();
});
