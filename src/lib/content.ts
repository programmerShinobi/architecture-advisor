import { parseFrontmatter } from './frontmatter';
import type {
  ContentDoc,
  ContentSource,
  RelatedAdvisor,
  SectionId,
} from '../config/contentSchema';
import type { DimensionId } from '../types';

// Pure content index for the "Learn" layer. Articles are Markdown files under /content, imported at
// BUILD time via import.meta.glob (statically analyzable, no runtime fetch — offline-capable and
// SEO-friendly if we ever prerender). Frontmatter is validated strictly by the build guard
// (scripts/check-content.mjs); here we read already-valid files. Unit-tested in content.test.ts.

const asStr = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const asArr = (v: unknown): string[] => (Array.isArray(v) ? (v as unknown[]).map((x) => String(x)) : []);

function toSources(v: unknown): ContentSource[] {
  if (!Array.isArray(v)) return [];
  return (v as Record<string, unknown>[]).map((s) => ({
    label: asStr(s.label),
    venue: asStr(s.venue),
    year: Number(s.year) || 0,
    url: asStr(s.url),
  }));
}

function toRelated(v: unknown): RelatedAdvisor {
  const o = (v ?? {}) as Record<string, unknown>;
  return {
    dimensions: asArr(o.dimensions) as DimensionId[],
    options: asArr(o.options),
  };
}

function toDoc(raw: string): ContentDoc {
  const { data, body } = parseFrontmatter(raw);
  return {
    title_id: asStr(data.title_id),
    title_en: asStr(data.title_en),
    slug: asStr(data.slug),
    section: asStr(data.section) as SectionId,
    audience: asArr(data.audience) as ContentDoc['audience'],
    summary_tldr_id: asStr(data.summary_tldr_id),
    summary_tldr_en: asStr(data.summary_tldr_en),
    evidence_strength: asStr(data.evidence_strength) as ContentDoc['evidence_strength'],
    last_reviewed: asStr(data.last_reviewed),
    review_due: asStr(data.review_due),
    translation_status: asStr(data.translation_status) as ContentDoc['translation_status'],
    related_advisor: toRelated(data.related_advisor),
    sources: toSources(data.sources),
    status: (asStr(data.status) as ContentDoc['status']) || 'draft',
    author: asStr(data.author),
    body,
  };
}

// Eager glob: every article is bundled with the content chunk (the Learn view is lazy-loaded).
const MODULES = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ALL: ContentDoc[] = Object.values(MODULES)
  .map(toDoc)
  .filter((d) => d.status === 'published')
  .sort((a, b) => a.slug.localeCompare(b.slug));

/** All published articles. */
export function allContent(): ContentDoc[] {
  return ALL;
}

/** Published articles in a section. */
export function contentBySection(section: SectionId): ContentDoc[] {
  return ALL.filter((d) => d.section === section);
}

/** A single article by slug (undefined if not found / not published). */
export function contentBySlug(slug: string): ContentDoc | undefined {
  return ALL.find((d) => d.slug === slug);
}

/** Title in the active language (falls back to the other language if one is empty). */
export function docTitle(doc: ContentDoc, lang: 'en' | 'id'): string {
  return lang === 'id' ? doc.title_id || doc.title_en : doc.title_en || doc.title_id;
}

/** TL;DR in the active language. */
export function docTldr(doc: ContentDoc, lang: 'en' | 'id'): string {
  return lang === 'id' ? doc.summary_tldr_id || doc.summary_tldr_en : doc.summary_tldr_en || doc.summary_tldr_id;
}

/** True when the article's 12-month review window has lapsed (for the "needs review" badge). */
export function isReviewDue(doc: ContentDoc, now = new Date()): boolean {
  const due = new Date(doc.review_due);
  return !Number.isNaN(due.getTime()) && due.getTime() < now.getTime();
}
