#!/usr/bin/env node
// Performance guard (Phase 5 / NFR): the shipped JS + CSS must stay within a gzip budget, so a
// heavy dependency (e.g. re-adding a chart/diagram library) can't silently bloat the bundle.
// Fonts are excluded — they are separate woff/woff2 files lazy-loaded via `font-display: swap`.
// Run AFTER `npm run build`. Dependency-free, like the other guards.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Two budgets in gzipped kB:
//  - INITIAL JS = what actually loads on first paint: the entry module referenced by dist/index.html
//    plus every chunk Vite marks for eager loading there (<script type=module> + <link modulepreload>).
//    Lazy views (Manual/Guide, Learn) AND their shared async chunks (e.g. readerContent) are pulled in
//    by dynamic import() only when opened, so they are NOT part of the first load. Current initial ~108.
//  - TOTAL JS = every .js chunk together, an upper bound well under the ≤300kB NFR.
// This reads the real initial set from index.html rather than guessing by filename, so a new lazy or
// shared async chunk can't silently be mis-counted. Headroom catches a real regression; raise the
// budgets deliberately (with a note) if the app grows.
const JS_INITIAL_BUDGET_KB = 121; // 120→121 for Phase 3 (chat + copilot) 2026-07-19: both features are LAZY chunks; the only initial delta is their dynamic-import stubs + a few refs of wiring (~0.3kB gzip, negligible FCP). NFR ceiling is far higher.
const JS_TOTAL_BUDGET_KB = 268; // raised 200→260 (Insights bilingualisation 2026-07-15); 260→268 for the Phase 3 AI Advisor chat 2026-07-19 (adapter + hook + panel, all in a LAZY chunk — the FAB is lazy too, so the initial budget is untouched; NFR cap is 300)
const CSS_BUDGET_KB = 29; // 25→27 (Fase 2g polish 2026-07-18); 27→29 for Phase 3 2026-07-19 (chat panel + copilot overlay/launcher/Dos-Don'ts cards); still under the ~30kB NFR ceiling

const dir = 'dist/assets';
if (!existsSync(dir)) {
  console.error(`✗ ${dir} not found — run \`npm run build\` first.`);
  process.exit(1);
}

// Parse dist/index.html for the eagerly-loaded JS: the entry <script type="module" src> and any
// <link rel="modulepreload" href> (Vite emits these for the entry's static import graph).
const html = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : '';
const initialFiles = new Set();
for (const m of html.matchAll(/(?:src|href)="[^"]*\/assets\/([^"]+\.js)"/g)) initialFiles.add(m[1]);

let jsInitial = 0;
let jsTotal = 0;
let css = 0;
for (const f of readdirSync(dir)) {
  if (f.endsWith('.js')) {
    const size = gzipSync(readFileSync(join(dir, f))).length;
    jsTotal += size;
    if (initialFiles.has(f)) jsInitial += size;
  } else if (f.endsWith('.css')) {
    css += gzipSync(readFileSync(join(dir, f))).length;
  }
}
if (initialFiles.size === 0) {
  console.error('✗ Could not find the entry script in dist/index.html — did the build change?');
  process.exit(1);
}
const kb = (n) => n / 1024;
const fmt = (n) => `${kb(n).toFixed(1)}kB`;

const checks = [
  ['JS (initial)', jsInitial, JS_INITIAL_BUDGET_KB],
  ['JS (total)', jsTotal, JS_TOTAL_BUDGET_KB],
  ['CSS', css, CSS_BUDGET_KB],
];
let failed = false;
for (const [label, bytes, budget] of checks) {
  const over = kb(bytes) > budget;
  failed = failed || over;
  console.log(`${over ? '✗' : '✓'} ${label} gzip ${fmt(bytes)} / ${budget}kB budget`);
}

if (failed) {
  console.error('\n✗ Bundle exceeds its gzip budget. Trim the change, or raise the budget in scripts/check-bundle-size.mjs with a note.');
  process.exit(1);
}
console.log(`\n✓ Bundle within budget (initial JS+CSS gzip ${fmt(jsInitial + css)}; total JS ${fmt(jsTotal)}).`);
