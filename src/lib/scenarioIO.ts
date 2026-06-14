import type { DimensionId, Lang, Levels } from '../types';
import type { Overrides } from './scoring';

// The full, portable state of a decision — shared via URL and via JSON import/export
// (Build Spec Phase 5: share-via-URL + basic custom-config JSON). Versioned for forward safety.
export interface ScenarioState {
  v: 1;
  mode: 'guided' | 'expert';
  lang: Lang;
  levels: Levels;
  selections: Partial<Record<DimensionId, string>>;
  overrides: Overrides;
}

export function serializeScenario(state: ScenarioState): string {
  return JSON.stringify(state, null, 2);
}

const isLevelMap = (o: unknown): o is Record<string, number> =>
  !!o && typeof o === 'object' && Object.values(o).every((v) => typeof v === 'number');

/** Parse + validate a scenario JSON string. Returns null on anything malformed. */
export function parseScenario(json: string): ScenarioState | null {
  try {
    const o = JSON.parse(json) as Partial<ScenarioState>;
    if (o.v !== 1) return null;
    if (o.mode !== 'guided' && o.mode !== 'expert') return null;
    if (o.lang !== 'en' && o.lang !== 'id') return null;
    if (!isLevelMap(o.levels) || !isLevelMap(o.overrides ?? {})) return null;
    if (!o.selections || typeof o.selections !== 'object') return null;
    return {
      v: 1,
      mode: o.mode,
      lang: o.lang,
      levels: o.levels as Levels,
      selections: o.selections as Partial<Record<DimensionId, string>>,
      overrides: (o.overrides ?? {}) as Overrides,
    };
  } catch {
    return null;
  }
}
