import { describe, it, expect } from 'vitest';
import { wizardToLevels, wizardHasSignal, type WizardSelections } from './customWizard';
import { WIZARD_QUESTIONS } from '../config/customWizard';
import { FACTORS, FACTOR_ORDER } from '../config/factors';
import { rank } from './scoring';
import { DIMENSION_ORDER } from '../config/dimensions';

// The wizard→engine bridge is the ONE place the Custom Builder touches the model. These tests are
// the Zero-Mismatch guard (Blueprint Phase 3): every nudge must be a valid factor level, every
// output must be a complete valid Levels object, and the mapping must be deterministic.

describe('Custom Wizard schema is valid against the frozen model', () => {
  it('every option nudges only real factors, to valid levels (0–2)', () => {
    for (const q of WIZARD_QUESTIONS) {
      for (const opt of q.options) {
        for (const [f, v] of Object.entries(opt.levels)) {
          expect(FACTOR_ORDER, `${q.id}/${opt.id} → factor ${f}`).toContain(f);
          expect([0, 1, 2], `${q.id}/${opt.id}.${f} = ${v}`).toContain(v);
        }
        expect(opt.label.en.length, `${q.id}/${opt.id} label.en`).toBeGreaterThan(0);
        expect(opt.label.id.length, `${q.id}/${opt.id} label.id`).toBeGreaterThan(0);
      }
      expect(q.title.en.length && q.title.id.length, `${q.id} title`).toBeTruthy();
    }
  });

  it('exposes exactly the four universal variable groups', () => {
    const groups = new Set(WIZARD_QUESTIONS.map((q) => q.group));
    expect([...groups].sort()).toEqual(['constraints', 'domain', 'goal', 'nfr']);
  });
});

describe('wizardToLevels maps onto the frozen 14-factor model', () => {
  it('empty selections → a complete, valid, moderate baseline (never undefined; never crashes)', () => {
    const lv = wizardToLevels({});
    for (const f of FACTOR_ORDER) {
      expect(lv[f], f).toBe(1);
      expect(FACTORS[f].levels[lv[f] as number], `${f} level resolves`).toBeDefined();
    }
    // The baseline must still yield a real recommendation across all five dimensions.
    for (const d of DIMENSION_ORDER) expect(rank(lv, d)[0].id).toBeTruthy();
  });

  it('always returns all 14 factors within 0–2 for arbitrary answers', () => {
    const sel: WizardSelections = {
      goal: 'scale',
      'domain-ctx': 'iot',
      budget: 'flexible',
      team: 'many',
      timeline: 'hard',
      nfr: ['scalability', 'reliability', 'performance'],
    };
    const lv = wizardToLevels(sel);
    for (const f of FACTOR_ORDER) expect([0, 1, 2], `${f}=${lv[f]}`).toContain(lv[f]);
  });

  it('a fintech + correctness scenario anchors consistency & security high', () => {
    const lv = wizardToLevels({ goal: 'correctness', 'domain-ctx': 'fintech' });
    expect(lv.consistency).toBe(2);
    expect(lv.security).toBe(2);
    expect(lv.domain).toBe(2);
  });

  it('HARD constraints win over softer goal/NFR signals (deterministic priority)', () => {
    // Goal "mvp" pushes budget→0; an explicit "flexible" budget constraint must win.
    const lv = wizardToLevels({ goal: 'mvp', budget: 'flexible' });
    expect(lv.budget).toBe(2);
    // Timeline is an explicit constraint and wins over the NFR "speed" (ttm) signal.
    const lv2 = wizardToLevels({ nfr: ['speed'], timeline: 'relaxed' });
    expect(lv2.ttm).toBe(0);
  });

  it('is deterministic — same answers, same levels', () => {
    const sel: WizardSelections = { goal: 'realtime', 'domain-ctx': 'media', nfr: ['performance'] };
    expect(wizardToLevels(sel)).toEqual(wizardToLevels(sel));
  });

  it('wizardHasSignal gates on the primary goal', () => {
    expect(wizardHasSignal({})).toBe(false);
    expect(wizardHasSignal({ nfr: ['scalability'] })).toBe(false);
    expect(wizardHasSignal({ goal: 'mvp' })).toBe(true);
  });
});
