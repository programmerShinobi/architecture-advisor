import { test, expect } from '@playwright/test';

const APP = '/architecture-advisor/';
const VERDICT = /leads at \d+%|within \d+ points/;

// AC-14, end to end in a real browser: a share link encodes the full scenario in the URL hash
// (#s=…) and re-opening it restores the exact recommendation.
test('share link round-trips the scenario via a deep link', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto(APP);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('button', { name: 'Busy online shop' }).click();
  const shared = (await page.getByText(VERDICT).textContent())?.trim();

  // Share copies the deep link to the clipboard
  await page.getByRole('button', { name: /Share a link/ }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('#s=');
  const url = await page.evaluate(() => navigator.clipboard.readText());

  // Opening the link in a fresh page restores the same recommendation (lang is part of the snapshot)
  const page2 = await context.newPage();
  await page2.goto(url);
  await expect(page2.getByText(VERDICT)).toHaveText(shared ?? '');
});
