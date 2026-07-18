import type { Bilingual, FactorId } from '../types';

// The Custom Architecture Wizard schema (Master Blueprint Phase 1.2) — a foolproof guided builder
// for unique system requests. It captures four UNIVERSAL architectural variables and MAPS them onto
// the frozen 14-factor engine, so there is exactly ONE scoring model (no parallel logic, no drift).
//
// Long-term safeguard (Phase 1.1): this is a strictly-typed, modular config. New wizard options or
// whole questions are INJECTED here — the UI (`CustomWizard.tsx`) and the pure mapping
// (`lib/customWizard.ts`) iterate this array and never need editing to add a scenario dimension.
// Every option's `levels` are validated against the model by a unit test.

export type WizardGroup = 'goal' | 'domain' | 'constraints' | 'nfr';

export interface WizardOption {
  id: string;
  label: Bilingual;
  hint?: Bilingual;
  /** Factor nudges applied when this option is chosen (0–2). Combined by ordered override,
   *  then NFRs fine-tune — see `wizardToLevels`. Omitted factors keep the moderate baseline. */
  levels: Partial<Record<FactorId, 0 | 1 | 2>>;
}

export interface WizardQuestion {
  id: string;
  group: WizardGroup;
  /** Tabler icon name (resolved in the UI) — decorative. */
  icon: string;
  title: Bilingual;
  help: Bilingual;
  /** NFRs allow several picks; the rest are single-choice. */
  multi?: boolean;
  options: WizardOption[];
}

/** The four universal variables, as six flat questions grouped into 4 sections in the UI.
 *  Question ORDER is the override order (later wins per factor; NFRs last, fine-tuning). */
