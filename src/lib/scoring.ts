import type { DimensionId, FactorId, Levels, QaId, RankedOption, Weights } from '../types';
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

/** Override values for locked QAs (expert mode). Keys present = locked at that value (0..100). */
export type Overrides = Partial<Record<QaId, number>>;

/**
 * Effective weights with expert overrides (scoring-algorithm.md Section 3.4): locked QAs keep
 * their override; unlocked QAs share the remainder R = max(0, 100 − Σlocked) proportionally to
 * their derived raw weights. Deterministic edge cases (all locked / Σ>100 / unlocked all zero).
 */
export function effectiveWeights(levels: Levels, overrides: Overrides = {}): Weights {
  const raw = deriveWeights(levels);
  const locked = QA_ORDER.filter((q) => overrides[q] !== undefined);
  if (locked.length === 0) return raw;

  const sumL = locked.reduce((a, q) => a + (overrides[q] as number), 0);
  const unlocked = QA_ORDER.filter((q) => overrides[q] === undefined);
  const result = {} as Weights;

  // Everything locked, or locked values already meet/exceed 100 → rescale locked to 100, unlocked 0.
  if (unlocked.length === 0 || sumL >= 100) {
    const scale = sumL > 0 ? 100 / sumL : 0;
    for (const q of QA_ORDER) result[q] = overrides[q] !== undefined ? (overrides[q] as number) * scale : 0;
    return result;
  }

  const R = 100 - sumL;
  const rawU = unlocked.reduce((a, q) => a + raw[q], 0);
  for (const q of QA_ORDER) {
    if (overrides[q] !== undefined) result[q] = overrides[q] as number;
    else result[q] = rawU > 0 ? (raw[q] / rawU) * R : R / unlocked.length;
  }
  return result;
}

/** Step 2 — composite score of an option given weights and its qaFit vector. Result ∈ [1, 5]. */
export function composite(weights: Weights, qaFit: number[]): number {
  return QA_ORDER.reduce((s, q, i) => s + (weights[q] / 100) * (qaFit[i] ?? 3), 0);
}

