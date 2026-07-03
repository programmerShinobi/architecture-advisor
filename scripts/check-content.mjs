#!/usr/bin/env node
/**
 * Architecture Advisor — content validation guard ("Minimum Viable Article" gate).
 *
 * Validates every article under content/ against the frontmatter contract
 * (src/config/contentSchema.ts) and — crucially — asserts that each `related_advisor`
 * dimension/option resolves to a CANONICAL id in the frozen model (src/config/dimensions.ts).
 * Content can therefore never reference a non-existent style/QA, and can never silently drift
 * from the engine. Dependency-free, like the other guards. Run: node scripts/check-content.mjs
 * (exit 0 = OK). Link liveness + review cadence are separate, non-blocking checks.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

const SECTIONS = ['catalog', 'playbook', 'review', 'library', 'roadmap', 'academy', 'lab'];
const EVIDENCE = ['strong', 'moderate', 'emerging'];
const AUDIENCES = ['awam', 'expert'];
const TRANSLATIONS = ['id', 'en', 'id+en'];
const DIMS = ['D1', 'D2', 'D3', 'D4', 'D5'];

// ---- option ids per dimension, extracted from the frozen config (single source of truth) ----
function optionIdsFromConfig() {
  const src = read('src/config/dimensions.ts');
  const ids = new Set();
  for (const m of src.matchAll(/\{\s*id:\s*'([a-z0-9-]+)',\s*name:/g)) ids.add(m[1]);
  return ids;
}

// ---- minimal, independent frontmatter parser (cross-check ethos: not shared with the app) ----
function unquote(s) {
  const t = s.trim();
  return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")) ? t.slice(1, -1) : t;
}
function splitTop(s, d) {
  const out = [];
  let depth = 0;
  let q = '';
  let cur = '';
  for (const ch of s) {
    if (q) {
      if (ch === q) q = '';
      cur += ch;
    } else if (ch === '"' || ch === "'") {
      q = ch;
      cur += ch;
    } else if (ch === '{' || ch === '[') {
      depth++;
      cur += ch;
    } else if (ch === '}' || ch === ']') {
      depth--;
      cur += ch;
    } else if (ch === d && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}
function scalar(raw) {
  const s = raw.trim();
  if (s.startsWith('[')) return splitTop(s.slice(1, -1), ',').map(unquote).filter(Boolean);
  if (s.startsWith('{')) {
    const o = {};
    for (const p of splitTop(s.slice(1, -1), ',')) {
      const i = p.indexOf(':');
      if (i > -1) o[p.slice(0, i).trim()] = scalar(p.slice(i + 1).trim());
    }
    return o;
  }
  return unquote(s);
}
const indent = (l) => l.length - l.trimStart().length;
function parseFm(raw) {
  if (!raw.startsWith('---')) return null;
  const lines = raw.split('\n');
  let end = -1;
  for (let i = 1; i < lines.length; i++)
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  if (end === -1) return null;
  const fm = lines.slice(1, end);
  const data = {};
  for (let i = 0; i < fm.length; i++) {
    const line = fm[i];
    if (!line.trim() || indent(line) !== 0) continue;
    const c = line.indexOf(':');
    if (c === -1) continue;
    const key = line.slice(0, c).trim();
    const rest = line.slice(c + 1).trim();
    if (rest) {
      data[key] = scalar(rest);
      continue;
    }
    const kids = [];
    let j = i + 1;
    while (j < fm.length && (fm[j].trim() === '' || indent(fm[j]) > 0)) {
      if (fm[j].trim()) kids.push(fm[j]);
      j++;
    }
    i = j - 1;
    if (!kids.length) data[key] = '';
    else if (kids[0].trim().startsWith('- ')) data[key] = kids.map((k) => scalar(k.trim().slice(2)));
    else {
      const o = {};
      for (const k of kids) {
        const ci = k.indexOf(':');
        if (ci > -1) o[k.slice(0, ci).trim()] = scalar(k.slice(ci + 1).trim());
      }
      data[key] = o;
    }
  }
  return data;
}

// ---- helpers ----
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
function plusYear(d) {
  const [y, m, day] = d.split('-').map(Number);
  return `${y + 1}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function wellFormedUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return /^10\.\d{4,9}\/\S+$/.test(u); // bare DOI
  }
}

// ---- run ----
const OPTION_IDS = optionIdsFromConfig();
const files = readdirSync(new URL('content/', root), { recursive: true })
  .filter((f) => String(f).endsWith('.md'))
  .map((f) => `content/${String(f).split('\\').join('/')}`);

const problems = [];
const slugs = new Map();
const titles = new Map();
let n = 0;

if (files.length === 0) problems.push('no content files found under content/');

for (const file of files) {
  const raw = read(file);
  const fm = parseFm(raw);
  const where = file;
  const bad = (m) => problems.push(`${where}: ${m}`);
  n++;
  if (!fm) {
    bad('missing or malformed frontmatter block');
    continue;
  }

  for (const k of [
    'title_id', 'title_en', 'slug', 'section', 'audience', 'summary_tldr_id', 'summary_tldr_en',
    'evidence_strength', 'last_reviewed', 'review_due', 'translation_status', 'related_advisor',
    'sources', 'status', 'author',
  ]) {
    if (fm[k] === undefined || fm[k] === '') bad(`missing required field "${k}"`);
  }

  if (fm.section && !SECTIONS.includes(fm.section)) bad(`unknown section "${fm.section}"`);
  if (fm.evidence_strength && !EVIDENCE.includes(fm.evidence_strength)) bad(`invalid evidence_strength "${fm.evidence_strength}"`);
  if (fm.translation_status && !TRANSLATIONS.includes(fm.translation_status)) bad(`invalid translation_status "${fm.translation_status}"`);
  if (Array.isArray(fm.audience)) {
    for (const a of fm.audience) if (!AUDIENCES.includes(a)) bad(`invalid audience "${a}"`);
  } else if (fm.audience !== undefined) bad('audience must be a list');

  // "at least the id version"
  if (fm.translation_status && !['id', 'id+en'].includes(fm.translation_status)) bad('must have at least the id version (translation_status id or id+en)');

  // review dates
  if (fm.last_reviewed && !isDate(fm.last_reviewed)) bad(`last_reviewed not YYYY-MM-DD: "${fm.last_reviewed}"`);
  if (fm.review_due && !isDate(fm.review_due)) bad(`review_due not YYYY-MM-DD: "${fm.review_due}"`);
  if (isDate(fm.last_reviewed) && isDate(fm.review_due) && fm.review_due !== plusYear(fm.last_reviewed))
    bad(`review_due must be last_reviewed + 12 months (expected ${plusYear(fm.last_reviewed)})`);

  // sources: >=1 with a well-formed URL
  const sources = Array.isArray(fm.sources) ? fm.sources : [];
  if (sources.length === 0) bad('needs at least one primary source');
  else if (!sources.some((s) => s && wellFormedUrl(String(s.url)))) bad('no source has a well-formed URL/DOI');

  // related_advisor resolves to the frozen model
  const ra = fm.related_advisor || {};
  const dims = Array.isArray(ra.dimensions) ? ra.dimensions : [];
  const opts = Array.isArray(ra.options) ? ra.options : [];
  if (dims.length === 0 && opts.length === 0) bad('related_advisor must reference at least one dimension or option');
  for (const d of dims) if (!DIMS.includes(d)) bad(`related_advisor.dimensions references unknown dimension "${d}"`);
  for (const o of opts) if (!OPTION_IDS.has(o)) bad(`related_advisor.options references id "${o}" not in the frozen model`);

  // uniqueness
  if (fm.slug) {
    if (slugs.has(fm.slug)) bad(`duplicate slug "${fm.slug}" (also in ${slugs.get(fm.slug)})`);
    else slugs.set(fm.slug, where);
    // slug should match filename
    if (!where.endsWith(`/${fm.slug}.md`)) bad(`slug "${fm.slug}" does not match filename`);
  }
  for (const t of [fm.title_id, fm.title_en]) {
    if (t) {
      if (titles.has(t)) bad(`duplicate title "${t}"`);
      else titles.set(t, where);
    }
  }
}

if (problems.length) {
  console.error(`✗ Content validation failed (${files.length} file(s)):\n`);
  for (const p of problems) console.error(`  • ${p}`);
  console.error('\nFix the frontmatter (see src/config/contentSchema.ts) and re-run.');
  process.exit(1);
}
console.log(`✓ Content OK: ${n} article(s) valid — schema, primary sources, review dates, and all related_advisor ids resolve to the frozen model.`);
