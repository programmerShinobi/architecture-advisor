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

    // The default view is now the Home landing — check it, then the Advisor, then Insights.
    await expect(page.getByRole('button', { name: /Insights|Wawasan/ })).toBeVisible();
    await assertNoHorizontalScroll(page, `Home @${vp.name}`);
    await page.getByRole('button', { name: /^(Advisor)$/ }).click();
    await assertNoHorizontalScroll(page, `Advisor @${vp.name}`);

    // Insights → Catalog → one architecture page.
    await page.getByRole('button', { name: /Insights|Wawasan/ }).click();
    await page.getByRole('button', { name: /Catalog|Katalog/ }).click();
    await page.getByRole('button', { name: /^Microservices/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Microservices' })).toBeVisible();
    await assertNoHorizontalScroll(page, `Insights article @${vp.name}`);
  });
}

test('phone tier: keyboard chrome hidden; mobile bottom bar + settings sheet carry nav and toggles', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto(APP);
  // ⌘K + "?" + the save indicator are hidden on phones (aa-hide-phone). The save indicator is the
  // regression trap: an inline `display` on its span once defeated the class (caught visually).
  await expect(page.getByRole('button', { name: /Command palette|palet/i })).toBeHidden();
  await expect(page.getByText(/All changes saved|Semua perubahan tersimpan/)).toBeHidden();
  // The Guide stays in the header; primary navigation moves to the fixed bottom tab bar.
  await expect(page.getByRole('button', { name: /^(Guide|Panduan)$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^(Advisor)$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^(Insights|Wawasan)$/ })).toBeVisible();
  // Theme / language / reading-mode move into the bottom "More" settings sheet.
  await page.getByRole('button', { name: /^(More|Lainnya)$/ }).click();
  await expect(page.getByRole('dialog', { name: /Settings|Pengaturan/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^(Dark|Gelap)$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'EN', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /^(Guided|Terpandu)$/ })).toBeVisible();
});
