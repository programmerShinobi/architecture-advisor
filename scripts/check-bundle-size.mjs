#!/usr/bin/env node
// Performance guard (Phase 5 / NFR): the shipped JS + CSS must stay within a gzip budget, so a
// heavy dependency (e.g. re-adding a chart/diagram library) can't silently bloat the bundle.
// Fonts are excluded — they are separate woff/woff2 files lazy-loaded via `font-display: swap`.
// Run AFTER `npm run build`. Dependency-free, like the other guards.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Two budgets in gzipped kB:
//  - INITIAL JS = what loads on first paint (the entry chunk + its static imports). The Manual/Guide
//    is lazy-loaded (React.lazy) and carries the detailed architecture explanations, so that content
//    sits in a SEPARATE on-demand chunk that is NOT counted here. Current initial ~110 (incl. React 19).
//  - TOTAL JS = every .js chunk together (entry + lazy Manual), an upper bound well under the ≤300kB NFR.
// Headroom catches a real regression without flaking on small growth. Raise deliberately (with a note).
const JS_INITIAL_BUDGET_KB = 120;
const JS_TOTAL_BUDGET_KB = 160;
const CSS_BUDGET_KB = 25;

const dir = 'dist/assets';
if (!existsSync(dir)) {
  console.error(`✗ ${dir} not found — run \`npm run build\` first.`);
  process.exit(1);
}

// The initial JS is the entry module referenced by index.html plus everything it statically imports.
// Lazy chunks (e.g. Reader) are pulled in by dynamic import() at runtime, so Vite names them after
// the module (e.g. `Reader-*.js`) and they are excluded from the first load. We approximate the
// initial set as "all JS except chunks whose base name matches a lazily-imported component".
const LAZY_CHUNK_PREFIXES = ['ManualBook']; // keep in sync with lazy(() => import(...)) calls in src/App.tsx
const isLazyChunk = (f) => LAZY_CHUNK_PREFIXES.some((p) => f.startsWith(p));

let jsInitial = 0;
let jsTotal = 0;
let css = 0;
for (const f of readdirSync(dir)) {
  if (f.endsWith('.js')) {
    const size = gzipSync(readFileSync(join(dir, f))).length;
    jsTotal += size;
    if (!isLazyChunk(f)) jsInitial += size;
  } else if (f.endsWith('.css')) {
    css += gzipSync(readFileSync(join(dir, f))).length;
  }
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