/** Rank a dimension's options from a weights vector, tie-broken by canonical config order. */
export function rankWith(weights: Weights, dim: DimensionId): RankedOption[] {
  return DIMENSIONS[dim].options
    .map((opt, index) => ({ name: opt.name, id: opt.id, score: composite(weights, opt.qaFit), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

/** Step 3 — rank a dimension's options from factor levels (no overrides). */
export function rank(levels: Levels, dim: DimensionId): RankedOption[] {
  return rankWith(deriveWeights(levels), dim);
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
export function sensitivity(levels: Levels, dim: DimensionId = 'D1', overrides: Overrides = {}): Flip[] {
  const winner = rankWith(effectiveWeights(levels, overrides), dim)[0].name;
  const flips: Flip[] = [];
  for (const f of FACTOR_ORDER) {
    for (const delta of [-1, 1] as const) {
      const next = (levels[f] ?? 0) + delta;
      if (next < 0 || next > 2) continue;
      const top = rankWith(effectiveWeights({ ...levels, [f]: next }, overrides), dim)[0].name;
      if (top !== winner) flips.push({ factor: f, to: next, newWinner: top });
    }
  }
  return flips;
}

export interface Leverage {
  factor: FactorId;
  /** Margin change (display points) if this factor drops one level; null at the floor. */
  down: number | null;
  /** Margin change (display points) if this factor rises one level; null at the ceiling. */
  up: number | null;
  /** Bar length: the larger of the two absolute swings. Sort key. */
  swing: number;
  /** True when either direction unseats the current winner (margin goes negative). */
  unseats: boolean;
}

/**
 * Step 5 — DECISION LEVERAGE: how much does each of the 14 answers actually matter?
 *
 * WHAT THIS ANSWERS THAT NOTHING ELSE DOES. `sensitivity()` above is binary — it lists the answers
 * that would flip the winner outright and says nothing about the rest. But "does not flip it" covers
 * two completely different situations: an answer that barely moves the result, and one that moves it
 * a great deal while still leaving the same option on top. Only the first is safe to be unsure about.
 * Leverage separates them, so someone can see where being wrong would actually cost them and where
 * it would not — which is the question people are really asking when they hesitate over an answer.
 *
 * WHAT IS MEASURED. Not the winner's own score, which moves for every option at once and so says
 * little; instead the MARGIN — the winner's lead over its closest rival. That is the quantity that
 * decides whether the recommendation stands. Each factor is nudged one level down and one level up
 * (skipping moves past the 0–2 ends) and the margin is re-derived from the same frozen model; the
 * bar is the larger of the two deviations. A negative margin means that nudge unseats the winner
 * outright, which is exactly the `sensitivity()` case — so the two functions agree by construction
 * rather than by coincidence, and `scoring.test.ts` asserts that agreement.
 *
 * Units are display points (0–100), matching the scores shown on screen, so a swing of 3 means the
 * lead moves by 3 of the same points the user is reading. Deterministic: no randomness, no clock.
 */
export function leverage(levels: Levels, dim: DimensionId = 'D1', overrides: Overrides = {}): Leverage[] {
  const pts = (raw: number) => (raw / 5) * 100;
  const marginOf = (lv: Levels, winnerName: string): number => {
    const ranked = rankWith(effectiveWeights(lv, overrides), dim);
    const win = ranked.find((o) => o.name === winnerName);
    if (!win) return 0;
    let bestOther = -Infinity;
    for (const o of ranked) if (o.name !== winnerName && o.score > bestOther) bestOther = o.score;
    return bestOther === -Infinity ? 0 : pts(win.score - bestOther);
  };

  const winner = rankWith(effectiveWeights(levels, overrides), dim)[0].name;
  const base = marginOf(levels, winner);

  return FACTOR_ORDER.map((f) => {
    const at = levels[f] ?? 0;
    const nudge = (to: number): number | null =>
      to < 0 || to > 2 ? null : marginOf({ ...levels, [f]: to }, winner) - base;
    const down = nudge(at - 1);
    const up = nudge(at + 1);
    return {
      factor: f,
      down,
      up,
      swing: Math.max(Math.abs(down ?? 0), Math.abs(up ?? 0)),
      unseats: (down !== null && base + down < 0) || (up !== null && base + up < 0),
    };
  }).sort((a, b) => b.swing - a.swing || FACTOR_ORDER.indexOf(a.factor) - FACTOR_ORDER.indexOf(b.factor));
}

/** A quality attribute the user weighted heavily, on which the winning option is nonetheless weak. */
export interface Compensation {
  qa: QaId;
  /** The user's weight for it, in percent. */
  weight: number;
  /** The winner's fit on it, 1–5. */
  fit: number;
}

/**
 * An attribute qualifies only if the user weighted it ABOVE AN EVEN SHARE — with 12 attributes that
 * is 8.33% — and the winner is at or below `COMP_WEAK_FIT` on it.
 *
 * The threshold is deliberately absolute, not "the top 3 by weight". A relative rule always finds
 * three attributes no matter how little the user cared about them, which produced the nonsense
 * "scores 2/5 on Scalability, which you weighted 0.0%" on a default scenario. Weight above the even
 * share means the user actively pushed this attribute up; below it, a weakness is just a trade-off,
 * not a compensation, and saying otherwise would be noise dressed as insight.
 */
const COMP_WEAK_FIT = 2;
const evenShare = () => 100 / QA_ORDER.length;

/**
 * Step 6 — COMPENSATION DISCLOSURE: where did the winner win *despite* being poor?
 *
 * THE PROPERTY THIS EXPOSES. `composite()` is an additive weighted sum, which is the standard
 * MAVT/SAW form: defensible, immune to rank reversal, and — the part that matters here — fully
 * COMPENSATORY. A severe weakness on one attribute can be entirely offset by strength elsewhere,
 * and the total says nothing about the trade having happened. Measured over 4,000 sampled scenarios
 * across all five dimensions (20,000 decisions), the winner is weak (fit ≤ 2) on an attribute the
 * user weighted above an even share in 28.2% of cases. So well over a quarter of recommendations
 * carry a weakness precisely where the user said they cared most, and say nothing about it.
 *
 * That rate is reported as measured, not tuned. An earlier "top 3 by weight" rule gave a tidier
 * 12.4%, but it fired on attributes weighted 0.0% — see the threshold note above — so the lower
 * number was measuring the wrong thing, not a quieter product.
 *
 * WHY DISCLOSE RATHER THAN RE-SPECIFY. The alternative is a non-compensatory aggregator — weighted
 * geometric mean, or a veto threshold. Switching to geometric changes the winner in 12.4% of the
 * same sample: a large, invisible shift in advice, requiring an ADR and re-freezing the model, in
 * exchange for a property most users would not know had changed. Additive is not wrong; it is
 * silently compensatory. This product's whole claim is that it shows its reasoning, so the honest
 * repair is to surface the compensation, not to hide it behind different arithmetic.
 *
 * Deterministic, and a pure read over the same frozen model — no scores move.
 */
export function compensations(weights: Weights, qaFit: number[]): Compensation[] {
  const floor = evenShare();
  return QA_ORDER.map((q, i) => ({ qa: q, weight: weights[q], fit: qaFit[i] ?? 3 }))
    .filter((c) => c.weight > floor && c.fit <= COMP_WEAK_FIT)
    .sort((a, b) => b.weight - a.weight || QA_ORDER.indexOf(a.qa) - QA_ORDER.indexOf(b.qa));
}

/**
 * Step 7 — THE NON-COMPENSATORY CHECK: does this pick survive if weakness cannot be offset?
 *
 * `composite()` adds weighted fits, so a 1 on one attribute is repaid one-for-one by a 5 on another
 * at the same weight. A weighted GEOMETRIC mean — exp(Σ wⱼ·ln φⱼ) — makes that repayment far more
 * expensive: the marginal value of extra strength falls as the weakness deepens.
 *
 * Precisely, and this is worth stating because it is easy to overclaim: geometric aggregation
 * REDUCES compensability, it does not remove it. With twelve attributes at equal weight, one fit of
 * 1 among eleven 5s still scores 4.37 — comfortably above a flat row of 3s. Strength does still buy
 * off weakness; it simply costs more. Only a veto or threshold rule (ELECTRE-style) is genuinely
 * non-compensatory, and that would need its own justification and its own ADR.
 *
 * Over the same 4,000-scenario sample the two aggregators disagree about the winner in 12.4% of
 * decisions, which is what makes it useful as a second opinion.
 *
 * This is used as a CHECK, never as the recommendation. Re-ranking the app on geometric aggregation
 * would silently move the advice in one decision in eight and require re-freezing the model; running
 * it alongside costs nothing and answers a question the additive score cannot: is the winner ahead
 * on merit across the board, or ahead because its weaknesses were paid for?
 *
 * Returns the geometric winner's name. Ties break on canonical config order, exactly as `rankWith`
 * does, so a tie can never make the two look like they disagree when they do not.
 */
export function nonCompensatoryWinner(weights: Weights, dim: DimensionId): string {
  return DIMENSIONS[dim].options
    .map((opt, index) => ({
      name: opt.name,
      index,
      // Fits are 1–5, so ln is always defined and finite; no clamping needed.
      score: Math.exp(QA_ORDER.reduce((s, q, i) => s + (weights[q] / 100) * Math.log(opt.qaFit[i] ?? 3), 0)),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0].name;
}
