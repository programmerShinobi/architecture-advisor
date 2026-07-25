import { describe, it, expect } from 'vitest';
import { answerText } from './localAdvisorAdapter';
import { DEFAULT_LEVELS } from '../../config/defaults';
import heldout from './heldout.json';
import snapshot from './heldout-snapshot.json';
import type { ChatContext } from './types';

/**
 * HELD-OUT EVALUATION — the honesty check on chat.test.ts.
 *
 * chat.test.ts is a self-consistency suite: its queries were written by whoever wrote the keyword
 * vocabulary, so passing it proves the adapter agrees with itself. This file runs queries that came
 * from OUTSIDE that vocabulary (see heldout.json's `_README` for the sourcing rule) and is the only
 * evidence here that the thing is actually understood by someone who did not build it.
 *
 * It REPORTS a score but does not gate on one — below ~30 queries a single case swings the
 * percentage by more than 3 points, and any threshold could be met by adding easy queries. The one
 * hard assertion is non-regression against heldout-snapshot.json.
 */

const GATE_MIN_QUERIES = 30; // below this a percentage gate would be noise, so we only report

const ctx = (lang: 'en' | 'id'): ChatContext => ({
  levels: { ...DEFAULT_LEVELS },
  overrides: {},
  mode: 'guided',
  lang,
});

type Expect = { must?: string[]; mustNot?: string[] };
type Query = { id: string; query: string; lang: 'en' | 'id'; source: string; finding?: string; expect: Expect };

const QUERIES = heldout.queries as Query[];
const SNAP = snapshot.passing as Record<string, boolean>;

/** Run one held-out query and report which expectations it missed (empty = it passed). */
function evaluate(q: Query): string[] {
  const answer = answerText(q.query, ctx(q.lang));
  const misses: string[] = [];
  for (const m of q.expect.must ?? []) if (!answer.includes(m)) misses.push(`missing "${m}"`);
  for (const m of q.expect.mustNot ?? []) if (answer.includes(m)) misses.push(`should not contain "${m}"`);
  return misses;
}

describe('chat advisor — held-out queries (real users only; reported, not gated)', () => {
  const results = new Map<string, string[]>();
  for (const q of QUERIES) results.set(q.id, evaluate(q));

  const passing = QUERIES.filter((q) => results.get(q.id)!.length === 0);

  it('reports the held-out score without gating on it', () => {
    const pct = QUERIES.length ? Math.round((passing.length / QUERIES.length) * 100) : 0;
    const lines = [
      `held-out: ${passing.length}/${QUERIES.length} passing (${pct}%) — REPORT ONLY, not a gate`,
      ...QUERIES.map((q) => {
        const misses = results.get(q.id)!;
        return `  ${misses.length === 0 ? 'PASS' : 'FAIL'}  ${q.id}  [${q.lang}] ${JSON.stringify(q.query)}` +
          (misses.length ? `\n        ${misses.join('; ')}` : '');
      }),
    ];
    if (QUERIES.length < GATE_MIN_QUERIES) {
      lines.push(`  (${QUERIES.length}/${GATE_MIN_QUERIES} queries — collect real ones before any threshold is meaningful)`);
    }
    console.log(lines.join('\n'));
    expect(QUERIES.length).toBeGreaterThan(0); // the set must never be silently emptied
  });

  // The ONE hard rule (R-03): anything that once passed may never start failing. Intentional
  // changes must show up as a reviewable diff in heldout-snapshot.json, never as a silent drop.
  for (const q of QUERIES) {
    const wasPassing = SNAP[q.id] === true;
    it.runIf(wasPassing)(`non-regression: ${q.id} ${JSON.stringify(q.query)} still passes`, () => {
      expect(results.get(q.id)).toEqual([]);
    });
  }

  it('every snapshotted id still exists in the query set (no quiet deletions)', () => {
    const ids = new Set(QUERIES.map((q) => q.id));
    expect(Object.keys(SNAP).filter((id) => SNAP[id] && !ids.has(id))).toEqual([]);
  });

  it('every query records where it came from — the sourcing rule is what makes this set held out', () => {
    expect(QUERIES.filter((q) => !q.source?.trim()).map((q) => q.id)).toEqual([]);
    expect(new Set(QUERIES.map((q) => q.id)).size).toBe(QUERIES.length); // ids unique
  });
});
