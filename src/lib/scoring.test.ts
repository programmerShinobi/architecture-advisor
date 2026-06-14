import { describe, it, expect } from 'vitest';
import { deriveWeights, composite, rank, isCloseCall, sensitivity, contributions } from './scoring';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import { DEFAULT_LEVELS } from '../config/defaults';
import { QA_ORDER } from '../config/qualityAttributes';
import type { Levels } from '../types';

const approx = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

// These mirror scripts/verify-model.mjs fixtures A–C (the executable source of truth) and the
// invariants pinned in docs/03-blueprint/scoring-algorithm.md.

describe('Fixture A — defaults (all 0; ttm=1, budget=2)', () => {
  const w = deriveWeights(DEFAULT_LEVELS);
  const r = rank(DEFAULT_LEVELS, 'D1');
  it('timeToMarket weight = 100%', () => expect(approx(w.timeToMarket, 100)).toBe(true));
  it('D1 top = Monolith @ 5.0', () => {
    expect(r[0].name).toBe('Monolith');
    expect(approx(r[0].score, 5)).toBe(true);
  });
  it('no close call', () => expect(isCloseCall(r)).toBe(false));
  it('sensitivity finds 5 single-step flips', () => expect(sensitivity(DEFAULT_LEVELS)).toHaveLength(5));
});

describe('Fixture B — AC-3 (team2 dist2 scale2 devops2 ttm0)', () => {
  const L: Levels = { ...DEFAULT_LEVELS, team: 2, distribution: 2, scale: 2, devops: 2, ttm: 0 };
  const r = rank(L, 'D1');
  it('D1 top = Microservices @ 30/7', () => {
    expect(r[0].name).toBe('Microservices');
    expect(approx(r[0].score, 120 / 28)).toBe(true);
  });
  it('close call vs Serverless is flagged', () => expect(isCloseCall(r)).toBe(true));
});

describe('Fixture C — AC-5 (domain2 team0 ttm0)', () => {
  const L: Levels = { ...DEFAULT_LEVELS, domain: 2, ttm: 0 };
  it('D1 top = Modular Monolith', () => expect(rank(L, 'D1')[0].name).toBe('Modular Monolith'));
  it('D4 = Hexagonal & Clean @ 5.0', () => {
    const d4 = rank(L, 'D4');
    expect(d4[0].id).toBe('hexagonal');
    expect(d4[1].id).toBe('clean');
    expect(approx(d4[0].score, 5)).toBe(true);
  });
});

describe('Equal-weight fallback (all signals zero: ttm=0, budget=2)', () => {
  it('D1 top = Modular Monolith @ 3.75', () => {
    const r = rank({ ...DEFAULT_LEVELS, ttm: 0 }, 'D1');
    expect(r[0].name).toBe('Modular Monolith');
    expect(approx(r[0].score, 45 / 12)).toBe(true);
  });
});

describe('Invariants — 500 seeded random inputs', () => {
  it('weights sum to 100; composites in [1,5]; ranking deterministic', () => {
    let seed = 42;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
    for (let t = 0; t < 500; t++) {
      const L: Levels = {};
      for (const f of [
        'team', 'distribution', 'ttm', 'budget', 'lifespan', 'scale', 'dataVolume',
        'async', 'realtime', 'domain', 'consistency', 'security', 'legacy', 'devops',
      ] as const) {
        L[f] = Math.floor(rnd() * 3);
      }
      const w = deriveWeights(L);
      expect(approx(QA_ORDER.reduce((a, q) => a + w[q], 0), 100)).toBe(true);
      for (const d of DIMENSION_ORDER) {
        for (const o of rank(L, d)) {
          expect(o.score).toBeGreaterThanOrEqual(1 - 1e-9);
          expect(o.score).toBeLessThanOrEqual(5 + 1e-9);
        }
      }
      expect(JSON.stringify(rank(L, 'D1'))).toBe(JSON.stringify(rank(L, 'D1')));
    }
  });
});

describe('contributions reconcile to the composite (FR-REC-4)', () => {
  it('sum of weighted points equals composite for every D1 option', () => {
    const L: Levels = { ...DEFAULT_LEVELS, team: 2, scale: 2, security: 2 };
    const w = deriveWeights(L);
    for (const opt of DIMENSIONS.D1.options) {
      const sum = contributions(w, opt.qaFit).reduce((a, c) => a + c.points, 0);
      expect(approx(sum, composite(w, opt.qaFit))).toBe(true);
    }
  });
});

describe('composite() defaults unlisted qaFit entries to 3', () => {
  it('treats a short vector neutrally', () => {
    const w = deriveWeights(DEFAULT_LEVELS);
    // timeToMarket weight is 100% at defaults; a vector with ttm at index 11 missing → 3
    expect(approx(composite(w, [4, 3, 3, 4, 3, 2, 3, 3, 5, 3, 4]), 3)).toBe(true);
  });
});
