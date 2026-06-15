import { buildSnapshot, type ExportInput } from './snapshot';
import { isCloseCall } from './scoring';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';

// A plain-language executive summary of the decision — so a report reads clearly for a
// non-technical decision-maker as well as an architect. Used by the report, ADR, and print views.
export function executiveSummary(input: ExportInput): string {
  const s = buildSnapshot(input);
  const lang = s.lang;
  const picks = DIMENSION_ORDER.map(
    (d) => DIMENSIONS[d].options.find((o) => o.id === s.selections[d])?.name ?? s.selections[d],
  );
  const topQA = s.topQAs[0];
  const topName = topQA ? QUALITY_ATTRIBUTES[topQA].name[lang] : '';
  const topW = topQA ? s.rounded[topQA] : 0;
  const robust = !isCloseCall(s.rankings.D1);

  if (lang === 'id') {
    return (
      `Untuk proyek seperti yang Anda jelaskan, arsitektur yang direkomendasikan adalah ` +
      `**${picks[0]}** (deployment), dengan ${picks[1]} untuk komunikasi, ${picks[2]} untuk data, ` +
      `${picks[3]} untuk struktur kode, dan ${picks[4]} untuk frontend. ` +
      `Pendorong terkuat dari pilihan Anda adalah **${topName}** (${topW}%). ` +
      `Pilihan deployment ini ${robust ? 'tergolong **tangguh** — tidak mudah berubah oleh satu jawaban' : 'merupakan **selisih tipis** — pertimbangkan penilaian tim'}.`
    );
  }
  return (
    `For a project like the one you described, the recommended architecture is ` +
    `**${picks[0]}** (deployment), with ${picks[1]} for communication, ${picks[2]} for data, ` +
    `${picks[3]} for code structure, and ${picks[4]} for the frontend. ` +
    `The strongest driver of your choices is **${topName}** (${topW}%). ` +
    `This deployment pick is ${robust ? '**robust** — no single answer flips it' : 'a **close call** — weigh team judgment'}.`
  );
}
