import { DIMENSIONS, DIMENSION_ORDER } from '../../config/dimensions';
import { OPTION_BLURB } from '../../config/dimensionContent';
import { GLOSSARY } from '../../config/glossary';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../../config/qualityAttributes';
import { FACTORS, FACTOR_ORDER } from '../../config/factors';
import { COST_OPS, type OpsLevel } from '../../config/costOps';
import { MIGRATION_PATHS, type MigrationKey } from '../../config/migrationPaths';
import { ANTI_PATTERNS } from '../../config/antiPatterns';
import { detectAntiPatterns } from '../antiPatternEngine';
import { effectiveWeights, rank, roundWeights, contributions, displayScore, sensitivity } from '../scoring';
import type { ChatAdapter, ChatChunk, ChatContext } from './types';
import type { Bilingual, DimensionId, FactorId, Lang, QaId } from '../../types';

// The LOCAL ChatService adapter (Blueprint Phase 1.3). It answers from the FROZEN engine + the same
// config the app renders — so the chatbot can never contradict the model or fabricate a fact. It is
// deterministic and offline (network:false); a network LLM is a drop-in replacement of this file.

const tr = (b: Bilingual, lang: Lang) => b[lang];

// Flat index of every option for name matching (built once).
const OPTIONS = DIMENSION_ORDER.flatMap((dim) =>
  DIMENSIONS[dim].options.map((o) => ({ dim, id: o.id, name: o.name, lc: o.name.toLowerCase(), qaFit: o.qaFit })),
);

const has = (text: string, ...words: string[]) => words.some((w) => text.includes(w));

function findOptions(text: string) {
  return OPTIONS.filter((o) => text.includes(o.lc) || text.includes(o.id.replaceAll('-', ' ')));
}

// Flat index of every DIMENSION (the axis itself, e.g. "Deployment Granularity"), for questions
// about the axis rather than a specific option under it — built once, both languages.
const DIMENSION_PHRASES = DIMENSION_ORDER.map((d) => ({
  dim: d,
  phrases: [DIMENSIONS[d].name.en, DIMENSIONS[d].name.id, DIMENSIONS[d].guidedLabel.en, DIMENSIONS[d].guidedLabel.id].map((s) => s.toLowerCase()),
}));

function findDimension(text: string): DimensionId | null {
  return DIMENSION_PHRASES.find((p) => p.phrases.some((ph) => text.includes(ph)))?.dim ?? null;
}

// Flat index of every FACTOR by its bilingual label, for "what does X factor mean?" questions.
const FACTOR_PHRASES = FACTOR_ORDER.map((f) => ({
  factor: f,
  phrases: [FACTORS[f].label.en, FACTORS[f].label.id].map((s) => s.toLowerCase()),
}));

function findFactor(text: string): FactorId | null {
  return FACTOR_PHRASES.find((p) => p.phrases.some((ph) => text.includes(ph)))?.factor ?? null;
}

function recommendation(ctx: ChatContext, lang: Lang): string {
  const weights = effectiveWeights(ctx.levels, ctx.overrides);
  const rounded = roundWeights(weights);
  const topQa = (QA_ORDER.filter((q) => rounded[q] > 0) as QaId[]).sort((a, b) => rounded[b] - rounded[a]).slice(0, 3);
  const head = lang === 'id' ? '**Rekomendasi untuk skenario Anda saat ini:**' : '**Recommendation for your current scenario:**';
  const rows = DIMENSION_ORDER.map((dim) => {
    const top = rank(ctx.levels, dim)[0];
    return `- **${tr(DIMENSIONS[dim].name, lang)}** → ${top.name} (${displayScore(top.score)}/100)`;
  }).join('\n');
  const drivers = topQa.map((q) => `${tr(QUALITY_ATTRIBUTES[q].name, lang)} (${rounded[q]}%)`).join(' · ');
  const driverLine =
    lang === 'id'
      ? `\n\nPendorong terkuat: ${drivers}. Ketik nama arsitektur untuk penjelasan, atau "kenapa" untuk rinciannya.`
      : `\n\nStrongest drivers: ${drivers}. Type an architecture name to explain it, or "why" for the breakdown.`;
  return `${head}\n\n${rows}${driverLine}`;
}

