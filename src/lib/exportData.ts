import { buildSnapshot, type ExportInput } from './snapshot';
import { composite, displayScore } from './scoring';
import { DIMENSIONS, DIMENSION_ORDER } from '../config/dimensions';
import { QA_ORDER, QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import type { Weights } from '../types';

const csvCell = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// scores.csv — every option in every dimension with its live score and 12 qaFit values.
export function generateScoresCsv(weights: Weights): string {
  const header = ['Dimension', 'Option', 'Score%', ...QA_ORDER.map((q) => QUALITY_ATTRIBUTES[q].name.en)];
  const rows = [header.map(csvCell).join(',')];
  for (const dim of DIMENSION_ORDER) {
    for (const o of DIMENSIONS[dim].options) {
      const score = displayScore(composite(weights, o.qaFit));
      rows.push([DIMENSIONS[dim].name.en, o.name, score, ...o.qaFit].map(csvCell).join(','));
    }
  }
  return rows.join('\n');
}

// assessment.json — the full computed decision (factors, weights, rankings, selections, warnings).
export function generateAssessmentJson(input: ExportInput): string {
  const s = buildSnapshot(input);
  const assessment = {
    factors: s.levels,
    weights: s.rounded,
    selections: s.selections,
    rankings: Object.fromEntries(
      DIMENSION_ORDER.map((dim) => [
        dim,
        s.rankings[dim].map((o) => ({ id: o.id, name: o.name, score: displayScore(o.score) })),
      ]),
    ),
    antiPatterns: s.antiPatterns.map((r) => ({ id: r.id, severity: r.severity })),
  };
  return JSON.stringify(assessment, null, 2);
}
