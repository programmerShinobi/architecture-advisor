import type { FactorId, QaId } from '../types';

// Factor → QA influence matrix (step 1 of scoring) — 🔒 Fixed.
// Contribution of a factor to a QA weight = influence × level, EXCEPT `budget`, which is
// inverted in the engine: use (2 − budgetLevel). Everything not listed here is 0.
// Source of truth: docs/03-blueprint/model-data-sheet.md Section 3 / Build Spec Section 5.

export const INFLUENCE: Record<FactorId, Partial<Record<QaId, number>>> = {
  team: { deployability: 2, maintainability: 1 },
  distribution: { deployability: 2, maintainability: 1 },
  ttm: { timeToMarket: 3, maintainability: -1 },
  budget: { costEfficiency: 3 },
  lifespan: { maintainability: 2, testability: 1, observability: 1 },
  scale: { scalability: 3, performance: 1, availability: 1, costEfficiency: 1 },
  dataVolume: { scalability: 2, performance: 1, costEfficiency: 1 },
  async: { scalability: 1, availability: 1, performance: 1 },
  realtime: { performance: 3, availability: 1 },
  domain: { maintainability: 2, testability: 1 },
  consistency: { dataConsistency: 3 },
  security: { security: 3 },
  legacy: { interoperability: 3, maintainability: 1 },
  devops: { deployability: 1, observability: 1 },
};
