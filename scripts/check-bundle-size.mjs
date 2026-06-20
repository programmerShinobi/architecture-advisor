#!/usr/bin/env node
// Performance guard (Phase 5 / NFR): the shipped JS + CSS must stay within a gzip budget, so a
// heavy dependency (e.g. re-adding a chart/diagram library) can't silently bloat the bundle.
// Fonts are excluded — they are separate woff/woff2 files lazy-loaded via `font-display: swap`.
// Run AFTER `npm run build`. Dependency-free, like the other guards.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Budgets in gzipped kB. Current ~96 (JS) / ~19 (CSS); headroom catches a real regression
// without flaking on small growth. Raise deliberately (with justification) if the app grows.
const JS_BUDGET_KB = 120;
const CSS_BUDGET_KB = 25;

const dir = 'dist/assets';
if (!existsSync(dir)) {
  console.error(`✗ ${dir} not found — run \`npm run build\` first.`);
  process.exit(1);
}

let js = 0;
let css = 0;
for (const f of readdirSync(dir)) {
  if (f.endsWith('.js')) js += gzipSync(readFileSync(join(dir, f))).length;
  else if (f.endsWith('.css')) css += gzipSync(readFileSync(join(dir, f))).length;
}
const kb = (n) => n / 1024;
const fmt = (n) => `${kb(n).toFixed(1)}kB`;

const checks = [
  ['JS', js, JS_BUDGET_KB],
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
console.log(`\n✓ Bundle within budget (JS+CSS gzip ${fmt(js + css)}).`);
