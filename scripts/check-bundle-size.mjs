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
const JS_INITIAL_BUDGET_KB = 123; // History, so the pattern stays visible: 120→121 Phase 3 (lazy chunks, stub only). 121→122 briefly on 2026-07-25 for Insights prose, RETURNED to 121 the same day by moving that prose to the lazy chunk — avoidable, and the fix was structural. 121→122 on 2026-07-27 for decision leverage. 122→123 on 2026-07-27 for the compensation disclosure (measured 122.2). THIS IS THE SECOND RAISE IN TWO CHANGES and both are eager Advisor code, so the trend deserves watching, not waving through. Trimmed first, not after: the disclosure prose was cut ~55%, and a newly-imported Tabler icon was dropped for IconScale which the file already had (that one alone brought TOTAL back under budget). The residual ~0.2kB is the feature itself on the default tab. If a third raise comes up, the answer is probably to split the Advisor results below the fold into their own chunk rather than to move this number again.
const JS_TOTAL_BUDGET_KB = 287; // raised 200→260 (Insights bilingualisation 2026-07-15); 260→268 for the Phase 3 Chat Advisor 2026-07-19 (adapter + hook + panel, all in a LAZY chunk — the FAB is lazy too, so the initial budget is untouched); 268→278 for the 2026-07-23 scenario-coverage expansion (cost/ops, risk catalog, sensitivity, migration, dimension/factor/QA lookups, app-usage FAQ — all pure data-driven text in the same lazy chunk; NFR cap is 300); 278→281 for the 2026-07-25 Chat Advisor capability browser + "How to use this" pane (bilingual help copy, same lazy chunk — initial JS unchanged at 120.8/121, so first paint is unaffected); 281→284 for the 2026-07-25 role-based "Start here" section in the Guide (six bilingual role paths — prose only, in the already-lazy ManualBook chunk that loads on demand; initial JS still 120.8/121, NFR cap 300) ; 284→286 on 2026-07-25 for the seven deepened Insights section intros — real added prose, but it now lives in the LAZY Insights chunk rather than the eager dict, which is why the initial budget went DOWN in the same change. NFR cap is 300. ; 286→287 on 2026-07-27 for the non-compensatory check (measured 286.2). To be explicit about which promise applies: the note on JS_INITIAL_BUDGET_KB says a third raise there should trigger splitting the below-the-fold Advisor results into their own chunk. That is a FIRST-PAINT concern and it is not this — initial sits at 122.5/123 and did not move enough to matter. This budget is the NFR ceiling guard (cap 300), measuring the whole app rather than what loads first, so a 0.2kB step for a genuinely new engine function plus two short strings is what it is meant to absorb.
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
