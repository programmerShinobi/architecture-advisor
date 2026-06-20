import { test, expect, type Page } from '@playwright/test';

const APP = '/architecture-advisor/';
const VERDICT = /leads at \d+%|within \d+ points/;

// The app loads in Indonesian; pin English for stable assertions (exact match — "EN" is otherwise
// a substring of many Indonesian labels).
async function english(page: Page) {
  await page.goto(APP);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
}

test('the four-step flow loads and the recommendation recomputes on a preset', async ({ page }) => {
  await english(page);

  await expect(page.getByText('Architecture Advisor')).toBeVisible();
  const verdict = page.getByText(VERDICT);
  await expect(verdict).toBeVisible();
  const before = (await verdict.textContent())?.trim();

  // applying a preset instantly recomputes the recommendation (AC-2, real browser)
  await page.getByRole('button', { name: 'Busy online shop' }).click();
  await expect(page.getByText(VERDICT)).not.toHaveText(before ?? '');
});

test('the primary export downloads a MADR markdown file', async ({ page }) => {
  await english(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    // guided label for the ADR/save action
    page.getByRole('button', { name: /Save as a document/ }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.md$/);
});
