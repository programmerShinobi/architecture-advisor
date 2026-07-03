import type { DimensionId } from '../types';

// The frontmatter contract for content articles (the "Learn" layer around the Advisor). This file
// is the SINGLE source for the field names, enums, and the parsed-document shape. The build-time
// guard (scripts/check-content.mjs) independently re-implements these rules and cross-checks every
// article — mirroring the repo's "two independent sources, cross-checked" discipline (like
// verify-model.mjs vs the config). No zod / heavy deps: validation is dependency-free, matching the
// existing model guards. See docs/03-blueprint/architecture-reader.md and rencana-konten-*.md.

export const SECTION_IDS = [
  'catalog',
  'playbook',
  'review',
  'library',
  'roadmap',
  'academy',
  'lab',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const EVIDENCE_STRENGTHS = ['strong', 'moderate', 'emerging'] as const;
export type EvidenceStrength = (typeof EVIDENCE_STRENGTHS)[number];

export const AUDIENCES = ['awam', 'expert'] as const;
export type Audience = (typeof AUDIENCES)[number];

export const TRANSLATION_STATUSES = ['id', 'en', 'id+en'] as const;
export type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

export interface ContentSource {
  label: string;
  venue: string;
  year: number;
  url: string;
}

export interface RelatedAdvisor {
  /** Dimension ids the article maps to — must exist in the frozen model. */
  dimensions: DimensionId[];
  /** Option ids the article maps to — must exist in the frozen model. */
  options: string[];
}

/** Validated frontmatter fields. */
export interface ContentFrontmatter {
  title_id: string;
  title_en: string;
  slug: string;
  section: SectionId;
  audience: Audience[];
  summary_tldr_id: string;
  summary_tldr_en: string;
  evidence_strength: EvidenceStrength;
  last_reviewed: string; // YYYY-MM-DD
  review_due: string; // = last_reviewed + 12 months
  translation_status: TranslationStatus;
  related_advisor: RelatedAdvisor;
  sources: ContentSource[];
  status: 'draft' | 'published';
  author: string;
}

/** A parsed article: validated frontmatter + the raw Markdown body. */
export interface ContentDoc extends ContentFrontmatter {
  /** Markdown body after the frontmatter block. */
  body: string;
}

/** Required frontmatter keys — the app type and the guard both reference this list. */
export const REQUIRED_FRONTMATTER_KEYS: (keyof ContentFrontmatter)[] = [
  'title_id',
  'title_en',
  'slug',
  'section',
  'audience',
  'summary_tldr_id',
  'summary_tldr_en',
  'evidence_strength',
  'last_reviewed',
  'review_due',
  'translation_status',
  'related_advisor',
  'sources',
  'status',
  'author',
];
