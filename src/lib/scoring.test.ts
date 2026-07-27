import { describe, it, expect } from 'vitest';
import {
  deriveWeights,
  composite,
  rank,
  rankWith,
  effectiveWeights,
  isCloseCall,
  sensitivity,
  contributions,
  leverage,
  compensations,
} from './scoring';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import { FACTOR_ORDER } from '../config/factors';
import { DEFAULT_LEVELS } from '../config/defaults';
import { PRESETS } from '../config/presets';
import { QA_ORDER } from '../config/qualityAttributes';
import type { DimensionId, Levels } from '../types';

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

describe('requirement scenarios (build spec §14 AC-6, AC-7)', () => {
  it('AC-6 — async=2, realtime=2 → D2 favors Event-driven/Streaming; performance leads', () => {
    const L: Levels = { ...DEFAULT_LEVELS, async: 2, realtime: 2 };
    expect(['Event-driven (pub/sub)', 'Streaming']).toContain(rank(L, 'D2')[0].name);
    const w = deriveWeights(L);
    const topQA = QA_ORDER.reduce((a, b) => (w[b] > w[a] ? b : a), QA_ORDER[0]);
    expect(topQA).toBe('performance');
    expect(w.scalability).toBeGreaterThan(0); // scalability is elevated (just not the top weight)
  });

  it('AC-7 — consistency=2 → dataConsistency leads; D3 top = Single shared database', () => {
    const L: Levels = { ...DEFAULT_LEVELS, consistency: 2 };
    const w = deriveWeights(L);
    const top = QA_ORDER.reduce((a, b) => (w[b] > w[a] ? b : a));
    expect(top).toBe('dataConsistency');
    expect(rank(L, 'D3')[0].name).toBe('Single shared database');
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

describe('effectiveWeights — expert override & lock (scoring-algorithm.md Section 3.4)', () => {
  const L: Levels = { ...DEFAULT_LEVELS, team: 2, distribution: 2, scale: 2, devops: 2, ttm: 0 };

  it('no overrides → equals derived weights', () => {
    expect(effectiveWeights(L)).toEqual(deriveWeights(L));
  });

  it('locking scalability at 50 keeps the sum at 100 and Microservices wins', () => {
    const w = effectiveWeights(L, { scalability: 50 });
    expect(approx(QA_ORDER.reduce((a, q) => a + w[q], 0), 100)).toBe(true);
    expect(w.scalability).toBe(50);
    expect(rankWith(w, 'D1')[0].name).toBe('Microservices');
  });

  it('locked values summing over 100 are rescaled to 100; unlocked get 0', () => {
    const w = effectiveWeights(L, { performance: 80, security: 80 });
    expect(approx(QA_ORDER.reduce((a, q) => a + w[q], 0), 100)).toBe(true);
    expect(approx(w.performance, 50)).toBe(true);
    expect(approx(w.scalability, 0)).toBe(true);
  });
});

describe('preset regression — all 25 targets hold (SRS Section 5.3 / ADR-0002)', () => {
  const TARGETS: Record<string, string[][]> = {
    'startup-mvp': [['Monolith'], ['Synchronous (request/response)'], ['Single shared database'], ['Layered'], ['Single-page app (SPA)']],
    regulated: [['Modular Monolith'], ['Synchronous (request/response)'], ['Single shared database'], ['Hexagonal (Ports & Adapters)', 'Clean Architecture'], ['Single-page app (SPA)', 'Server-rendered (SSR/SSG)']],
    'high-traffic-ecommerce': [['Microservices'], ['Event-driven (pub/sub)'], ['Database-per-service'], ['Hexagonal (Ports & Adapters)', 'Clean Architecture'], ['Micro-frontends']],
    'iot-streaming': [['Microservices', 'Serverless (FaaS)'], ['Streaming'], ['CQRS', 'Event Sourcing'], ['Hexagonal (Ports & Adapters)', 'Clean Architecture'], ['Single-page app (SPA)', 'Server-rendered (SSR/SSG)']],
    'internal-tool': [['Modular Monolith'], ['Synchronous (request/response)'], ['Single shared database'], ['Layered'], ['Single-page app (SPA)']],
  };
  // Only the CALIBRATED five carry SRS Section 5.3 targets; helper presets (Fase 2) are
  // outcome-pinned separately in src/config/presets.test.ts.
  for (const preset of PRESETS.filter((p) => p.calibrated)) {
    it(`${preset.id} hits its target in every dimension`, () => {
      DIMENSION_ORDER.forEach((dim: DimensionId, i) => {
        const top = rank(preset.levels, dim)[0].name;
        expect(TARGETS[preset.id][i]).toContain(top);
      });
    });
  }
});

describe('composite() defaults unlisted qaFit entries to 3', () => {
  it('treats a short vector neutrally', () => {
    const w = deriveWeights(DEFAULT_LEVELS);
    // timeToMarket weight is 100% at defaults; a vector with ttm at index 11 missing → 3
    expect(approx(composite(w, [4, 3, 3, 4, 3, 2, 3, 3, 5, 3, 4]), 3)).toBe(true);
  });
});

describe('leverage — decision leverage per factor', () => {
  // A scenario with a mix of levels, so floor/ceiling clamping is genuinely exercised.
  const levels = { team: 0, distribution: 1, ttm: 2, budget: 0, lifespan: 1, scale: 2,
    dataVolume: 1, async: 2, realtime: 2, domain: 0, consistency: 2, security: 2, legacy: 0, devops: 2 };

  it('covers all 14 factors exactly once', () => {
    const rows = leverage(levels);
    expect(rows).toHaveLength(FACTOR_ORDER.length);
    expect(new Set(rows.map((r) => r.factor)).size).toBe(FACTOR_ORDER.length);
  });

  it('is deterministic — same input, identical output', () => {
    expect(leverage(levels)).toEqual(leverage(levels));
  });

  it('is sorted by swing, largest first', () => {
    const swings = leverage(levels).map((r) => r.swing);
    expect([...swings].sort((a, b) => b - a)).toEqual(swings);
  });

  it('clamps at the ends of the 0–2 scale', () => {
    const rows = leverage(levels);
    // team is at 0 → cannot go down; scale is at 2 → cannot go up.
    expect(rows.find((r) => r.factor === 'team')!.down).toBeNull();
    expect(rows.find((r) => r.factor === 'scale')!.up).toBeNull();
    // ...and the reachable direction is always populated.
    expect(rows.find((r) => r.factor === 'team')!.up).not.toBeNull();
    expect(rows.find((r) => r.factor === 'scale')!.down).not.toBeNull();
  });

  // The claim made in leverage()'s doc comment: `unseats` and `sensitivity()` describe the same
  // event, so they must agree on every dimension and every scenario — not merely look similar.
  it('agrees with sensitivity() about which factors unseat the winner', () => {
    for (const dim of DIMENSION_ORDER) {
      const flipped = new Set(sensitivity(levels, dim).map((f) => f.factor));
      for (const row of leverage(levels, dim)) {
        expect(row.unseats, `${dim}/${row.factor}`).toBe(flipped.has(row.factor));
      }
    }
  });

  it('a factor that unseats the winner always outranks one that barely moves the margin', () => {
    const rows = leverage(levels);
    const unseating = rows.filter((r) => r.unseats);
    const inert = rows.filter((r) => r.swing === 0);
    for (const u of unseating) for (const i of inert) expect(u.swing).toBeGreaterThan(i.swing);
  });
});

describe('compensations — where the winner won despite being weak', () => {
  const weights = (over: Partial<Record<string, number>> = {}) => {
    const base = Object.fromEntries(QA_ORDER.map((q) => [q, 100 / QA_ORDER.length]));
    return { ...base, ...over } as never;
  };

  it('flags a heavily-weighted attribute the option is weak on', () => {
    const w = weights({ costEfficiency: 40 });
    const fit = QA_ORDER.map((q) => (q === 'costEfficiency' ? 2 : 5));
    const out = compensations(w, fit);
    expect(out.map((c) => c.qa)).toEqual(['costEfficiency']);
    expect(out[0].fit).toBe(2);
  });

  it('stays silent when the option is strong where it matters', () => {
    const w = weights({ costEfficiency: 40 });
    expect(compensations(w, QA_ORDER.map(() => 5))).toEqual([]);
  });

  /** A weakness the user does not care about is not a compensation — it is just a trade-off. */
  it('ignores a weakness on an attribute weighted below an even share', () => {
    const w = weights({ costEfficiency: 40, testability: 1 });
    const fit = QA_ORDER.map((q) => (q === 'testability' ? 1 : 5));
    expect(compensations(w, fit)).toEqual([]);
  });

  /**
   * Regression: the first rule took the top 3 by weight unconditionally, so on a sparse scenario it
   * announced "scores 2/5 on Scalability, which you weighted 0.0%" — advice about something the
   * user had explicitly not asked for. Nothing below an even share may ever trigger this.
   */
  it('never fires on an attribute weighted at or near zero', () => {
    const w = weights({ costEfficiency: 99 });
    QA_ORDER.forEach((q) => { if (q !== 'costEfficiency') (w as Record<string, number>)[q] = 0.05; });
    const fit = QA_ORDER.map((q) => (q === 'costEfficiency' ? 5 : 1)); // everything else weak, but unweighted
    expect(compensations(w, fit)).toEqual([]);
  });

  it('orders several disclosures by weight, heaviest first', () => {
    const w = weights({ costEfficiency: 30, scalability: 25, security: 20 });
    const fit = QA_ORDER.map(() => 1);
    expect(compensations(w, fit).map((c) => c.qa)).toEqual(['costEfficiency', 'scalability', 'security']);
  });

  it('is deterministic', () => {
    const w = weights({ costEfficiency: 40 });
    const fit = QA_ORDER.map((q) => (q === 'costEfficiency' ? 2 : 5));
    expect(compensations(w, fit)).toEqual(compensations(w, fit));
  });
});