function explain(optId: string, dim: DimensionId, ctx: ChatContext, lang: Lang): string {
  const opt = DIMENSIONS[dim].options.find((o) => o.id === optId);
  if (!opt) return fallback(lang);
  const blurb = OPTION_BLURB[`${dim}:${optId}`];
  const body = blurb ? tr(ctx.mode === 'expert' ? blurb.expert : blurb.plain, lang) : '';
  const ranked = rank(ctx.levels, dim);
  const place = ranked.findIndex((r) => r.id === optId) + 1;
  const score = displayScore((ranked.find((r) => r.id === optId) ?? ranked[0]).score);
  const ctxLine =
    lang === 'id'
      ? `\n\nPada skenario Anda, **${opt.name}** menempati peringkat #${place} di ${tr(DIMENSIONS[dim].name, lang)} (${score}/100).`
      : `\n\nIn your scenario, **${opt.name}** ranks #${place} in ${tr(DIMENSIONS[dim].name, lang)} (${score}/100).`;
  return `**${opt.name}** — ${tr(DIMENSIONS[dim].name, lang)}\n\n${body}${ctxLine}`;
}

function compare(a: (typeof OPTIONS)[number], b: (typeof OPTIONS)[number], lang: Lang): string {
  const strengths = (qaFit: number[]) =>
    QA_ORDER.map((q, i) => ({ q, v: qaFit[i] }))
      .sort((x, y) => y.v - x.v)
      .slice(0, 3)
      .map((s) => tr(QUALITY_ATTRIBUTES[s.q].name, lang))
      .join(', ');
  const la = lang === 'id' ? 'terkuat pada' : 'strongest on';
  return `**${a.name} vs ${b.name}**\n\n- **${a.name}** — ${la}: ${strengths(a.qaFit)}\n- **${b.name}** — ${la}: ${strengths(b.qaFit)}`;
}

function why(ctx: ChatContext, lang: Lang): string {
  const weights = effectiveWeights(ctx.levels, ctx.overrides);
  const top = rank(ctx.levels, 'D1')[0];
  const opt = DIMENSIONS.D1.options.find((o) => o.id === top.id);
  if (!opt) return fallback(lang);
  const rows = contributions(weights, opt.qaFit)
    .filter((c) => c.weight > 0.05)
    .slice(0, 4)
    .map((c) => `- ${tr(QUALITY_ATTRIBUTES[c.qa].name, lang)}: ${Math.round(c.weight)}% × fit ${c.fit}`)
    .join('\n');
  return lang === 'id'
    ? `**Kenapa ${top.name}?** Skor komposit dari atribut berbobot tertinggi Anda:\n\n${rows}`
    : `**Why ${top.name}?** Its composite comes from your highest-weighted attributes:\n\n${rows}`;
}

// Broadened scenario coverage (Phase 3.4, owner request): app-usage FAQ + more analytical angles,
// so a new user is never left confused regardless of what aspect they ask about. Every answer stays
// grounded in the frozen engine or the actual UI — never invented copy about how the app behaves.

const opsLabel = (v: OpsLevel, lang: Lang) =>
  ({ low: { en: 'low', id: 'rendah' }, med: { en: 'medium', id: 'sedang' }, high: { en: 'high', id: 'tinggi' } })[v][lang];

function costOps(ctx: ChatContext, lang: Lang, optId?: string): string {
  const id = optId ?? rank(ctx.levels, 'D1')[0].id;
  const opt = DIMENSIONS.D1.options.find((o) => o.id === id);
  const row = COST_OPS[id];
  if (!opt || !row) return fallback(lang);
  return lang === 'id'
    ? `**Biaya & operasional — ${opt.name}**\n\n- Overhead operasional: ${opsLabel(row.overhead, lang)}\n- Perkiraan biaya infra: ${opsLabel(row.infraCost, lang)}\n\n${tr(row.caveat, lang)}`
    : `**Cost & operations — ${opt.name}**\n\n- Operational overhead: ${opsLabel(row.overhead, lang)}\n- Infra cost: ${opsLabel(row.infraCost, lang)}\n\n${tr(row.caveat, lang)}`;
}

