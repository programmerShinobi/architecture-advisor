import { describe, it, expect } from 'vitest';
import { generateAdr } from './adr';
import { generateReport } from './report';
import { generateC4 } from './c4';
import { serializeScenario, parseScenario, type ScenarioState } from './scenarioIO';
import { buildShareUrl, hydrateFromUrl } from './urlState';
import { DEFAULT_LEVELS } from '../config/defaults';
import type { ExportInput } from './snapshot';

const input: ExportInput = {
  levels: { ...DEFAULT_LEVELS, team: 2, distribution: 2, scale: 2, devops: 2, ttm: 0 },
  overrides: {},
  selections: {
    D1: 'microservices',
    D2: 'event-driven',
    D3: 'db-per-service',
    D4: 'hexagonal',
    D5: 'micro-frontends',
  },
  lang: 'en',
};

describe('generateAdr (MADR)', () => {
  const md = generateAdr(input);
  it('has the core MADR sections', () => {
    expect(md).toContain('# Architecture Decision Record');
    expect(md).toContain('## Context and Problem Statement');
    expect(md).toContain('## Decision Drivers');
    expect(md).toContain('## Considered Options');
    expect(md).toContain('## Decision Outcome');
    expect(md).toContain('## Consequences');
  });
  it('names the chosen options', () => {
    expect(md).toContain('Microservices');
    expect(md).toContain('Database-per-service');
  });
});

describe('generateReport', () => {
  const md = generateReport(input);
  it('includes the major report sections', () => {
    expect(md).toContain('# Architecture Recommendation Report');
    expect(md).toContain('## Risk register');
    expect(md).toContain('## Suggested fitness functions');
    expect(md).toContain('## Anti-pattern checks');
  });
});

describe('generateC4', () => {
  it('reflects the chosen D1 style', () => {
    expect(generateC4('microservices')).toContain('API Gateway');
    expect(generateC4('monolith')).toContain('Monolith');
    expect(generateC4('layered')).toContain('Presentation tier');
  });
});

describe('scenario JSON round-trip', () => {
  const state: ScenarioState = {
    v: 1,
    mode: 'expert',
    lang: 'id',
    levels: { ...DEFAULT_LEVELS, security: 2 },
    selections: { D1: 'monolith' },
    overrides: { scalability: 40 },
  };
  it('serialize → parse is identity', () => {
    expect(parseScenario(serializeScenario(state))).toEqual(state);
  });
  it('rejects malformed / wrong-version input', () => {
    expect(parseScenario('not json')).toBeNull();
    expect(parseScenario(JSON.stringify({ v: 2 }))).toBeNull();
  });
});

describe('share URL round-trip (AC-14)', () => {
  it('buildShareUrl → hydrateFromUrl restores state into localStorage', () => {
    const state: ScenarioState = {
      v: 1,
      mode: 'expert',
      lang: 'en',
      levels: { ...DEFAULT_LEVELS, scale: 2 },
      selections: { D1: 'microservices' },
      overrides: {},
    };
    const url = buildShareUrl(state);
    window.location.hash = url.slice(url.indexOf('#'));
    expect(hydrateFromUrl()).toBe(true);
    expect(JSON.parse(localStorage.getItem('aa.mode') as string)).toBe('expert');
    expect(JSON.parse(localStorage.getItem('aa.levels') as string).scale).toBe(2);
    expect(JSON.parse(localStorage.getItem('aa.selections') as string).D1).toBe('microservices');
  });
});
