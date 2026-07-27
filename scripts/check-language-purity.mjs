#!/usr/bin/env node
/**
 * Architecture Advisor — bilingual purity guard.
 *
 * Every user-facing string exists as an EN/ID pair. The failure this catches is a half-translated
 * sentence: an `id` string that still carries English prose (or the reverse), which reads as broken
 * to a monolingual user and is invisible to typechecking, linting and every existing test.
 *
 * What counts as evidence. Technical nouns are legitimately English inside Indonesian prose
 * ("microservices", "cache", "deploy", "event sourcing"), so their presence proves nothing and
 * flagging them would make this guard noise. FUNCTION words are the signal — "the", "with", "your",
 * "which" appear only in an untranslated English sentence, never as borrowed terminology. Hyphenated
 * compounds are stripped first, because "append-only" and "read-only" are single technical terms
 * whose tail would otherwise look like the English word "only".
 *
 * Covers both shapes the codebase uses: `{ en: '…', id: '…' }` objects (dict, config, chat topics)
 * and the Manual's inline `L('…','…')` / `p('…','…')` helpers.
 *
 * Run: node scripts/check-language-purity.mjs   (exit 0 = no mixed-language strings)
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const EN_FN = ['the', 'and', 'with', 'your', 'for', 'this', 'that', 'from', 'when', 'what', 'how', 'are', 'is', 'you', 'will', 'can', 'not', 'all', 'any', 'more', 'than', 'into', 'about', 'which', 'while', 'they', 'their', 'has', 'have', 'was', 'were', 'been', 'only', 'also', 'just', 'each', 'every', 'some', 'most', 'other', 'both', 'over', 'under', 'after', 'before', 'without', 'between', 'because', 'however', 'therefore', 'them', 'then', 'there', 'here', 'who', 'why', 'where', 'does', 'need', 'needs', 'want', 'uses', 'used', 'instead', 'rather', 'own'];
const ID_FN = ['yang', 'dan', 'dengan', 'untuk', 'ini', 'itu', 'dari', 'pada', 'adalah', 'bisa', 'tidak', 'akan', 'atau', 'juga', 'tapi', 'tetapi', 'sudah', 'belum', 'masih', 'saja', 'agar', 'supaya', 'karena', 'sehingga', 'setiap', 'semua', 'lebih', 'paling', 'anda', 'kami', 'kita', 'mereka', 'ada', 'tak', 'bukan', 'saat', 'ketika', 'kalau', 'jika', 'maka', 'oleh', 'tanpa', 'antara', 'namun', 'sebuah', 'dalam', 'cuma', 'punya'];

const Q = "(?:'((?:[^'\\\\]|\\\\.)*)'|\"((?:[^\"\\\\]|\\\\.)*)\")";
const RX_OBJ = new RegExp(`en:\\s*${Q}\\s*,\\s*id:\\s*${Q}`, 'g');
const RX_FN = new RegExp(`\\b[Lpb]\\(\\s*${Q}\\s*,\\s*${Q}\\s*[,)]`, 'gs');

/**
 * Reduce a string to the words that are genuinely prose.
 *
 * `{placeholder}` tokens go first: they are substituted at runtime and are code, not language, so a
 * key like `{other} yang unggul` must not be read as an Indonesian sentence containing the English
 * word "other". Hyphenated compounds go next, because "append-only" and "read-only" are single
 * technical terms whose tail would otherwise look like the English word "only".
 */
const words = (s) =>
  (s
    .toLowerCase()
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/[a-z]+-[a-z-]+/g, ' ')
    .match(/[a-z]+/g) || []);

const files = execSync('grep -rl "en:\\|L(\'\\|p(\'" src/ content/ --include=*.ts --include=*.tsx --include=*.json 2>/dev/null || true', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean).filter((f) => !f.includes('.test.'));

const problems = [];
let pairs = 0;

for (const file of files) {
  const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  for (const rx of [RX_OBJ, RX_FN]) {
    rx.lastIndex = 0;
    let m;
    while ((m = rx.exec(src))) {
      const en = m[1] ?? m[2] ?? '';
      const id = m[3] ?? m[4] ?? '';
      if (!en || !id) continue;
      pairs++;
      const line = src.slice(0, m.index).split('\n').length;
      const enInId = [...new Set(words(id).filter((w) => EN_FN.includes(w)))];
      const idInEn = [...new Set(words(en).filter((w) => ID_FN.includes(w)))];
      if (enInId.length) problems.push(`${file}:${line} — ID string carries English prose (${enInId.join(', ')}): "${id.slice(0, 120)}"`);
      if (idInEn.length) problems.push(`${file}:${line} — EN string carries Indonesian prose (${idInEn.join(', ')}): "${en.slice(0, 120)}"`);
    }
  }
}

// ---- 2. Register + terminology consistency (Indonesian) --------------------
// Two defects that are invisible to the mixed-language check above but read just as badly.
//
// REGISTER. The app addresses the reader formally, as "Anda", in ~1170 strings. Ten strings had
// slipped into the informal "kamu"/"-mu", which makes the Indonesian read as though two different
// people wrote it. Words that merely END in -mu (ilmu, tamu, jamu) are excluded.
//
// TERMINOLOGY. The same concept must keep one Indonesian name. These pairs were each found as a
// real split in the codebase — "mode Expert" against "mode Ahli", "atribut mutu" against "atribut
// kualitas" — where the winner is simply the form already used everywhere else.
const INFORMAL = /\b(kamu|kau)\b|\b\w+mu\b/gi;
const INFORMAL_OK = /^(ilmu|jamu|semu|tamu|kamu?mu|lumu)$/i; // genuinely end in -mu
const TERMS = [
  { wrong: /\bmode Expert\b/, right: 'mode Ahli' },
  { wrong: /\bmode Guided\b/, right: 'mode Terpandu' },
  { wrong: /\batribut mutu\b/, right: 'atribut kualitas' },
  { wrong: /\bquality attribute\b/, right: 'atribut kualitas' },
];

for (const file of files) {
  const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  for (const rx of [RX_OBJ, RX_FN]) {
    rx.lastIndex = 0;
    let m;
    while ((m = rx.exec(src))) {
      const id = m[3] ?? m[4] ?? '';
      if (!id) continue;
      const line = src.slice(0, m.index).split('\n').length;
      const informal = (id.match(INFORMAL) || []).filter((w) => !INFORMAL_OK.test(w));
      if (informal.length) problems.push(`${file}:${line} — informal address (${[...new Set(informal)].join(', ')}); this app says "Anda": "${id.slice(0, 110)}"`);
      for (const t of TERMS) {
        if (t.wrong.test(id)) problems.push(`${file}:${line} — inconsistent term; use "${t.right}": "${id.slice(0, 110)}"`);
      }
    }
  }
}

console.log(`Language purity — ${pairs} EN/ID pairs across ${files.length} files`);
if (problems.length) {
  for (const p of problems) console.log(`  ✗ ${p}`);
  console.error(`\n${problems.length} problem(s) across three checks: half-translated prose, informal address, and split terminology. Fix the string — or, if a flagged word is genuinely a technical term that must stay as-is, add it to this script's exclusions with a reason.`);
  process.exit(1);
}
console.log('  no half-translated prose, consistent "Anda", one name per term  ✓');
