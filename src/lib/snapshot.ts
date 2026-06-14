import type { DimensionId, Lang, Levels, QaId, RankedOption, Weights } from '../types';
import { effectiveWeights, rankWith, roundWeights, type Overrides } from './scoring';
import { detectAntiPatterns } from './antiPatternEngine';
import { DIMENSION_ORDER } from '../config/dimensions';
import { QA_ORDER } from '../config/qualityAttributes';
import type { AntiPatternRule } from '../config/antiPatterns';

// A complete, computed view of the current decision — the single input to every exporter
// (ADR, report, C4). Pure: derived only from inputs + canonical config.

export interface ExportInput {
  levels: Levels;
  overrides: Overrides;
  selections: Record<DimensionId, string>;
  lang: Lang;
}

export interface Snapshot {
  lang: Lang;
  levels: Levels;
  weights: Weights;
  rounded: Record<QaId, number>;
  rankings: Record<DimensionId, RankedOption[]>;
  selections: Record<DimensionId, string>;
  topQAs: QaId[];
  antiPatterns: AntiPatternRule[];
}

export function buildSnapshot(input: ExportInput): Snapshot {
  const weights = effectiveWeights(input.levels, input.overrides);
  const rounded = roundWeights(weights);
  const rankings = Object.fromEntries(
    DIMENSION_ORDER.map((d) => [d, rankWith(weights, d)]),
  ) as Record<DimensionId, RankedOption[]>;
  const topQAs = [...QA_ORDER].filter((q) => rounded[q] > 0).sort((a, b) => rounded[b] - rounded[a]);
  const antiPatterns = detectAntiPatterns({
    levels: input.levels,
    selections: input.selections,
    migrationPathChosen: false,
  });
  return {
    lang: input.lang,
    levels: input.levels,
    weights,
    rounded,
    rankings,
    selections: input.selections,
    topQAs,
    antiPatterns,
  };
}