function risks(ctx: ChatContext, lang: Lang): string {
  const selections = Object.fromEntries(DIMENSION_ORDER.map((d) => [d, rank(ctx.levels, d)[0].id])) as Record<DimensionId, string>;
  const hits = detectAntiPatterns({ levels: ctx.levels, selections, migrationPathChosen: false });
  if (hits.length === 0) {
    return lang === 'id'
      ? 'Tidak ada anti-pattern yang terdeteksi untuk kombinasi rekomendasi Anda saat ini.'
      : 'No anti-patterns detected for your current recommended combination.';
  }
  const head = lang === 'id' ? '**Peringatan untuk skenario Anda:**' : '**Warnings for your scenario:**';
  const rows = hits.map((h) => `- **${h.severity.toUpperCase()}** — ${tr(h.message, lang)}`).join('\n\n');
  return `${head}\n\n${rows}`;
}

function sensitivityInfo(ctx: ChatContext, lang: Lang): string {
  const flips = sensitivity(ctx.levels, 'D1', ctx.overrides);
  if (flips.length === 0) {
    return lang === 'id'
      ? 'Rekomendasi Anda cukup stabil — mengubah satu level faktor mana pun tidak mengubah pilihan #1 saat ini.'
      : "Your recommendation is stable — nudging any single factor by one level doesn't change the current #1 pick.";
  }
  const head = lang === 'id' ? '**Seberapa dekat pilihan Anda:**' : '**How close your pick is:**';
  const rows = flips
    .slice(0, 5)
    .map((f) => {
      // sensitivity() only ever assigns `factor` from FACTOR_ORDER — always a real FactorId — but
      // its Flip type (in the frozen lib/scoring.ts) widens it to plain string; narrow it back here.
      const factor = f.factor as FactorId;
      const label = tr(FACTORS[factor].label, lang);
      const lvl = tr(FACTORS[factor].levels[f.to], lang);
      return lang === 'id' ? `- **${label} → "${lvl}"** membalik ke **${f.newWinner}**` : `- **${label} → "${lvl}"** flips the pick to **${f.newWinner}**`;
    })
    .join('\n');
  return `${head}\n\n${rows}`;
}

function migrationInfo(text: string, lang: Lang): string {
  let key: MigrationKey = 'big';
  if (has(text, 'greenfield', 'new project', 'from scratch', 'baru', 'proyek baru')) key = 'fresh';
  else if (has(text, 'mixed', 'partial', 'gateway', 'campuran', 'parsial')) key = 'mix';
  const head = lang === 'id' ? '**Jalur migrasi bertahap:**' : '**Incremental migration path:**';
  const steps = MIGRATION_PATHS[key].map((s, i) => `${i + 1}. ${tr(s, lang)}`).join('\n');
  const note =
    lang === 'id'
      ? '\n\nJalur lain (proyek baru / big-bang / campuran) juga ada di kartu Migrasi pada langkah 3.'
      : '\n\nOther paths (greenfield / big-bang / mixed) are also in the Migration card in step 3.';
  return `${head}\n\n${steps}${note}`;
}

function privacyInfo(lang: Lang): string {
  return lang === 'id'
    ? 'Aplikasi ini **100% berjalan di peramban Anda** — tanpa akun, tanpa server, gratis, dan tak ada data yang terkirim ke mana pun. Semua perhitungan, termasuk saya (Chat Advisor), berjalan lokal dan offline.'
    : "This app runs **100% in your browser** — no account, no server calls, free, and nothing you enter ever leaves your device. Every computation, including me (the Chat Advisor), runs locally and offline.";
}

