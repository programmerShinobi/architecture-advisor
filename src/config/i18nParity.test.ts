import { describe, it, expect } from 'vitest';
import { INSIGHT_PLAYBOOKS } from './insightPlaybooks';
import { INSIGHT_REVIEWS } from './insightReviews';
import { INSIGHT_LIBRARY } from './insightLibrary';
import { LEARNING_PATHS } from './insightRoadmaps';
import { ACADEMY_QUIZZES } from './academyQuizzes';
import { LAB_EXPERIMENTS } from './labExperiments';
import type { Bilingual } from '../types';

// Full-bilingualisation guard (English-first reversed 2026-07-15): EVERY user-facing string in the
// six Insights datasets must ship both an English AND an Indonesian value. This fails the build the
// moment someone adds an entry (or a whole architecture) with a missing/empty translation — so the
// EN/ID toggle can never again fall back to English at "the deepest sub-level". The Markdown
// articles have their own gate (check-content.mjs requires id+en + the `<!-- lang:id -->` delimiter).

/** A value is Bilingual when it is an object with string en/id keys. */
function isBilingual(v: unknown): v is Bilingual {
  return typeof v === 'object' && v !== null && 'en' in v && 'id' in v && typeof (v as Bilingual).en === 'string' && typeof (v as Bilingual).id === 'string';
}

/** Recursively collect every Bilingual leaf, with a path for a readable failure message. */
function collect(node: unknown, path: string, out: { path: string; b: Bilingual }[]): void {
  if (isBilingual(node)) {
    out.push({ path, b: node });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collect(v, `${path}[${i}]`, out));
    return;
  }
  if (typeof node === 'object' && node !== null) {
    for (const [k, v] of Object.entries(node)) collect(v, path ? `${path}.${k}` : k, out);
  }
}

const DATASETS: Record<string, unknown> = {
  insightPlaybooks: INSIGHT_PLAYBOOKS,
  insightReviews: INSIGHT_REVIEWS,
  insightLibrary: INSIGHT_LIBRARY,
  insightRoadmaps: LEARNING_PATHS,
  academyQuizzes: ACADEMY_QUIZZES,
  labExperiments: LAB_EXPERIMENTS,
};

describe('Insights datasets are fully bilingual (EN + ID, no empty side)', () => {
  for (const [name, data] of Object.entries(DATASETS)) {
    it(`${name}: every Bilingual field has non-empty en and id`, () => {
      const found: { path: string; b: Bilingual }[] = [];
      collect(data, name, found);
      expect(found.length, `${name}: expected translatable content`).toBeGreaterThan(0);
      for (const { path, b } of found) {
        expect(b.en.trim().length, `${path}: empty en`).toBeGreaterThan(0);
        expect(b.id.trim().length, `${path}: empty id`).toBeGreaterThan(0);
      }
      // Sanity: the dataset must be genuinely translated overall, not a wholesale en→id copy. Short
      // technical terms (e.g. "Stateless", "React vs Vue", "HTTP/1.0") legitimately match across
      // languages, so we assert on the proportion rather than per-field.
      const identical = found.filter(({ b }) => b.en === b.id).length;
      expect(identical / found.length, `${name}: ${identical}/${found.length} fields untranslated`).toBeLessThan(0.2);
    });
  }
});
