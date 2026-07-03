import { describe, it, expect } from 'vitest';
import { allContent, contentBySection, contentBySlug, isReviewDue } from './content';
import { REQUIRED_FRONTMATTER_KEYS, SECTION_IDS } from '../config/contentSchema';
import { DIMENSIONS } from '../config/dimensions';

// The content index loads real /content articles at build time and every article must be
// well-formed and bound to the frozen model (mirrors scripts/check-content.mjs at runtime).
describe('content index', () => {
  const docs = allContent();
  const optionIds = new Set(Object.values(DIMENSIONS).flatMap((d) => d.options.map((o) => o.id)));

  it('loads at least one published article', () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it('every article has all required fields populated', () => {
    for (const d of docs) {
      for (const k of REQUIRED_FRONTMATTER_KEYS) {
        expect(d[k], `${d.slug} missing ${k}`).toBeTruthy();
      }
      expect(SECTION_IDS).toContain(d.section);
    }
  });

  it('every related_advisor id resolves to the frozen model', () => {
    for (const d of docs) {
      for (const dim of d.related_advisor.dimensions) expect(DIMENSIONS[dim]).toBeDefined();
      for (const opt of d.related_advisor.options) expect(optionIds.has(opt), `${d.slug}: ${opt}`).toBe(true);
    }
  });

  it('filters by section and finds by slug', () => {
    const first = docs[0];
    expect(contentBySection(first.section).some((d) => d.slug === first.slug)).toBe(true);
    expect(contentBySlug(first.slug)?.slug).toBe(first.slug);
    expect(contentBySlug('does-not-exist')).toBeUndefined();
  });

  it('flags a lapsed review window', () => {
    const doc = docs[0];
    expect(isReviewDue(doc, new Date('2000-01-01'))).toBe(false);
    expect(isReviewDue(doc, new Date('2999-01-01'))).toBe(true);
  });
});