function modeInfo(lang: Lang): string {
  return lang === 'id'
    ? '**Mode Pemandu** menyederhanakan bahasa dan menyembunyikan panel lanjutan — cocok untuk mulai cepat. **Mode Ahli** membuka bobot yang bisa disetel, ekspor CSV/JSON, dan analisis penuh. Model penilaiannya identik di kedua mode — hanya tampilannya beda. Ganti lewat tombol Guided/Expert di bilah atas.'
    : '**Guided mode** simplifies the language and hides advanced panels — good for a quick start. **Expert mode** unlocks pinnable weights, CSV/JSON export, and the full analysis panels. The scoring model is identical in both — only the presentation differs. Switch via the Guided/Expert toggle in the top bar.';
}

function exportInfo(lang: Lang): string {
  return lang === 'id'
    ? 'Di **"Simpan & bagikan"** (langkah 4) Anda bisa mengekspor keputusan sebagai **ADR (MADR)**, laporan lengkap, **CSV/JSON** (mode Ahli), atau membuat **tautan berbagi** yang mereproduksi skenario Anda persis di perangkat lain — semuanya dibuat lokal, tanpa unggah.'
    : 'In **"Save & share"** (step 4) you can export the decision as an **ADR (MADR)**, a full report, **CSV/JSON** (Expert mode), or generate a **share link** that reproduces your exact scenario on another device — all generated locally, nothing uploaded.';
}

function resetInfo(lang: Lang): string {
  return lang === 'id'
    ? 'Tombol **"Atur ulang"** di atas galeri skenario mengembalikan faktor ke default (setelah konfirmasi) dan bisa di-**undo**. Ini juga mengatur ulang chat ini dan tur Copilot, tapi tak memengaruhi tautan yang sudah Anda bagikan.'
    : 'The **"Reset"** button above the scenario gallery restores the default factors (after a confirm) and can be **undone**. It also resets this chat and the Copilot tour, but never touches any share link you already sent.';
}

// Second coverage pass (owner: "sebanyak banyaknya, selengkap-lengkapnya, sedetail-detailnya" — as
// many scenarios as possible, as complete and as detailed as possible). Every answer below still
// reads only the frozen engine or real, existing config/UI — never invented copy.

/** A catalog of EVERY anti-pattern rule this app watches for, regardless of the current scenario —
 *  distinct from `risks()`, which only reports the ones actually triggered right now. */
function antiPatternCatalog(lang: Lang): string {
  const head = lang === 'id' ? '**Semua anti-pattern yang dipantau aplikasi ini:**' : '**Every anti-pattern this app watches for:**';
  const rows = ANTI_PATTERNS.map((r) => `- **${r.severity.toUpperCase()}** — ${tr(r.message, lang)}`).join('\n\n');
  return `${head}\n\n${rows}`;
}

/** Explain a DIMENSION (the axis itself, e.g. "Deployment Granularity") — every option under it,
 *  ranked and scored for the user's current factors. */
function dimensionInfo(dimId: DimensionId, ctx: ChatContext, lang: Lang): string {
  const dim = DIMENSIONS[dimId];
  const ranked = rank(ctx.levels, dimId);
  const rows = ranked.map((r, i) => `${i + 1}. **${r.name}** (${displayScore(r.score)}/100)`).join('\n');
  const head = `**${tr(dim.name, lang)}** — ${tr(dim.guidedLabel, lang)}`;
  const foot = lang === 'id' ? '\n\nSemua opsi dinilai dari faktor proyek Anda saat ini.' : '\n\nAll options are scored from your current project factors.';
  return `${head}\n\n${rows}${foot}`;
}

/** Explain a single FACTOR (a project input, e.g. "Budget") — the question, all 3 levels, and the
 *  user's current answer. */
