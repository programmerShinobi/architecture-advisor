#!/usr/bin/env node
/**
 * Architecture Advisor — cross-document consistency guard.
 *
 * Parses the model values out of each document and diffs them against
 * scripts/verify-model.mjs (the executable source of truth), so the docs can
 * never silently drift apart. Run: node scripts/cross-check-docs.mjs
 * (exit 0 = every document agrees). Pairs with verify-model.mjs, which checks
 * that the math itself is correct.
 *
 * Hard-fail checks (data must match): qaFit vectors, influence matrix, preset
 * levels, preset targets (Model Data Sheet ↔ verify-model.mjs ↔ SRS), default
 * factor levels, anti-pattern rule IDs, fitness-template coverage, and the EN factor
 * level labels (Section 2.1 vs Build Spec Section 4).
 */
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const norm = (s) => s.replaceAll('−', '-'); // unicode minus → ASCII hyphen

const MDS = norm(read('docs/03-blueprint/model-data-sheet.md'));
const MJS = norm(read('scripts/verify-model.mjs'));
const SRS = norm(read('docs/02-requirement-analysis/software-requirements-specification.md'));
const OCS = read('docs/03-blueprint/option-content-sheet.md');

const FACT = ['team','distribution','ttm','budget','lifespan','scale','dataVolume','async','realtime','domain','consistency','security','legacy','devops'];
const QA = ['performance','scalability','availability','security','maintainability','deployability','testability','observability','dataConsistency','interoperability','costEfficiency','timeToMarket'];

const problems = [];
const ok = (n, msg) => console.log(`  [${n}] ${msg}  ✓`);
const bad = (n, msg) => { console.log(`  [${n}] ${msg}  ✗`); problems.push(`[${n}] ${msg}`); };

const setEq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const targEq = (A, B) => !!A && !!B && A.length === B.length && A.every((s, i) => setEq(s, B[i]));
const objEq = (a, b) => {
  if (!a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => a[k] === b[k]);
};

// ---- 1. qaFit vectors: Model Data Sheet Section 4 vs verify-model.mjs DIMENSIONS ----
function mdsVecs(s) {
  const out = []; const re = /^\|\s*`[a-z0-9-]+`\s*\|[^|]+\|\s*`([0-9,]+)`\s*\|/gm; let m;
  while ((m = re.exec(s))) out.push(m[1].split(',').map(Number));
  return out;
}
function mjsVecs(s) {
  const blk = s.slice(s.indexOf('const DIMENSIONS'), s.indexOf('const DEFAULTS'));
  const out = []; const re = /\[(\d+(?:,\d+){11})\]/g; let m;
  while ((m = re.exec(blk))) out.push(m[1].split(',').map(Number));
  return out;
}
{
  const a = mdsVecs(MDS), b = mjsVecs(MJS);
  if (JSON.stringify(a) === JSON.stringify(b) && a.length === 21) ok(1, `qaFit vectors: MDS Section 4 == verify-model.mjs (${a.length} vectors × 12)`);
  else bad(1, `qaFit vectors differ (MDS ${a.length}, mjs ${b.length})`);
}

// ---- 2. influence matrix: Model Data Sheet Section 3 vs INFLUENCE ----
function mdsMatrix(s) {
  const sec = s.slice(s.indexOf('## 3. Factor'), s.indexOf('## 4. Dimension'));
  const d = {}; const re = /^\|\s*`([a-zA-Z]+)`[^|]*\|\s*([^|]+?)\s*\|/gm; let m;
  while ((m = re.exec(sec))) {
    if (m[1] === 'Factor') continue;
    const ent = {}; const er = /([a-zA-Z]+)\s*([+-]\d+)/g; let e;
    while ((e = er.exec(m[2]))) ent[e[1]] = Number(e[2]);
    if (Object.keys(ent).length) d[m[1]] = ent;
  }
  return d;
}
function mjsMatrix(s) {
  const blk = s.slice(s.indexOf('const INFLUENCE'), s.indexOf('const DIMENSIONS'));
  const d = {}; const re = /(\w+):\{([^}]*)\}/g; let m;
  while ((m = re.exec(blk))) {
    const ent = {}; const er = /(\w+):(-?\d+)/g; let e;
    while ((e = er.exec(m[2]))) ent[e[1]] = Number(e[2]);
    d[m[1]] = ent;
  }
  return d;
}
{
  const a = mdsMatrix(MDS), b = mjsMatrix(MJS);
  const diff = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((f) => !objEq(a[f], b[f]));
  if (diff.length === 0 && Object.keys(b).length === 14) ok(2, `influence matrix: MDS Section 3 == verify-model.mjs (14 factors, incl. budget inversion & ttm -1)`);
  else bad(2, `influence matrix differs at: ${diff.join(', ') || 'factor count'}`);
}

