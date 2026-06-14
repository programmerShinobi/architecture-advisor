import type { Levels } from '../types';

// Default factor levels: all 0 EXCEPT ttm=1 and budget=2.
// budget=2 is the "no-signal" level of the inverted budget factor — see scoring engine.
// Source: docs/03-blueprint/model-data-sheet.md Section 2 / Build Spec Phase 1.
export const DEFAULT_LEVELS: Levels = { ttm: 1, budget: 2 };
