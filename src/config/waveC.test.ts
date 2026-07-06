import { describe, it, expect } from 'vitest';
import { LEARNING_PATHS } from './insightRoadmaps';
import { ACADEMY_QUIZZES } from './academyQuizzes';
import { LAB_EXPERIMENTS } from './labExperiments';
import { DIMENSIONS } from './dimensions';
import { FACTORS } from './factors';
import { contentBySlug } from '../lib/content';
import type { FactorId } from '../types';

// Wave C datasets are curators/exercisers of existing content — they must never drift from the
// frozen model or the content index. Every deep-link target has to resolve.

const archExists = (dim: keyof typeof DIMENSIONS, optionId: string) =>
  DIMENSIONS[dim].options.some((o) => o.id === optionId);

describe('Roadmap learning paths (insightRoadmaps)', () => {
  it('every step resolves to a real architecture page, article, or the Advisor', () => {
    expect(LEARNING_PATHS.length).toBeGreaterThanOrEqual(5);
    for (const path of LEARNING_PATHS) {
      expect(path.steps.length, path.id).toBeGreaterThanOrEqual(4);
      for (const step of path.steps) {
        if (step.kind === 'arch') {
          expect(archExists(step.dim, step.optionId), `${path.id}: ${step.dim}:${step.optionId}`).toBe(true);
        } else if (step.kind === 'article') {
          expect(contentBySlug(step.slug), `${path.id}: article ${step.slug}`).toBeDefined();
        }
      }
    }
  });

  it('path ids are unique', () => {
    const ids = LEARNING_PATHS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Academy quizzes (academyQuizzes)', () => {
  it('every question has a valid answer index and a resolvable review link', () => {
    for (const mod of ACADEMY_QUIZZES) {
      expect(mod.questions.length, mod.id).toBeGreaterThanOrEqual(3);
      for (const q of mod.questions) {
        expect(q.choices.length, q.q).toBeGreaterThanOrEqual(2);
        expect(q.answer, q.q).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.q).toBeLessThan(q.choices.length);
        if (q.review.kind === 'arch') {
          expect(archExists(q.review.dim, q.review.optionId), `${mod.id}: ${q.q}`).toBe(true);
        } else {
          expect(contentBySlug(q.review.slug), `${mod.id}: article ${q.review.slug}`).toBeDefined();
        }
      }
    }
  });

  it('module ids are unique', () => {
    const ids = ACADEMY_QUIZZES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Lab experiments (labExperiments)', () => {
  it('every experiment sets ALL 14 model factors to a valid level', () => {
    const allFactorIds = Object.keys(FACTORS) as FactorId[];
    for (const exp of LAB_EXPERIMENTS) {
      for (const fid of allFactorIds) {
        const lvl = exp.levels[fid];
        expect(lvl, `${exp.id}: missing factor ${fid}`).toBeDefined();
        expect(Number.isInteger(lvl), `${exp.id}: ${fid}`).toBe(true);
        expect(FACTORS[fid].levels[lvl as number], `${exp.id}: ${fid} level ${lvl} out of range`).toBeDefined();
      }
      // No unknown factors either (a typo would silently do nothing in the Advisor).
      for (const key of Object.keys(exp.levels)) {
        expect(allFactorIds, `${exp.id}: unknown factor "${key}"`).toContain(key);
      }
      expect(exp.watch.length, exp.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('experiment ids are unique', () => {
    const ids = LAB_EXPERIMENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
