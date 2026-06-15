#!/usr/bin/env node
/**
 * Architecture Advisor — app-config vs model guard.
 *
 * The app's src/config/*.ts must mirror the canonical model. This recomputes the values out of
 * the config files and diffs them against scripts/verify-model.mjs (the executable source of
 * truth, itself machine-verified against the docs) plus the Model Data Sheet / Option Content
 * Sheet for names, anti-patterns, and templates — so the implementation can never silently drift
 * from discovery → requirements → blueprint. Run: node scripts/check-app-config.mjs (exit 0 = OK).
 */
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const norm = (s) => s.replaceAll('−', '-');
const noComments = (s) => s.replace(/\/\/[^\n]*/g, ''); // strip line comments before value parsing

const MJS = noComments(read('scripts/verify-model.mjs'));
const MDS = norm(read('docs/03-blueprint/model-data-sheet.md'));
const OCS = read('docs/03-blueprint/option-content-sheet.md');

const QA = ['performance','scalability','availability','security','maintainability','deployability','testability','observability','dataConsistency','interoperability','costEfficiency','timeToMarket'];
const FACT = ['team','distribution','ttm','budget','lifespan','scale','dataVolume','async','realtime','domain','consistency','security','legacy','devops'];

const problems = [];
let n = 0;
const ok = (m) => console.log(`  [${++n}] ${m}  ✓`);
const bad = (m) => { console.log(`  [${++n}] ${m}  ✗`); problems.push(m); };
const arrEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---- helpers to pull arrays/objects out of the TS config (by text) ----
const slice = (s, from, to) => s.slice(s.indexOf(from), to ? s.indexOf(to, s.indexOf(from)) : undefined);
const strList = (block) => [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);

// ---- 1. QA order ----
{
  const app = strList(slice(read('src/config/qualityAttributes.ts'), 'QA_ORDER', '];'));
  arrEq(app, QA) ? ok('QA order matches canonical (12)') : bad(`QA order differs: ${app.join(',')}`);
}

// ---- 2. Factor order + budget inverted ----
{
  const f = read('src/config/factors.ts');
  const app = strList(slice(f, 'FACTOR_ORDER', '];'));
  arrEq(app, FACT) ? ok('factor order matches canonical (14)') : bad(`factor order differs: ${app.join(',')}`);
  // budget must be flagged inverted
  const budgetBlock = f.slice(f.indexOf('budget: {'), f.indexOf('lifespan: {'));
  budgetBlock.includes('inverted: true') ? ok('budget flagged inverted') : bad('budget missing inverted flag');
}

// ---- 3. influence matrix app vs verify-model.mjs ----
function parseInfluence(text, from, to) {
  const blk = text.slice(text.indexOf(from), text.indexOf(to, text.indexOf(from)));
  const out = {};
  for (const m of blk.matchAll(/(\w+):\s*\{([^}]*)\}/g)) {
    const ent = {};
    for (const e of m[2].matchAll(/(\w+):\s*(-?\d+)/g)) ent[e[1]] = Number(e[2]);
    if (Object.keys(ent).length) out[m[1]] = ent;
  }
  return out;
}
{
  const app = parseInfluence(noComments(read('src/config/factorQaMatrix.ts')), 'INFLUENCE', '};');
  const mjs = parseInfluence(MJS, 'const INFLUENCE', '};');
  const diff = [...new Set([...Object.keys(app), ...Object.keys(mjs)])].filter((k) => JSON.stringify(app[k]) !== JSON.stringify(mjs[k]));
  diff.length === 0 && Object.keys(app).length === 14 ? ok('influence matrix matches verify-model.mjs (14 factors)') : bad(`influence differs at: ${diff.join(', ') || 'count'}`);
}

// ---- 4 & 5. dimension qaFit + option ids/names ----
function appDims() {
  const t = noComments(read('src/config/dimensions.ts'));
  const out = {};
  for (const dm of t.matchAll(/(D[1-5]):\s*\{[\s\S]*?options:\s*\[([\s\S]*?)\],\s*\},/g)) {
    const dim = dm[1];
    const opts = [...dm[2].matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*qaFit:\s*\[([0-9,\s]+)\]/g)].map((m) => ({ id: m[1], name: m[2], fit: m[3].split(',').map((x) => Number(x.trim())) }));
    out[dim] = opts;
  }
  return out;
}
function mjsDims() {
  const blk = MJS.slice(MJS.indexOf('const DIMENSIONS'), MJS.indexOf('const DEFAULTS'));
  const order = ['D1', 'D2', 'D3', 'D4', 'D5'];
  const out = {};
  order.forEach((d, i) => {
    const start = blk.indexOf(`${d}:[`);
    const end = i + 1 < order.length ? blk.indexOf(`${order[i + 1]}:[`) : blk.length;
    const seg = blk.slice(start, end);
    out[d] = [...seg.matchAll(/\[(\d+(?:,\d+){11})\]/g)].map((m) => m[1].split(',').map(Number));
  });
  return out;
}
{
  const app = appDims(), mjs = mjsDims();
  const dims = ['D1', 'D2', 'D3', 'D4', 'D5'];
  const fitDiff = dims.filter((d) => !arrEq(app[d]?.map((o) => o.fit), mjs[d]));
  fitDiff.length === 0 ? ok('dimension qaFit vectors match verify-model.mjs (5 dimensions)') : bad(`qaFit differs in: ${fitDiff.join(', ')}`);

  // option ids + names vs Model Data Sheet Section 4
  const mdsSec = MDS.slice(MDS.indexOf('## 4. Dimension'), MDS.indexOf('## 5.'));
  const mdsPairs = [...mdsSec.matchAll(/^\|\s*`([a-z0-9-]+)`\s*\|\s*([^|]+?)\s*\|\s*`[0-9,]+`/gm)].map((m) => `${m[1]}=${m[2]}`);
  const appPairs = dims.flatMap((d) => app[d].map((o) => `${o.id}=${o.name}`));
  arrEq(appPairs.sort(), mdsPairs.sort()) ? ok(`option ids+names match Model Data Sheet Section 4 (${appPairs.length})`) : bad('option ids/names differ from Model Data Sheet Section 4');
}