function factorInfo(factorId: FactorId, ctx: ChatContext, lang: Lang): string {
  const f = FACTORS[factorId];
  const lvl = (ctx.levels[factorId] ?? 0) as 0 | 1 | 2;
  const question = tr(f.question, lang);
  const current = lang === 'id' ? `\n\nJawaban Anda saat ini: **${tr(f.levels[lvl], lang)}**` : `\n\nYour current answer: **${tr(f.levels[lvl], lang)}**`;
  const allHead = lang === 'id' ? '\n\nSemua level:' : '\n\nAll levels:';
  const all = f.levels.map((l, i) => `${i}. ${tr(l, lang)}`).join('\n');
  return `**${tr(f.label, lang)}**\n\n${question}${current}${allHead}\n${all}`;
}

/** A compact summary of all 14 current factor answers ("what are my answers?"). */
function myAnswers(ctx: ChatContext, lang: Lang): string {
  const rows = FACTOR_ORDER.map((f) => {
    const lvl = (ctx.levels[f] ?? 0) as 0 | 1 | 2;
    return `- ${tr(FACTORS[f].label, lang)}: **${tr(FACTORS[f].levels[lvl], lang)}**`;
  }).join('\n');
  const head = lang === 'id' ? '**Jawaban Anda saat ini (14 faktor):**' : '**Your current answers (14 factors):**';
  return `${head}\n\n${rows}`;
}

/** Runner-up(s) for a dimension — "what's the alternative / second-best option?" */
function alternatives(ctx: ChatContext, lang: Lang, dimId: DimensionId = 'D1'): string {
  const ranked = rank(ctx.levels, dimId);
  const rows = ranked.slice(1, 3).map((r, i) => `${i + 2}. **${r.name}** (${displayScore(r.score)}/100)`).join('\n');
  const head =
    lang === 'id'
      ? `**Alternatif untuk ${tr(DIMENSIONS[dimId].name, lang)}** (setelah ${ranked[0].name}):`
      : `**Alternatives for ${tr(DIMENSIONS[dimId].name, lang)}** (after ${ranked[0].name}):`;
  return `${head}\n\n${rows}`;
}

/** A quality-attribute glossary lookup ("what is scalability?"), distinct from the architecture
 *  GLOSSARY below — these are the 12 ISO/IEC 25010 attributes the whole model is built from. */
function qaInfo(text: string, lang: Lang): string | null {
  const hit = QA_ORDER.find((q) => {
    const a = QUALITY_ATTRIBUTES[q];
    return has(text, a.name.en.toLowerCase(), a.name.id.toLowerCase(), a.plain.en.toLowerCase(), a.plain.id.toLowerCase());
  });
  if (!hit) return null;
  const a = QUALITY_ATTRIBUTES[hit];
  return `**${tr(a.name, lang)}** (${tr(a.plain, lang)})\n\n${tr(a.gloss, lang)}\n\n_ISO/IEC 25010: ${a.isoMapping}_`;
}

