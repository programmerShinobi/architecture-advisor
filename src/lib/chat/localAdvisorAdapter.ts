import { DIMENSIONS, DIMENSION_ORDER } from '../../config/dimensions';
import { OPTION_BLURB } from '../../config/dimensionContent';
import { GLOSSARY } from '../../config/glossary';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../../config/qualityAttributes';
import { effectiveWeights, rank, roundWeights, contributions, displayScore } from '../scoring';
import type { ChatAdapter, ChatChunk, ChatContext } from './types';
import type { Bilingual, DimensionId, Lang, QaId } from '../../types';

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

function glossary(text: string, lang: Lang): string | null {
  const hit = GLOSSARY.find((g) => text.includes(g.term.en.toLowerCase()) || text.includes(g.term.id.toLowerCase()));
  return hit ? `**${tr(hit.term, lang)}**\n\n${tr(hit.definition, lang)}` : null;
}

function capabilities(lang: Lang): string {
  return lang === 'id'
    ? [
        'Saya **AI Advisor** — dihitung dari model, bukan model bahasa. Saya bisa:',
        '- **Merekomendasikan** arsitektur untuk skenario Anda ("apa rekomendasinya?")',
        '- **Menjelaskan** arsitektur mana pun ("apa itu microservices?")',
        '- **Membandingkan** dua opsi ("monolith vs microservices")',
        '- Menjelaskan **kenapa** suatu pilihan menang ("kenapa?")',
        '- Menjawab istilah dari **glosarium**',
      ].join('\n')
    : [
        "I'm the **AI Advisor** — computed from the model, not a language model. I can:",
        '- **Recommend** an architecture for your scenario ("what do you recommend?")',
        '- **Explain** any architecture ("what is microservices?")',
        '- **Compare** two options ("monolith vs microservices")',
        '- Explain **why** a pick wins ("why?")',
        '- Answer **glossary** terms',
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

  const g = glossary(text, lang);
  if (g && !findOptions(text).length) return g;

  const matched = findOptions(text);
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
