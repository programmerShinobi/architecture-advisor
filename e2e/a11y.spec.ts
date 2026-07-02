import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const APP = '/architecture-advisor/';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// AC-15 in a REAL browser — full WCAG A/AA including color-contrast (which needs layout/computed
// styles, so jsdom can't do it). Covers both themes and both modes.
function scan(page: Page) {
  return new AxeBuilder({ page }).withTags(TAGS).analyze();
}

test('no WCAG A/AA violations incl. color-contrast (Guided, dark theme)', async ({ page }) => {
  await page.goto(APP);
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Expert mode + light theme)', async ({ page }) => {
  await page.goto(APP);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('button', { name: 'Expert', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click(); // → light
  await page.getByRole('button', { name: /Adjust weights/ }).click(); // mount the override panel
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Manual/Guide, dark theme)', async ({ page }) => {
  await page.goto(APP);
  // Default language is Indonesian, so the Manual button is labelled "Panduan".
  await page.getByRole('button', { name: /Guide|Panduan/ }).click();
  await expect(page.getByRole('dialog', { name: /Manual/ })).toBeVisible(); // lazy Manual chunk loaded
  expect((await scan(page)).violations).toEqual([]);
});

test('no WCAG A/AA violations incl. color-contrast (Manual/Guide, light theme)', async ({ page }) => {
  await page.goto(APP);
  await page.getByRole('button', { name: /Toggle theme|Ganti tema/ }).click(); // → light
  await page.getByRole('button', { name: /Guide|Panduan/ }).click();
  await expect(page.getByRole('dialog', { name: /Manual/ })).toBeVisible();
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
  await expect(page.getByRole('button', { name: 'Busy online shop' })).toBeVisible();
});