/** Static app-usage FAQ, data-driven so new entries are a one-line addition (no new if-branch). */
const FAQ: { keywords: string[]; answer: Bilingual }[] = [
  {
    keywords: ['shortcut', 'keyboard', 'pintasan', 'command palette', 'palet perintah'],
    answer: {
      en: 'Handy shortcuts: **⌘/Ctrl+K** opens the command palette, **⌘/Ctrl+S** saves an ADR, and **Esc** closes any open panel. The palette also has Pin A/B, Compare, CSV/JSON, and mode switches.',
      id: 'Pintasan berguna: **⌘/Ctrl+K** membuka palet perintah, **⌘/Ctrl+S** menyimpan ADR, dan **Esc** menutup panel yang terbuka. Paletnya juga punya Pin A/B, Bandingkan, CSV/JSON, dan ganti mode.',
    },
  },
  {
    keywords: ['compare scenario', 'two scenarios', 'pin a scenario', 'pin b', 'snapshot', 'bandingkan skenario', 'bandingkan dua skenario', 'pin skenario'],
    answer: {
      en: 'Use **Pin A** / **Pin B** (command palette) to snapshot two scenarios, then **Compare** to see them side by side — all stored locally, nothing uploaded.',
      id: 'Gunakan **Pin A** / **Pin B** (palet perintah) untuk menyimpan dua skenario, lalu **Bandingkan** untuk melihatnya berdampingan — semua tersimpan lokal, tanpa unggah.',
    },
  },
  {
    keywords: ['dark mode', 'light mode', 'tema gelap', 'tema terang', 'switch theme', 'ganti tema'],
    answer: {
      en: 'Toggle the sun/moon icon in the top bar to switch between light and dark themes — verified for WCAG AA contrast in both.',
      id: 'Ketuk ikon matahari/bulan di bilah atas untuk beralih tema terang/gelap — sudah diverifikasi kontras WCAG AA di keduanya.',
    },
  },
  {
    keywords: ['switch language', 'change language', 'ganti bahasa', 'bahasa indonesia', 'bahasa inggris'],
    answer: {
      en: 'Use the **EN / ID** toggle in the top bar to switch languages instantly — every label, including mine, is bilingual.',
      id: 'Gunakan tombol **EN / ID** di bilah atas untuk ganti bahasa seketika — semua label, termasuk saya, dwibahasa.',
    },
  },
  {
    keywords: ['install this app', 'add to home screen', 'pwa', 'install app', 'instal aplikasi', 'aplikasi offline'],
    answer: {
      en: "This app is a **PWA** — installable from your browser's menu (Add to Home Screen / Install App) and works fully offline afterward.",
      id: 'Aplikasi ini adalah **PWA** — bisa diinstal dari menu peramban Anda (Tambah ke Layar Utama / Instal Aplikasi) dan bekerja penuh secara offline sesudahnya.',
    },
  },
  {
    keywords: ['accessible', 'accessibility', 'screen reader', 'aksesibilitas', 'wcag', 'pembaca layar'],
    answer: {
      en: 'The app is verified for **WCAG AA** color contrast in both themes and is fully keyboard-operable — every control (including this chat) has real labels for screen readers.',
      id: 'Aplikasi ini terverifikasi kontras warna **WCAG AA** di kedua tema dan sepenuhnya bisa dioperasikan lewat keyboard — setiap kontrol (termasuk obrolan ini) punya label nyata untuk pembaca layar.',
    },
  },
  {
    keywords: ['which browser', 'browser support', 'browser apa', 'dukungan browser'],
    answer: {
      en: 'Recommended: the latest two versions of **Chrome, Edge, Firefox, or Safari** (desktop and mobile), responsive down to 360px. Internet Explorer is not supported.',
      id: 'Rekomendasi: dua versi terbaru **Chrome, Edge, Firefox, atau Safari** (desktop dan mobile), responsif hingga 360px. Internet Explorer tidak didukung.',
    },
  },
  {
    keywords: ['how is the score calculated', 'how does scoring work', 'methodology', 'metodologi', 'bagaimana skor dihitung', 'cara menghitung skor'],
    answer: {
      en: 'Pipeline: **your answers → weighted priorities → 1–5 fit per option → Score = Σ weight × fit**, normalized to /100. Open "How does it decide?" under any recommendation for the full, auditable numbers.',
      id: 'Alur: **jawaban Anda → prioritas berbobot → kecocokan 1–5 per opsi → Skor = Σ bobot × kecocokan**, dinormalisasi ke /100. Buka "Bagaimana ia memutuskan?" di bawah rekomendasi mana pun untuk angka lengkap yang bisa diaudit.',
    },
  },
  {
    keywords: ['custom wizard', 'build custom system', 'wizard kustom', 'sistem kustom', 'bangun sistem sendiri'],
    answer: {
      en: 'The **Custom Wizard** (dashed card in the scenario gallery) asks 4 plain questions (goal, domain, priorities, constraints) and maps them onto the same 14 factors — one scoring model either way.',
      id: '**Wizard Kustom** (kartu bergaris putus di galeri skenario) menanyakan 4 pertanyaan sederhana (tujuan, domain, prioritas, batasan) dan memetakannya ke 14 faktor yang sama — satu model penilaian untuk keduanya.',
    },
  },
];

