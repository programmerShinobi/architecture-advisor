import { buildSnapshot, type ExportInput } from './snapshot';
import { compensations, isCloseCall } from './scoring';
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

  // The Advisor shows a compensation disclosure on screen when the pick is weak on something the
  // reader's priorities rank highly. An exported decision record is the artefact that gets
  // circulated and archived, so omitting that caveat here would let the caveat quietly disappear at
  // exactly the moment the decision becomes permanent. Caveats the SELECTED option, not the
  // top-ranked one — the record documents the decision that was actually made.
  const chosenD1 = DIMENSIONS.D1.options.find((o) => o.id === s.selections.D1);
  const comps = chosenD1 ? compensations(s.weights, chosenD1.qaFit).slice(0, 2) : [];
  const caveat = comps.length === 0 ? '' : lang === 'id'
    ? ` Perlu dicatat: pilihan ini bernilai rendah pada ` +
      comps.map((c) => `**${QUALITY_ATTRIBUTES[c.qa].name.id}** (${c.fit}/5, berbobot ${s.rounded[c.qa]}%)`).join(' dan ') +
      `, dan tetap unggul karena kekuatannya di tempat lain menutupi hal itu.`
    : ` Worth recording: this pick scores low on ` +
      comps.map((c) => `**${QUALITY_ATTRIBUTES[c.qa].name.en}** (${c.fit}/5, weighted ${s.rounded[c.qa]}%)`).join(' and ') +
      `, and still finishes first because its strengths elsewhere outweigh that.`;

  if (lang === 'id') {
    return (
      `Untuk proyek seperti yang Anda jelaskan, arsitektur yang direkomendasikan adalah ` +
      `**${picks[0]}** (deployment), dengan ${picks[1]} untuk komunikasi, ${picks[2]} untuk data, ` +
      `${picks[3]} untuk struktur kode, dan ${picks[4]} untuk frontend. ` +
      `Pendorong terkuat dari pilihan Anda adalah **${topName}** (${topW}%). ` +
      `Pilihan deployment ini ${robust ? 'tergolong **tangguh** — tidak mudah berubah oleh satu jawaban' : 'merupakan **selisih tipis** — pertimbangkan penilaian tim'}.` + caveat
    );
  }
  return (
    `For a project like the one you described, the recommended architecture is ` +
    `**${picks[0]}** (deployment), with ${picks[1]} for communication, ${picks[2]} for data, ` +
    `${picks[3]} for code structure, and ${picks[4]} for the frontend. ` +
    `The strongest driver of your choices is **${topName}** (${topW}%). ` +
    `This deployment pick is ${robust ? '**robust** — no single answer flips it' : 'a **close call** — weigh team judgment'}.` + caveat
  );
}
