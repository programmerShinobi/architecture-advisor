import { describe, it, expect } from 'vitest';
import { executiveSummary } from './summary';
import { buildSnapshot } from './snapshot';
import { compensations, roundWeights } from './scoring';
import { DIMENSIONS } from '../config/dimensions';
import type { ExportInput } from './snapshot';

// A scenario chosen because the D1 pick is weak on two attributes its priorities rank highly.
const INPUT: ExportInput = {
  lang: 'en',
  levels: { team: 2, distribution: 2, ttm: 0, budget: 1, lifespan: 1, scale: 2, dataVolume: 2,
    async: 0, realtime: 0, domain: 0, consistency: 2, security: 0, legacy: 1, devops: 2 },
  overrides: {},
  selections: { D1: 'microservices', D2: 'async', D3: 'db-per-service', D4: 'hexagonal', D5: 'spa' },
};

describe('executiveSummary — the exported record must not drop the on-screen caveat', () => {
  /**
   * The Advisor shows a compensation disclosure when the pick is weak on a highly-ranked attribute.
   * The export is the artefact that gets circulated and archived, so if the caveat is missing here
   * it disappears at exactly the moment the decision becomes permanent — someone reads the record a
   * year later with no idea the pick leaned on offsetting.
   */
  it('records the compensation in both languages', () => {
    expect(executiveSummary(INPUT)).toMatch(/scores low on \*\*Cost efficiency\*\* \(2\/5, weighted \d+%\)/);
    expect(executiveSummary({ ...INPUT, lang: 'id' })).toMatch(/bernilai rendah pada \*\*Efisiensi biaya\*\* \(2\/5, berbobot \d+%\)/);
  });

  /** Weights must read identically wherever they appear; a record that disagrees with the screen
   *  is worse than one that stays silent. */
  it('quotes the same rounded weight the UI shows', () => {
    const s = buildSnapshot(INPUT);
    const chosen = DIMENSIONS.D1.options.find((o) => o.id === s.selections.D1)!;
    const first = compensations(s.weights, chosen.qaFit)[0];
    expect(executiveSummary(INPUT)).toContain(`weighted ${roundWeights(s.weights)[first.qa]}%`);
  });

  /**
   * Silence when there is nothing to disclose. The selection matters as much as the levels here:
   * an earlier draft of this test changed the levels to put 100% weight on time-to-market while
   * leaving Microservices selected — which scores 2/5 there — so the caveat fired, correctly, and
   * the test was wrong rather than the code. Monolith scores 5/5 on time-to-market, so with the
   * weight concentrated there it has no weakness worth recording.
   */
  it('stays silent when the pick is strong where it matters', () => {
    const quiet: ExportInput = {
      ...INPUT,
      levels: { ttm: 1, budget: 2 },
      selections: { ...INPUT.selections, D1: 'monolith' },
    };
    expect(executiveSummary(quiet)).not.toMatch(/Worth recording/);
  });

  /** The record caveats the DECISION, not the leaderboard: choosing against the recommendation must
   *  still surface that choice's weaknesses. */
  it('caveats the selected option even when it is not the top-ranked one', () => {
    const overridden: ExportInput = {
      ...INPUT,
      levels: { ttm: 1, budget: 2 },
      selections: { ...INPUT.selections, D1: 'microservices' },
    };
    expect(executiveSummary(overridden)).toMatch(/scores low on \*\*Time-to-market/);
  });
});
