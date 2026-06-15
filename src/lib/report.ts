import { buildSnapshot, type ExportInput } from './snapshot';
import { contributions, displayScore } from './scoring';
import { label } from './exportLabels';
import { executiveSummary } from './summary';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import { FACTOR_ORDER, FACTORS } from '../config/factors';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import { OPTION_BLURB } from '../config/dimensionContent';
import { RISKS } from '../config/risks';
import { FITNESS_TEMPLATES } from '../config/fitnessFunctions';
import { METHOD_REFERENCES } from '../config/references';

// Generates the full Markdown recommendation report for the current decision.
export function generateReport(input: ExportInput): string {
  const s = buildSnapshot(input);
  const lang = s.lang;
  const L = (k: Parameters<typeof label>[1]) => label(lang, k);
  const tr = (b: { en: string; id: string }) => b[lang];
  const out: string[] = [];

  out.push(`# ${L('reportTitle')}`);
  out.push('');
  out.push(`> ${L('disclaimer')}`);
  out.push('');

  out.push(`## ${L('execSummary')}`);
  out.push('');
  out.push(executiveSummary(input));
  out.push('');

  out.push(`## ${L('factorInputs')}`);
  out.push('');
  for (const f of FACTOR_ORDER) {
    const lvl = s.levels[f] ?? 0;
    out.push(`- ${tr(FACTORS[f].label)}: **${tr(FACTORS[f].levels[lvl])}**`);
  }
  out.push('');

  out.push(`## ${L('qaPriorities')}`);
  out.push('');
  out.push(`| ${L('option')} | ${L('weight')} |`);
  out.push('|---|---|');
  for (const q of s.topQAs) out.push(`| ${tr(QUALITY_ATTRIBUTES[q].name)} | ${s.rounded[q]}% |`);
  out.push('');

  out.push(`## ${L('recommendations')}`);
  out.push('');
  for (const dim of DIMENSION_ORDER) {
    out.push(`### ${tr(DIMENSIONS[dim].name)}`);
    const blurb = OPTION_BLURB[`${dim}:${s.selections[dim]}`];
    if (blurb) out.push(`*${L('inPlainTerms')}: ${tr(blurb.plain)}.*`, '');
    for (const o of s.rankings[dim]) {
      const star = o.id === s.selections[dim] ? ` ✅ ${L('recommended')}` : '';
      out.push(`- ${o.name} — ${displayScore(o.score)}/100${star}`);
    }
    out.push('');
  }

  const d1 = DIMENSIONS.D1.options.find((o) => o.id === s.selections.D1) ?? DIMENSIONS.D1.options[0];
  out.push(`## ${L('contribution')}: ${d1.name}`);
  out.push('');
  out.push(`| ${L('option')} | ${L('weight')} | ${L('fit')} | ${L('points')} |`);
  out.push('|---|---|---|---|');
  for (const c of contributions(s.weights, d1.qaFit).filter((c) => c.weight > 0.05)) {
    out.push(`| ${tr(QUALITY_ATTRIBUTES[c.qa].name)} | ${Math.round(c.weight)}% | ${c.fit} | ${c.points.toFixed(2)} |`);
  }
  out.push('');

  out.push(`## ${L('antiPatterns')}`);
  out.push('');
  if (s.antiPatterns.length === 0) out.push(L('noWarnings'));
  else for (const r of s.antiPatterns) out.push(`- **[${r.severity}]** ${tr(r.message)}`);
  out.push('');

  out.push(`## ${L('risks')}`);
  out.push('');
  for (const dim of DIMENSION_ORDER) {
    const optId = s.selections[dim];
    const opt = DIMENSIONS[dim].options.find((o) => o.id === optId);
    for (const risk of RISKS[`${dim}:${optId}`] ?? []) {
      out.push(
        `- **${opt?.name ?? optId}** (${L('likelihood')} ${risk.likelihood}, ${L('impact')} ${risk.impact}): ${tr(risk.description)} — ${L('mitigation')}: ${tr(risk.mitigation)}`,
      );
    }
  }
  out.push('');

  out.push(`## ${L('fitness')}`);
  out.push('');
  for (const q of s.topQAs.slice(0, 4)) {
    out.push(`- **${tr(QUALITY_ATTRIBUTES[q].name)}** (${s.rounded[q]}%): ${tr(FITNESS_TEMPLATES[q])}`);
  }
  out.push('');

  out.push(`## ${L('references')}`);
  out.push('');
  for (const ref of METHOD_REFERENCES) out.push(`- [${ref.label}](${ref.url}) — ${tr(ref.note)}`);
  out.push('');

  return out.join('\n');
}