function glossary(text: string, lang: Lang): string | null {
  const hit = GLOSSARY.find((g) => text.includes(g.term.en.toLowerCase()) || text.includes(g.term.id.toLowerCase()));
  return hit ? `**${tr(hit.term, lang)}**\n\n${tr(hit.definition, lang)}` : null;
}

function capabilities(lang: Lang): string {
  return lang === 'id'
    ? [
        'Saya **Chat Advisor** — dihitung dari model, bukan model bahasa. Saya bisa:',
        '- **Merekomendasikan** arsitektur untuk skenario Anda ("apa rekomendasinya?")',
        '- **Menjelaskan** arsitektur mana pun ("apa itu microservices?")',
        '- **Membandingkan** dua opsi ("monolith vs microservices")',
        '- Menjelaskan **kenapa** suatu pilihan menang ("kenapa?")',
        '- Menjawab istilah dari **glosarium** (arsitektur maupun 12 **atribut kualitas**)',
        '- Menunjukkan **biaya/operasional**, **risiko/anti-pattern** (skenario Anda atau katalog lengkap), **sensitivitas**, dan **jalur migrasi**',
        '- Menjelaskan **dimensi** ("apa itu granularitas deploy?"), **faktor** ("apa itu budget?"), **jawaban Anda saat ini**, dan **alternatif/runner-up**',
        '- Menjawab soal **privasi**, **mode**, **ekspor**, **reset**, **pintasan keyboard**, **tema**, **bahasa**, **instalasi PWA**, **aksesibilitas**, **browser**, **metodologi skor**, dan **Wizard Kustom**',
      ].join('\n')
    : [
        "I'm the **Chat Advisor** — computed from the model, not a language model. I can:",
        '- **Recommend** an architecture for your scenario ("what do you recommend?")',
        '- **Explain** any architecture ("what is microservices?")',
        '- **Compare** two options ("monolith vs microservices")',
        '- Explain **why** a pick wins ("why?")',
        '- Answer **glossary** terms (architecture *and* the 12 **quality attributes**)',
        '- Cover **cost/ops**, **risk/anti-patterns** (your scenario or the full catalog), **sensitivity**, and **migration paths**',
        '- Explain a **dimension** ("what is deployment granularity?"), a **factor** ("what is budget?"), **your current answers**, and **alternatives/runner-up**',
        '- Answer **privacy**, **mode**, **export**, **reset**, **keyboard shortcuts**, **theme**, **language**, **PWA install**, **accessibility**, **browser support**, **scoring methodology**, and the **Custom Wizard**',
      ].join('\n');
}

function fallback(lang: Lang): string {
  const intro = lang === 'id' ? 'Saya belum menangkap itu. ' : "I didn't quite catch that. ";
  return intro + capabilities(lang);
}

