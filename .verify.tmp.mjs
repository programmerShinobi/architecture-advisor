import { chromium } from '@playwright/test';
const b = await chromium.launch();
// Mobile: open Guide, tap bottom tab, assert Guide closed (the z-index overlap bug)
const ph = await b.newPage({ viewport: { width: 390, height: 850 }, hasTouch: true });
await ph.goto('http://localhost:4173/architecture-advisor/');
await ph.waitForTimeout(900);
await ph.getByRole('button', { name: /Guide|Panduan/ }).first().click();
await ph.waitForTimeout(600);
const opened = await ph.getByRole('dialog').isVisible();
await ph.locator('.aa-tab').nth(2).click(); // bottom tab bar → Insights
await ph.waitForTimeout(500);
const closed = !(await ph.getByRole('dialog').isVisible().catch(() => false));
console.log('MOBILE: guide opened =', opened, '| closed after tab tap =', closed);
// Desktop: same via top nav
const d = await b.newPage({ viewport: { width: 1280, height: 900 } });
await d.goto('http://localhost:4173/architecture-advisor/');
await d.waitForTimeout(800);
await d.getByRole('button', { name: /Guide/ }).first().click();
await d.waitForTimeout(500);
const dOpened = await d.getByRole('dialog').isVisible();
await d.locator('nav.aa-topnav button').nth(0).click(); // Home
await d.waitForTimeout(400);
const dClosed = !(await d.getByRole('dialog').isVisible().catch(() => false));
console.log('DESKTOP: guide opened =', dOpened, '| closed after tab click =', dClosed);
await b.close(); process.exit(0);
