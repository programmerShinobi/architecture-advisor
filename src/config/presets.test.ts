import { describe, it, expect } from 'vitest';
import { PRESETS } from './presets';
import { FACTOR_ORDER } from './factors';
import { rank } from '../lib/scoring';
import { DIMENSION_ORDER } from './dimensions';
import type { DimensionId } from '../types';

// Fase 2 (DECISIONS.md): presets grew 5 → 10. The five ADR-0002 presets are guard-pinned
// elsewhere (verify-model / cross-check-docs / check-app-config); THIS test covers the helper
// scenarios: structural validity plus a pinned engine outcome per dimension, so any future
// change that silently reorders a helper's recommendation fails the build (no long-term drift).

const CALIBRATED = ['startup-mvp', 'regulated', 'high-traffic-ecommerce', 'iot-streaming', 'internal-tool'];

// Engine-true top pick per dimension for each helper, computed from the frozen model.
const PINNED_TOPS: Record<string, Record<DimensionId, string>> = {
  'saas-b2b': { D1: 'modular-monolith', D2: 'synchronous', D3: 'db-per-service', D4: 'hexagonal', D5: 'spa' },
  'mobile-consumer': { D1: 'serverless', D2: 'streaming', D3: 'cqrs', D4: 'layered', D5: 'ssr' },
  'data-platform': { D1: 'microservices', D2: 'streaming', D3: 'db-per-service', D4: 'hexagonal', D5: 'micro-frontends' },
  'legacy-modernization': { D1: 'microservices', D2: 'synchronous', D3: 'db-per-service', D4: 'hexagonal', D5: 'spa' },
  'realtime-collab': { D1: 'modular-monolith', D2: 'streaming', D3: 'cqrs', D4: 'hexagonal', D5: 'ssr' },
};

describe('presets (calibrated five + helper scenarios)', () => {
  it('ships exactly the five calibrated presets first, then flagged helpers', () => {
    expect(PRESETS.slice(0, 5).map((p) => p.id)).toEqual(CALIBRATED);
    expect(PRESETS.slice(0, 5).every((p) => p.calibrated)).toBe(true);
    expect(PRESETS.slice(5).every((p) => !p.calibrated)).toBe(true);
    expect(PRESETS.length).toBe(10);
  });

  it('every preset sets all 14 factors to a valid level (0–2) and is bilingual', () => {
    for (const p of PRESETS) {
      for (const f of FACTOR_ORDER) {
        expect([0, 1, 2], `${p.id}.${f}`).toContain(p.levels[f]);
      }
      expect(p.label.en.length, `${p.id} label.en`).toBeGreaterThan(0);
      expect(p.label.id.length, `${p.id} label.id`).toBeGreaterThan(0);
      expect(p.description.en.length, `${p.id} desc.en`).toBeGreaterThan(0);
      expect(p.description.id.length, `${p.id} desc.id`).toBeGreaterThan(0);
    }
  });

  it('helper scenarios keep their pinned engine outcome per dimension (drift guard)', () => {
    for (const p of PRESETS.filter((x) => !x.calibrated)) {
      for (const d of DIMENSION_ORDER) {
        expect(rank(p.levels, d)[0].id, `${p.id} ${d}`).toBe(PINNED_TOPS[p.id][d]);
      }
    }
  });
});
