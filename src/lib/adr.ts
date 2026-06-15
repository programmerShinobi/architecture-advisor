import { buildSnapshot, type ExportInput } from './snapshot';
import { displayScore } from './scoring';
import { label } from './exportLabels';
import { executiveSummary } from './summary';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import { FACTOR_ORDER, FACTORS } from '../config/factors';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import { METHOD_REFERENCES } from '../config/references';

// Generates a Markdown Architectural Decision Record (MADR format) for the current decision.
export function generateAdr(input: ExportInput): string {
  const s = buildSnapshot(input);
  const lang = s.lang;
  const L = (k: Parameters<typeof label>[1]) => label(lang, k);
  const tr = (b: { en: string; id: string }) => b[lang];
  const optName = (dim: (typeof DIMENSION_ORDER)[number], id: string) =>
    DIMENSIONS[dim].options.find((o) => o.id === id)?.name ?? id;

  const today = new Date().toISOString().slice(0, 10);
  const chosen = DIMENSION_ORDER.map((d) => optName(d, s.selections[d]));
  const out: string[] = [];

  out.push(`# ${L('adrTitle')}: ${chosen[0]} + ${chosen[1]} + ${chosen[2]}`);
  out.push('');
  out.push(`- **${L('status')}:** ${L('proposed')}`);
  out.push(`- **${L('date')}:** ${today}`);
  out.push('');

  out.push(`## ${L('context')}`);
  out.push('');
  out.push(executiveSummary(input));
  out.push('');
  out.push(L('contextBody'));
  out.push('');
  for (const f of FACTOR_ORDER) {
    const lvl = s.levels[f] ?? 0;
    out.push(`- ${tr(FACTORS[f].label)}: **${tr(FACTORS[f].levels[lvl])}**`);
  }
  out.push('');

  out.push(`## ${L('drivers')}`);
  out.push('');
  for (const q of s.topQAs.slice(0, 5)) {
    out.push(`- ${tr(QUALITY_ATTRIBUTES[q].name)} — ${s.rounded[q]}%`);
  }
  out.push('');

  out.push(`## ${L('consideredOptions')}`);
  out.push('');
  for (const dim of DIMENSION_ORDER) {
    out.push(`### ${tr(DIMENSIONS[dim].name)}`);
    for (const o of s.rankings[dim]) {
      const star = o.id === s.selections[dim] ? ' ✅' : '';
      out.push(`- ${o.name} — ${displayScore(o.score)}/100${star}`);
    }
    out.push('');
  }

  out.push(`## ${L('decisionOutcome')}`);
  out.push('');
  out.push(`**${L('chosen')}:**`);
  DIMENSION_ORDER.forEach((d, i) => out.push(`- ${tr(DIMENSIONS[d].name)}: **${chosen[i]}**`));
  out.push('');
  out.push(L('rationale'));
  out.push('');

  out.push(`## ${L('consequences')}`);
  out.push('');
  out.push(`- **${L('good')}:** ${L('goodBody')}`);
  if (s.antiPatterns.length === 0) {
    out.push(`- **${L('badRisks')}:** ${L('noWarnings')}`);
  } else {
    out.push(`- **${L('badRisks')}:**`);
    for (const r of s.antiPatterns) out.push(`  - [${r.severity}] ${tr(r.message)}`);
  }
  out.push('');

  out.push(`## ${L('links')}`);
  out.push('');
  for (const ref of METHOD_REFERENCES) out.push(`- [${ref.label}](${ref.url}) — ${tr(ref.note)}`);
  out.push('');

  return out.join('\n');
}
