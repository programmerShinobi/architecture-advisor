import { test, expect, type Page } from '@playwright/test';

const APP = '/architecture-advisor/';
// Canonical breakpoints (design-spec §6.1): phone ≤640 · tablet 641–1024 · laptop ≥1025.
const VIEWPORTS = [
  { name: 'phone-360', width: 360, height: 740 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1440', width: 1440, height: 900 },
];

async function assertNoHorizontalScroll(page: Page, where: string) {
  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement ?? document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(overflow, `${where}: horizontal overflow of ${overflow}px`).toBeLessThanOrEqual(1);
}

for (const vp of VIEWPORTS) {
  test(`no horizontal scroll on Advisor + an Insights article (${vp.name})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(APP);

    // Advisor (default view) renders inside the viewport.
    await expect(page.getByRole('button', { name: /Insights|Wawasan/ })).toBeVisible();
    await assertNoHorizontalScroll(page, `Advisor @${vp.name}`);

    // Insights → Catalog → one architecture page.
    await page.getByRole('button', { name: /Insights|Wawasan/ }).click();
    await page.getByRole('button', { name: /Catalog|Katalog/ }).click();
    await page.getByRole('button', { name: 'Microservices' }).first().click();
    await expect(page.getByRole('heading', { name: 'Microservices' })).toBeVisible();
    await assertNoHorizontalScroll(page, `Insights article @${vp.name}`);
  });
}

test('phone tier hides keyboard-centric chrome but keeps core actions reachable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto(APP);
  // ⌘K + "?" are hidden on phones (aa-hide-phone) …
  await expect(page.getByRole('button', { name: /Command palette|palet/i })).toBeHidden();
  // … while the Guide, mode toggle, language, and theme stay usable.
  await expect(page.getByRole('button', { name: /Guide|Panduan/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Toggle theme|Ganti tema/ })).toBeVisible();
});