// ---- 6. defaults ----
{
  const d = read('src/config/defaults.ts');
  /ttm:\s*1/.test(d) && /budget:\s*2/.test(d) && !/team:|scale:/.test(d) ? ok('defaults = ttm:1, budget:2 (all others 0)') : bad('defaults differ');
}

// ---- 7. presets (full app levels) vs verify-model deltas over defaults ----
function appPresets() {
  const t = noComments(read('src/config/presets.ts'));
  const out = {};
  for (const m of t.matchAll(/id:\s*'([a-z-]+)',[\s\S]*?levels:\s*levels\(\[([0-9,\s]+)\]\)/g)) {
    const v = m[2].split(',').map((x) => Number(x.trim()));
    const o = {}; FACT.forEach((f, i) => (o[f] = v[i]));
    out[m[1]] = o;
  }
  return out;
}
function mjsPresets() {
  const blk = MJS.slice(MJS.indexOf('const PRESETS'), MJS.indexOf('const TARGETS'));
  const out = {};
  for (const m of blk.matchAll(/"([a-z-]+)":\s*\{([^}]*)\}/g)) {
    const o = {}; FACT.forEach((f) => (o[f] = 0)); o.ttm = 1; o.budget = 2;
    for (const e of m[2].matchAll(/(\w+):\s*(\d+)/g)) o[e[1]] = Number(e[2]);
    out[m[1]] = o;
  }
  return out;
}
{
  const app = appPresets(), mjs = mjsPresets();
  const diff = [];
  for (const k of new Set([...Object.keys(app), ...Object.keys(mjs)]))
    for (const f of FACT) if (app[k]?.[f] !== mjs[k]?.[f]) diff.push(`${k}.${f}`);
  diff.length === 0 && Object.keys(app).length === 5 ? ok('preset levels match verify-model.mjs (5 presets × 14)') : bad(`preset levels differ at: ${diff.join(', ') || 'count'}`);
}

// ---- 8. anti-pattern ids + severities vs Model Data Sheet Section 5 ----
{
  const t = read('src/config/antiPatterns.ts');
  const app = [...t.matchAll(/id:\s*'([a-z-]+)',\s*severity:\s*'(info|warning|danger)'/g)].map((m) => `${m[1]}:${m[2]}`).sort();
  const sec = MDS.slice(MDS.indexOf('## 5. Anti-pattern'), MDS.indexOf('## 6.'));
  const mds = [...sec.matchAll(/^\|\s*`([a-z-]+)`\s*\|\s*(info|warning|danger)\s*\|/gm)].map((m) => `${m[1]}:${m[2]}`).sort();
  arrEq(app, mds) && app.length === 7 ? ok('anti-pattern ids+severities match Model Data Sheet Section 5 (7)') : bad('anti-pattern ids/severities differ from Model Data Sheet Section 5');
}

// ---- 9. fitness templates (EN) vs Option Content Sheet Section 7 ----
{
  const t = read('src/config/fitnessFunctions.ts');
  const sec = OCS.slice(OCS.indexOf('## 7. Fitness'), OCS.indexOf('\n---', OCS.indexOf('## 7. Fitness')));
  let missing = 0;
  for (const m of sec.matchAll(/^\|\s*(\w+)\s*\|\s*([^|]+?)\s*\|/gm)) {
    const qa = m[1], text = m[2].trim();
    if (qa === 'QA' || !QA.includes(qa)) continue;
    if (!t.includes(text)) missing++;
  }
  missing === 0 ? ok('fitness templates (EN) match Option Content Sheet Section 7 (12)') : bad(`${missing} fitness template(s) differ from Option Content Sheet`);
}

console.log('');
if (problems.length) {
  console.error(`✗ ${problems.length} app-config mismatch(es) vs the model. Fix src/config to match the canonical docs.`);
  process.exit(1);
}
console.log('✓ App config mirrors the model: QA/factor order, influence, qaFit, option names, defaults, presets, anti-patterns, and fitness templates all agree with the docs.');
