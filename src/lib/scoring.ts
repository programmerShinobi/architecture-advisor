import type { DimensionId, Levels, QaId, RankedOption, Weights } from '../types';
import { QA_ORDER } from '../config/qualityAttributes';
import { FACTOR_ORDER } from '../config/factors';
import { INFLUENCE } from '../config/factorQaMatrix';
import { DIMENSIONS } from '../config/dimensions';

// Pure scoring engine. Mirrors docs/03-blueprint/scoring-algorithm.md exactly and is the
// TypeScript twin of scripts/verify-model.mjs (the executable source of truth). All functions
// are pure and deterministic; the matching test suite asserts fixtures A–C and invariants.

/** Step 1 — derive normalized QA weights (summing to 100) from factor levels. */
export function deriveWeights(levels: Levels): Weights {
  const raw = Object.fromEntries(QA_ORDER.map((q) => [q, 0])) as Weights;
  for (const f of FACTOR_ORDER) {
    const level = levels[f] ?? 0;
    const effective = f === 'budget' ? 2 - level : level; // budget is inverted
    for (const [q, inf] of Object.entries(INFLUENCE[f])) {
      raw[q as QaId] += (inf as number) * effective;
    }
  }
  for (const q of QA_ORDER) raw[q] = Math.max(0, raw[q]); // clamp negatives before normalizing
  const sum = QA_ORDER.reduce((s, q) => s + raw[q], 0);
  if (sum === 0) {
    // equal-weight fallback: no factor sends any signal
    return Object.fromEntries(QA_ORDER.map((q) => [q, 100 / 12])) as Weights;
  }
  return Object.fromEntries(QA_ORDER.map((q) => [q, (raw[q] / sum) * 100])) as Weights;
}

/** Step 2 — composite score of an option given weights and its qaFit vector. Result ∈ [1, 5]. */
export function composite(weights: Weights, qaFit: number[]): number {
  return QA_ORDER.reduce((s, q, i) => s + (weights[q] / 100) * (qaFit[i] ?? 3), 0);
}

/** Step 3 — rank a dimension's options by composite, tie-broken by canonical config order. */
export function rank(levels: Levels, dim: DimensionId): RankedOption[] {
  const weights = deriveWeights(levels);
  return DIMENSIONS[dim].options
    .map((opt, index) => ({ name: opt.name, id: opt.id, score: composite(weights, opt.qaFit), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

/** Display score 0–100: composite / 5 × 100, rounded (scoring-algorithm.md Section 7). */
export const displayScore = (compositeScore: number): number => Math.round((compositeScore / 5) * 100);

/**
 * Largest-remainder (Hamilton) rounding of QA weights to integers that sum to exactly 100,
 * for honest display (scoring-algorithm.md Section 7). Ties broken by canonical QA order.
 */
export function roundWeights(weights: Weights): Record<QaId, number> {
  const floors = {} as Record<QaId, number>;
  const remainders: { q: QaId; rem: number; i: number }[] = [];
  let used = 0;
  QA_ORDER.forEach((q, i) => {
    const f = Math.floor(weights[q]);
    floors[q] = f;
    used += f;
    remainders.push({ q, rem: weights[q] - f, i });
  });
  const need = 100 - used;
  remainders.sort((a, b) => b.rem - a.rem || a.i - b.i);
  for (let k = 0; k < need; k++) floors[remainders[k].q]++;
  return floors;
}

/** Close-call: the relative gap between the top two is under 10% (FR-REC-6). */
export function isCloseCall(ranked: RankedOption[]): boolean {
  if (ranked.length < 2) return false;
  return (ranked[0].score - ranked[1].score) / ranked[0].score < 0.1;
}

export interface Contribution {
  qa: QaId;
  weight: number;
  fit: number;
  points: number;
}

/**
 * Per-QA contribution breakdown for one option: weight%, fit (1–5), and weighted points
 * (weight/100 × fit). Sorted by contribution. The points sum exactly to the composite score
 * (FR-REC-4 reconciliation).
 */
export function contributions(weights: Weights, qaFit: number[]): Contribution[] {
  return QA_ORDER.map((q, i) => {
    const fit = qaFit[i] ?? 3;
    return { qa: q, weight: weights[q], fit, points: (weights[q] / 100) * fit };
  }).sort((a, b) => b.points - a.points);
}

export interface Flip {
  factor: string;
  to: number;
  newWinner: string;
}

/** Step 4 — single-factor (±1 level) sensitivity: which changes would flip the winner. */
export function sensitivity(levels: Levels, dim: DimensionId = 'D1'): Flip[] {
  const winner = rank(levels, dim)[0].name;
  const flips: Flip[] = [];
  for (const f of FACTOR_ORDER) {
    for (const delta of [-1, 1] as const) {
      const next = (levels[f] ?? 0) + delta;
      if (next < 0 || next > 2) continue;
      const top = rank({ ...levels, [f]: next }, dim)[0].name;
      if (top !== winner) flips.push({ factor: f, to: next, newWinner: top });
    }
  }
  return flips;
}
