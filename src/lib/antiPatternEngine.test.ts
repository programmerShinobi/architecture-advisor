import { describe, it, expect } from 'vitest';
import { detectAntiPatterns } from './antiPatternEngine';
import type { AntiPatternContext } from '../config/antiPatterns';
import { DEFAULT_LEVELS } from '../config/defaults';
import type { DimensionId, Levels } from '../types';

// A neutral, anti-pattern-free baseline combination (the startup-style default).
const baseSelections: Record<DimensionId, string> = {
  D1: 'monolith',
  D2: 'synchronous',
  D3: 'single-db',
  D4: 'layered',
  D5: 'spa',
};

function ctx(levels: Levels, sel: Partial<Record<DimensionId, string>> = {}): AntiPatternContext {
  return {
    levels,
    selections: { ...baseSelections, ...sel },
    migrationPathChosen: false,
  };
}

const ids = (c: AntiPatternContext) => detectAntiPatterns(c).map((r) => r.id);

describe('anti-pattern detection (Build Spec Section 10 / Model Data Sheet Section 5)', () => {
  it('defaults trigger nothing', () => {
    expect(detectAntiPatterns(ctx(DEFAULT_LEVELS))).toHaveLength(0);
  });

  it('AC-8 — Microservices + Single shared DB → distributed-monolith (danger)', () => {
    expect(ids(ctx(DEFAULT_LEVELS, { D1: 'microservices', D3: 'db-per-service' }))).not.toContain(
      'distributed-monolith',
    );
    expect(ids(ctx(DEFAULT_LEVELS, { D1: 'microservices', D3: 'single-db' }))).toContain(
      'distributed-monolith',
    );
  });

  it('AC-9 — team=0, devops=0 + Microservices → premature-microservices (danger)', () => {
    const L: Levels = { ...DEFAULT_LEVELS, team: 0, devops: 0 };
    expect(ids(ctx(L, { D1: 'microservices', D3: 'db-per-service' }))).toContain(
      'premature-microservices',
    );
  });

  it('sync-coupling-at-scale fires for Microservices + Synchronous + scale>=1', () => {
    const L: Levels = { ...DEFAULT_LEVELS, team: 2, devops: 2, scale: 2 };
    expect(ids(ctx(L, { D1: 'microservices', D2: 'synchronous', D3: 'db-per-service' }))).toContain(
      'sync-coupling-at-scale',
    );
  });

  it('over-engineered-mvp fires for lifespan=0, ttm=2 + Microservices', () => {
    const L: Levels = { ...DEFAULT_LEVELS, lifespan: 0, ttm: 2 };
    expect(ids(ctx(L, { D1: 'microservices', D3: 'db-per-service' }))).toContain('over-engineered-mvp');
  });

  it('consistency-conflict fires for consistency=2 + Event Sourcing', () => {
    const L: Levels = { ...DEFAULT_LEVELS, consistency: 2 };
    expect(ids(ctx(L, { D3: 'event-sourcing' }))).toContain('consistency-conflict');
  });

  it('legacy-without-plan fires for legacy=2 + Serverless and no migration path', () => {
    const L: Levels = { ...DEFAULT_LEVELS, legacy: 2 };
    const c = ctx(L, { D1: 'serverless' });
    expect(ids(c)).toContain('legacy-without-plan');
    expect(ids({ ...c, migrationPathChosen: true })).not.toContain('legacy-without-plan');
  });

  it('strict-security-shared-infra (info) fires for security=2 + Serverless + devops<=1', () => {
    const L: Levels = { ...DEFAULT_LEVELS, security: 2, devops: 1 };
    expect(ids(ctx(L, { D1: 'serverless' }))).toContain('strict-security-shared-infra');
  });
});