/** Pure, deterministic answer — the single source of the local adapter's output (unit-tested). */
export function answerText(input: string, ctx: ChatContext): string {
  const lang = ctx.lang;
  const text = input.trim().toLowerCase();
  if (!text) return capabilities(lang);

  if (has(text, 'help', 'what can you', 'bantuan', 'bisa apa', 'kemampuan')) return capabilities(lang);

  const matched = findOptions(text);

  // Dimension/factor lookups are checked FIRST among the broadened-coverage intents: they only
  // ever match an exact, on-screen label (e.g. "Budget / cost flexibility"), which is far more
  // specific than the generic keywords below (e.g. "cost") — so a factor question is never
  // shadowed by a keyword that happens to also appear inside that factor's own label.
  const dimHit = findDimension(text);
  if (dimHit) return dimensionInfo(dimHit, ctx, lang);

  const factorHit = findFactor(text);
  if (factorHit) return factorInfo(factorHit, ctx, lang);

  // App-usage / meta FAQ (broadened scenario coverage, owner request): so no aspect of using the
  // app — privacy, mode, exporting, resetting, cost, risk, sensitivity, migration — leaves anyone
  // confused. Checked before the glossary/explain intents since these are more specific questions.
  if (has(text, 'private', 'privacy', 'offline', 'server', 'account', 'sign up', 'telemetry', 'privasi', 'akun', 'daftar', 'gratis', 'free')) return privacyInfo(lang);
  if (has(text, 'guided mode', 'expert mode', 'mode ahli', 'mode pemandu', 'which mode', 'mode apa', 'beda mode')) return modeInfo(lang);
  if (has(text, 'export', 'download', 'share link', 'adr', 'ekspor', 'unduh', 'bagikan', 'simpan hasil')) return exportInfo(lang);
  if (has(text, 'reset', 'start over', 'mulai ulang', 'atur ulang', 'hapus semua')) return resetInfo(lang);
  if (has(text, 'migration', 'migrate', 'brownfield', 'legacy system', 'existing system', 'migrasi', 'sistem lama', 'sistem existing')) return migrationInfo(text, lang);
  if (has(text, 'cost', 'expensive', 'infra cost', 'operational overhead', 'biaya', 'mahal', 'operasional')) {
    return costOps(ctx, lang, matched.find((o) => o.dim === 'D1')?.id);
  }
  if (has(text, 'anti-pattern', 'anti pattern', 'risk', 'warning', 'gotcha', 'risiko', 'peringatan', 'waspada')) {
    // "all/every/list" asks for the full catalog; otherwise it's about THIS scenario's combination.
    if (has(text, 'all', 'every', 'list', 'catalog', 'general', 'semua', 'semuanya', 'daftar', 'apa saja')) return antiPatternCatalog(lang);
    return risks(ctx, lang);
  }
  if (has(text, 'sensitivity', 'sensitive', 'what if i change', 'how close', 'sensitif', 'kalau saya ubah', 'seberapa dekat')) return sensitivityInfo(ctx, lang);

  // Second coverage pass: FAQ table (one-line-per-entry, easy to extend), then current-answers/
  // alternatives/QA lookups — all still grounded in real config, never invented.
  const faqHit = FAQ.find((f) => has(text, ...f.keywords));
  if (faqHit) return tr(faqHit.answer, lang);

  if (has(text, 'my answer', 'my factor', 'my level', 'current answer', 'jawaban saya', 'faktor saya', 'level saya')) return myAnswers(ctx, lang);
  if (has(text, 'runner up', 'runner-up', 'second best', 'alternative', 'peringkat kedua', 'alternatif', 'opsi lain')) return alternatives(ctx, lang);

  const qa = qaInfo(text, lang);
  if (qa) return qa;

  const g = glossary(text, lang);
  if (g && !matched.length) return g;

  if (matched.length >= 2 && has(text, 'vs', 'versus', 'compare', 'banding', 'atau', 'or')) {
    return compare(matched[0], matched[1], lang);
  }
  if (has(text, 'why', 'kenapa', 'mengapa', 'alasan')) return why(ctx, lang);
  if (matched.length >= 1 && !has(text, 'recommend', 'rekomendasi')) {
    return explain(matched[0].id, matched[0].dim, ctx, lang);
  }
  if (has(text, 'recommend', 'rekomendasi', 'suggest', 'saran', 'best', 'terbaik', 'which', 'mana', 'what should', 'pilih', 'choose', 'plan', 'rencana')) {
    return recommendation(ctx, lang);
  }
  return fallback(lang);
}

/** Split into stream chunks (words) — simulated streaming so the UI contract matches a future LLM. */
function* chunksOf(text: string): Generator<string> {
  const parts = text.match(/\S+\s*/g) ?? [text];
  for (let i = 0; i < parts.length; i += 3) yield parts.slice(i, i + 3).join('');
}

const delay = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('aborted', 'AbortError'));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('aborted', 'AbortError'));
    }, { once: true });
  });

export const localAdvisorAdapter: ChatAdapter = {
  id: 'local-advisor',
  network: false,
  async *reply(history, context, signal): AsyncIterable<ChatChunk> {
    const last = [...history].reverse().find((m) => m.role === 'user');
    const full = answerText(last?.text ?? '', context);
    for (const delta of chunksOf(full)) {
      await delay(18, signal); // paced reveal; instant-cancel on abort
      yield { delta };
    }
  },
};