// ---- 3. preset levels: Model Data Sheet Section 6 vs PRESETS(+defaults) ----
function mdsPresets(s) {
  const out = {}; const re = /^\|\s*`([a-z-]+)`\s*\|((?:\s*\d+\s*\|){14})\s*$/gm; let m;
  while ((m = re.exec(s))) {
    const lv = (m[2].match(/\d+/g) || []).map(Number);
    if (lv.length === 14) { const o = {}; FACT.forEach((f, i) => (o[f] = lv[i])); out[m[1]] = o; }
  }
  return out;
}
function mjsPresets(s) {
  const blk = s.slice(s.indexOf('const PRESETS'), s.indexOf('const TARGETS'));
  const out = {}; const re = /"([a-z-]+)":\s*\{([^}]*)\}/g; let m;
  while ((m = re.exec(blk))) {
    const o = {}; FACT.forEach((f) => (o[f] = 0)); o.ttm = 1; o.budget = 2;
    const er = /(\w+):(\d+)/g; let e;
    while ((e = er.exec(m[2]))) o[e[1]] = Number(e[2]);
    out[m[1]] = o;
  }
  return out;
}
{
  const a = mdsPresets(MDS), b = mjsPresets(MJS);
  const diff = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)]))
    for (const f of FACT) if (a[k]?.[f] !== b[k]?.[f]) diff.push(`${k}.${f}`);
  if (diff.length === 0 && Object.keys(b).length === 5) ok(3, `preset levels: MDS Section 6 == verify-model.mjs (5 presets × 14 factors)`);
  else bad(3, `preset levels differ at: ${diff.join(', ') || 'preset count'}`);
}

// ---- 4 & 5. preset targets: Model Data Sheet Section 6 ↔ TARGETS ↔ SRS Section 5.3 ----
function mdsTargets(s) {
  const sec = s.slice(s.indexOf('Expected top recommendation'), s.indexOf('## 7.'));
  const out = {}; const re = /^\|\s*`([a-z-]+)`\s*\|([^\n]+)\|\s*$/gm; let m;
  while ((m = re.exec(sec))) {
    const cells = m[2].split('|').map((c) => c.trim());
    if (cells.length >= 5) out[m[1]] = cells.slice(0, 5).map((c) => new Set(c.split('/').map((x) => x.trim())));
  }
  return out;
}
function mjsTargets(s) {
  const start = s.indexOf('const TARGETS');
  const blk = s.slice(start, s.indexOf('};', start));
  const out = {}; const re = /"([a-z-]+)":\s*(\[\[.*?\]\])/g; let m;
  while ((m = re.exec(blk))) {
    const arrs = (m[2].match(/\[([^[\]]*)\]/g) || []).map((a) => a.replace(/[[\]]/g, ''));
    out[m[1]] = arrs.map((a) => new Set(a.split(',').map((x) => x.trim().replace(/^"|"$/g, ''))));
  }
  return out;
}
function srsTargets(s) {
  const sec = s.slice(s.indexOf('### 5.3'), s.indexOf('> Anti-pattern guardrails'));
  const rows = []; const re = /^\|\s*([^|]+?)\s*\|(.+)\|\s*$/gm; let m;
  while ((m = re.exec(sec))) {
    const first = m[1];
    if (first.startsWith('---') || first === 'Preset') continue;
    const cells = m[2].split('|').map((c) => c.trim());
    if (cells.length >= 6) rows.push(cells.slice(0, 5).map((c) => new Set(c.split('/').map((x) => x.trim()))));
  }
  return rows;
}
const order = ['startup-mvp', 'regulated', 'high-traffic-ecommerce', 'iot-streaming', 'internal-tool'];
const TM = mdsTargets(MDS), TJ = mjsTargets(MJS), TS = srsTargets(SRS);
{
  const diff = order.filter((k) => !targEq(TM[k], TJ[k]));
  if (diff.length === 0) ok(4, `preset targets: MDS Section 6 == verify-model.mjs (5 × 5, sets equal)`);
  else bad(4, `preset targets MDS vs mjs differ at: ${diff.join(', ')}`);
}
{
  if (TS.length !== 5) bad(5, `SRS Section 5.3 parsed ${TS.length} rows (expected 5)`);
  else {
    const diff = order.filter((k, i) => !targEq(TS[i], TM[k]));
    if (diff.length === 0) ok(5, `preset targets: SRS Section 5.3 == MDS Section 6 (5 × 5, sets equal)`);
    else bad(5, `SRS Section 5.3 vs MDS differ at: ${diff.join(', ')}`);
  }
}