export const WIZARD_QUESTIONS: WizardQuestion[] = [
  // ---- (1) Primary System Goal ------------------------------------------------
  {
    id: 'goal',
    group: 'goal',
    icon: 'target',
    title: { en: 'Primary system goal', id: 'Tujuan utama sistem' },
    help: { en: 'What is this system most trying to achieve?', id: 'Apa yang paling ingin dicapai sistem ini?' },
    options: [
      {
        id: 'mvp',
        label: { en: 'Ship an MVP fast', id: 'Rilis MVP dengan cepat' },
        hint: { en: 'Prove the idea quickly, keep it simple', id: 'Buktikan ide dengan cepat, tetap sederhana' },
        levels: { ttm: 2, lifespan: 0, budget: 0, devops: 0, domain: 0, scale: 0 },
      },
      {
        id: 'scale',
        label: { en: 'Scale to high traffic', id: 'Skala ke trafik tinggi' },
        hint: { en: 'Handle growth, spikes and large data', id: 'Tangani pertumbuhan, lonjakan, dan data besar' },
        levels: { scale: 2, dataVolume: 2, devops: 2, team: 2, async: 1 },
      },
      {
        id: 'correctness',
        label: { en: 'Maximize correctness & compliance', id: 'Maksimalkan kebenaran & kepatuhan' },
        hint: { en: 'Strong consistency, auditability, safety', id: 'Konsistensi kuat, dapat diaudit, aman' },
        levels: { consistency: 2, security: 2, domain: 2, lifespan: 2 },
      },
      {
        id: 'modernize',
        label: { en: 'Modernize a legacy system', id: 'Modernisasi sistem legacy' },
        hint: { en: 'Evolve an existing estate incrementally', id: 'Kembangkan sistem lama secara bertahap' },
        levels: { legacy: 2, team: 2, lifespan: 2, domain: 1 },
      },
      {
        id: 'realtime',
        label: { en: 'Deliver a real-time experience', id: 'Sajikan pengalaman real-time' },
        hint: { en: 'Live updates, low latency, always-on', id: 'Pembaruan langsung, latensi rendah, selalu aktif' },
        levels: { realtime: 2, async: 2, scale: 2, devops: 2 },
      },
    ],
  },
  // ---- (2) Domain / Industry Context -----------------------------------------
  {
    id: 'domain-ctx',
    group: 'domain',
    icon: 'building',
    title: { en: 'Domain / industry context', id: 'Konteks domain / industri' },
    help: { en: 'Where does this system operate?', id: 'Di lingkungan apa sistem ini beroperasi?' },
    options: [
      { id: 'general', label: { en: 'Startup / general web', id: 'Startup / web umum' }, levels: {} },
      { id: 'fintech', label: { en: 'Fintech / banking', id: 'Fintech / perbankan' }, levels: { security: 2, consistency: 2, domain: 2 } },
      { id: 'health', label: { en: 'Healthcare', id: 'Kesehatan' }, levels: { security: 2, consistency: 2, domain: 2, lifespan: 2 } },
      { id: 'ecommerce', label: { en: 'E-commerce / retail', id: 'E-commerce / ritel' }, levels: { scale: 2, dataVolume: 1, async: 1, realtime: 1 } },
      { id: 'iot', label: { en: 'IoT / telemetry', id: 'IoT / telemetri' }, levels: { dataVolume: 2, async: 2, realtime: 2, scale: 2 } },
      { id: 'internal', label: { en: 'Internal / enterprise tools', id: 'Alat internal / enterprise' }, levels: { legacy: 1, security: 1, domain: 1 } },
      { id: 'media', label: { en: 'Media / streaming', id: 'Media / streaming' }, levels: { scale: 2, realtime: 2, dataVolume: 2 } },
    ],
  },
  // ---- (3) Hard Constraints (budget · team · timeline) -----------------------
  {
    id: 'budget',
    group: 'constraints',
    icon: 'coin',
    title: { en: 'Budget', id: 'Anggaran' },
    help: { en: 'How much can you spend to move faster?', id: 'Seberapa besar dana untuk bergerak lebih cepat?' },
    options: [
      { id: 'tight', label: { en: 'Tight', id: 'Ketat' }, levels: { budget: 0 } },
      { id: 'moderate', label: { en: 'Moderate', id: 'Sedang' }, levels: { budget: 1 } },
      { id: 'flexible', label: { en: 'Flexible', id: 'Fleksibel' }, levels: { budget: 2 } },
    ],
  },
  {
    id: 'team',
    group: 'constraints',
    icon: 'users',
    title: { en: 'Team size', id: 'Ukuran tim' },
    help: { en: 'How many people build and run it?', id: 'Berapa orang yang membangun & menjalankannya?' },
    options: [
      { id: 'solo', label: { en: 'Solo / small (1–5)', id: 'Solo / kecil (1–5)' }, levels: { team: 0, distribution: 0 } },
      { id: 'growing', label: { en: 'A few teams (6–20)', id: 'Beberapa tim (6–20)' }, levels: { team: 1, distribution: 1 } },
      { id: 'many', label: { en: 'Many teams (20+)', id: 'Banyak tim (20+)' }, levels: { team: 2, distribution: 2 } },
    ],
  },
  {
    id: 'timeline',
    group: 'constraints',
    icon: 'clock',
    title: { en: 'Timeline', id: 'Tenggat waktu' },
    help: { en: 'How urgent is the delivery?', id: 'Seberapa mendesak pengirimannya?' },
    options: [
      { id: 'relaxed', label: { en: 'Relaxed', id: 'Santai' }, levels: { ttm: 0 } },
      { id: 'normal', label: { en: 'Normal roadmap', id: 'Roadmap normal' }, levels: { ttm: 1 } },
      { id: 'hard', label: { en: 'Hard deadline', id: 'Tenggat ketat' }, levels: { ttm: 2 } },
    ],
  },
  // ---- (4) Prioritized Non-Functional Requirements (multi) -------------------
  {
    id: 'nfr',
    group: 'nfr',
    icon: 'adjustments',
    title: { en: 'Prioritized NFRs', id: 'Prioritas NFR' },
    help: { en: 'Pick the qualities that matter most (choose any).', id: 'Pilih kualitas yang paling penting (boleh beberapa).' },
    multi: true,
    options: [
      { id: 'scalability', label: { en: 'Scalability', id: 'Skalabilitas' }, levels: { scale: 2, dataVolume: 1 } },
      { id: 'security', label: { en: 'Security & compliance', id: 'Keamanan & kepatuhan' }, levels: { security: 2, consistency: 1 } },
      { id: 'speed', label: { en: 'Speed to market', id: 'Kecepatan rilis' }, levels: { ttm: 2 } },
      { id: 'maintainability', label: { en: 'Maintainability', id: 'Kemudahan pemeliharaan' }, levels: { lifespan: 2, devops: 1 } },
      { id: 'performance', label: { en: 'Performance / low latency', id: 'Performa / latensi rendah' }, levels: { realtime: 1, scale: 1 } },
      { id: 'reliability', label: { en: 'Reliability / availability', id: 'Keandalan / ketersediaan' }, levels: { devops: 2, distribution: 1 } },
    ],
  },
];
