// Shared domain types. The model values themselves live in config/ (one file per concern),
// mirroring the canonical docs/03-blueprint/model-data-sheet.md.

export type Lang = 'en' | 'id';

export interface Bilingual {
  en: string;
  id: string;
}

/** The 12 quality attributes, in canonical qaFit-vector order (Model Data Sheet Section 1). */
export type QaId =
  | 'performance'
  | 'scalability'
  | 'availability'
  | 'security'
  | 'maintainability'
  | 'deployability'
  | 'testability'
  | 'observability'
  | 'dataConsistency'
  | 'interoperability'
  | 'costEfficiency'
  | 'timeToMarket';

/** The 14 project factors (Model Data Sheet Section 2). */
export type FactorId =
  | 'team'
  | 'distribution'
  | 'ttm'
  | 'budget'
  | 'lifespan'
  | 'scale'
  | 'dataVolume'
  | 'async'
  | 'realtime'
  | 'domain'
  | 'consistency'
  | 'security'
  | 'legacy'
  | 'devops';

export type DimensionId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

/** Factor levels chosen by the user: 0, 1, or 2. Missing entries default to 0. */
export type Levels = Partial<Record<FactorId, number>>;

/** Normalized QA weights summing to 100. */
export type Weights = Record<QaId, number>;

export interface QualityAttribute {
  id: QaId;
  name: Bilingual;
  /** Plain-language label shown in guided mode (the prototype's friendly voice). */
  plain: Bilingual;
  /** One-line plain explanation shown under the label in guided mode. */
  gloss: Bilingual;
  isoMapping: string;
  /** true for concerns OUTSIDE the ISO 25010 product model (economic/delivery goals). */
  economicFlag: boolean;
}

export interface Factor {
  id: FactorId;
  label: Bilingual;
  /** Friendly question shown in guided mode (the prototype's voice). */
  question: Bilingual;
  /** One-line plain hint shown under the question in guided mode. */
  gloss: Bilingual;
  /** Exactly three level labels, for indices 0/1/2. */
  levels: [Bilingual, Bilingual, Bilingual];
  help: Bilingual;
  group: Bilingual;
  /** Shown by default (the prototype surfaces 3); the rest sit behind "show other factors". */
  primary?: boolean;
  /** budget is inverted: level 0 (Tight) is the strongest cost-efficiency signal. */
  inverted?: boolean;
}

export interface ArchOption {
  id: string;
  name: string;
  /** qaFit vector of integers 1..5, in canonical QA order. */
  qaFit: number[];
}

export interface Dimension {
  id: DimensionId;
  name: Bilingual;
  /** Short guided-mode label (Build Spec Section 6). */
  guidedLabel: Bilingual;
  options: ArchOption[];
}

export interface RankedOption {
  name: string;
  id: string;
  /** Raw composite score in [1, 5]. */
  score: number;
  /** Canonical config index, used for deterministic tie-breaking. */
  index: number;
}