// ---- 6. default factor levels (budget=2, ttm=1, rest 0) ----
function mdsDefaults(s) {
  const sec = s.slice(s.indexOf('## 2. Project factors'), s.indexOf('### 2.1'));
  const out = {}; const re = /^\|\s*\d+\s*\|\s*`([a-zA-Z]+)`\s*\|[^|]*\|[^|]*\|\s*\**(\d+)\**/gm; let m;
  while ((m = re.exec(sec))) out[m[1]] = Number(m[2]);
  return out;
}
function mjsDefaults(s) {
  const m = s.match(/const DEFAULTS\s*=\s*\{([^}]*)\}/);
  const o = {}; const er = /(\w+):(\d+)/g; let e;
  while ((e = er.exec(m[1]))) o[e[1]] = Number(e[2]);
  return o;
}
{
  const a = mdsDefaults(MDS), b = mjsDefaults(MJS);
  const mdsOk = a.ttm === 1 && a.budget === 2 && FACT.every((f) => (f === 'ttm' ? a[f] === 1 : f === 'budget' ? a[f] === 2 : a[f] === 0));
  const mjsOk = b.ttm === 1 && b.budget === 2 && Object.keys(b).length === 2;
  if (mdsOk && mjsOk) ok(6, `default levels: MDS Section 2 (budget=2, ttm=1, rest 0) == verify-model.mjs DEFAULTS`);
  else bad(6, `default levels differ (MDS budget=${a.budget} ttm=${a.ttm}; mjs ${JSON.stringify(b)})`);
}

// ---- 7. anti-pattern rule IDs: Model Data Sheet Section 5 vs Option Content Sheet Section 6 ----
{
  const rx = /^\|\s*`([a-z-]+)`\s*\|\s*(?:danger|warning|info)\s*\|/gm;
  const a = new Set([...MDS.matchAll(rx)].map((m) => m[1]));
  const b = new Set([...OCS.matchAll(rx)].map((m) => m[1]));
  if (setEq(a, b) && a.size === 7) ok(7, `anti-pattern rule IDs: MDS Section 5 == Option Content Sheet Section 6 (7 rules)`);
  else bad(7, `anti-pattern IDs differ (MDS-only ${[...a].filter((x) => !b.has(x))}, OCS-only ${[...b].filter((x) => !a.has(x))})`);
}

// ---- 8. fitness-function templates: one per QA in Option Content Sheet Section 7 ----
{
  const sec = OCS.slice(OCS.indexOf('## 7. Fitness'));
  const present = QA.filter((q) => new RegExp(`^\\|\\s*${q}\\s*\\|`, 'm').test(sec));
  if (present.length === 12) ok(8, `fitness templates: one per QA in Option Content Sheet Section 7 (12/12)`);
  else bad(8, `fitness templates missing: ${QA.filter((q) => !present.includes(q)).join(', ')}`);
}

// ---- 9. factor level labels (EN): Model Data Sheet Section 2.1 == Build Spec Section 4 ----
const BS = read('docs/specs/build-spec-v3.md');
function bsLevels(s) {
  const sec = s.slice(s.indexOf('## 4. Project factors'), s.indexOf('## 5.'));
  const out = {}; const re = /^\|\s*([a-zA-Z]+)\s*\|[^|]*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm; let m;
  while ((m = re.exec(sec))) { if (m[1] === 'id') continue; out[m[1]] = [m[2], m[3], m[4]]; }
  return out;
}
function mds21Levels(s) {
  const sec = s.slice(s.indexOf('### 2.1'), s.indexOf('## 3.'));
  const out = {}; const row = /^\|\s*`([a-zA-Z]+)`\s*\|([^|]+)\|/gm; let m;
  while ((m = row.exec(sec))) {
    const lv = []; const lr = /[0-2] ([^·]+?) ·/g; let e;
    while ((e = lr.exec(m[2]))) lv.push(e[1].trim());
    if (lv.length === 3) out[m[1]] = lv;
  }
  return out;
}
{
  const a = mds21Levels(MDS), b = bsLevels(BS);
  const diff = Object.keys(b).filter((f) => JSON.stringify(a[f]) !== JSON.stringify(b[f]));
  if (diff.length === 0 && Object.keys(b).length === 14) ok(9, `factor level labels (EN): MDS Section 2.1 == Build Spec Section 4 (14 × 3, verbatim)`);
  else bad(9, `factor level labels differ at: ${diff.map((f) => `${f} (§2.1 ${JSON.stringify(a[f])} vs BS ${JSON.stringify(b[f])})`).join('; ')}`);
}

console.log('');
if (problems.length) {
  console.log(`✗ ${problems.length} cross-document MISMATCH(es) — fix the documents so they agree, then re-run.`);
  process.exit(1);
} else {
  console.log('✓ No mismatch: qaFit, influence matrix, presets, targets, defaults, anti-patterns, and fitness templates agree across the Model Data Sheet, verify-model.mjs, the SRS, and the Option Content Sheet.');
  process.exit(0);
}
