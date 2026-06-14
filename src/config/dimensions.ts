import type { Dimension, DimensionId } from '../types';

// Architecture dimensions & qaFit vectors (step 2 of scoring).
// qaFit vectors are integers 1–5 in canonical QA order:
//   [perf, scal, avail, sec, maint, deploy, test, obs, dataCons, interop, cost, ttm]
// Option order is the canonical tie-break order. Values are reproduced verbatim from the
// single source of truth: docs/03-blueprint/model-data-sheet.md Section 4 (machine-verified
// by scripts/verify-model.mjs; D4/D5 interim-ratified, ADR-0001). Do not edit by eye.

export const DIMENSION_ORDER: DimensionId[] = ['D1', 'D2', 'D3', 'D4', 'D5'];

export const DIMENSIONS: Record<DimensionId, Dimension> = {
  D1: {
    id: 'D1',
    name: { en: 'Deployment Granularity', id: 'Granularitas Deploy' },
    guidedLabel: { en: 'How it’s split into apps', id: 'Cara dipecah jadi aplikasi' },
    options: [
      { id: 'layered', name: 'Layered / N-Tier', qaFit: [4, 3, 3, 4, 3, 2, 3, 3, 5, 3, 4, 4] },
      { id: 'monolith', name: 'Monolith', qaFit: [4, 2, 3, 4, 3, 2, 4, 4, 5, 3, 4, 5] },
      { id: 'modular-monolith', name: 'Modular Monolith', qaFit: [4, 3, 3, 4, 4, 3, 4, 4, 5, 3, 4, 4] },
      { id: 'microservices', name: 'Microservices', qaFit: [3, 5, 4, 4, 4, 5, 3, 3, 2, 4, 2, 2] },
      { id: 'serverless', name: 'Serverless (FaaS)', qaFit: [3, 5, 4, 3, 3, 4, 3, 3, 3, 3, 4, 4] },
    ],
  },
  D2: {
    id: 'D2',
    name: { en: 'Communication Style', id: 'Gaya Komunikasi' },
    guidedLabel: { en: 'How the parts talk', id: 'Cara antar-bagian berkomunikasi' },
    options: [
      { id: 'synchronous', name: 'Synchronous (request/response)', qaFit: [4, 2, 2, 3, 4, 3, 3, 4, 5, 3, 3, 5] },
      { id: 'async-messaging', name: 'Async messaging', qaFit: [3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
      { id: 'event-driven', name: 'Event-driven (pub/sub)', qaFit: [3, 5, 5, 3, 3, 3, 3, 2, 2, 3, 3, 2] },
      { id: 'streaming', name: 'Streaming', qaFit: [5, 5, 4, 3, 2, 3, 3, 2, 2, 3, 3, 2] },
    ],
  },
  D3: {
    id: 'D3',
    name: { en: 'Data Management', id: 'Pengelolaan Data' },
    guidedLabel: { en: 'Where data lives', id: 'Tempat data disimpan' },
    options: [
      { id: 'single-db', name: 'Single shared database', qaFit: [4, 2, 3, 3, 3, 2, 3, 3, 5, 3, 4, 5] },
      { id: 'db-per-service', name: 'Database-per-service', qaFit: [3, 5, 3, 3, 4, 5, 3, 3, 2, 3, 3, 3] },
      { id: 'cqrs', name: 'CQRS', qaFit: [5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2] },
      { id: 'event-sourcing', name: 'Event Sourcing', qaFit: [3, 4, 3, 3, 2, 3, 3, 5, 4, 3, 2, 2] },
      { id: 'polyglot', name: 'Polyglot persistence', qaFit: [4, 4, 3, 3, 3, 3, 3, 3, 3, 4, 2, 3] },
    ],
  },
  D4: {
    id: 'D4',
    name: { en: 'Code Structure', id: 'Struktur Kode' },
    guidedLabel: { en: 'How each app is organized inside', id: 'Cara tiap aplikasi ditata di dalam' },
    options: [
      { id: 'hexagonal', name: 'Hexagonal (Ports & Adapters)', qaFit: [3, 3, 3, 4, 5, 3, 5, 3, 3, 4, 3, 2] },
      { id: 'clean', name: 'Clean Architecture', qaFit: [3, 3, 3, 4, 5, 3, 5, 3, 3, 3, 3, 2] },
      { id: 'vertical-slice', name: 'Vertical Slice', qaFit: [3, 3, 3, 3, 4, 3, 4, 3, 3, 3, 3, 4] },
      { id: 'layered', name: 'Layered', qaFit: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5] },
    ],
  },
  D5: {
    id: 'D5',
    name: { en: 'Frontend Architecture', id: 'Arsitektur Frontend' },
    guidedLabel: { en: 'How the screens are built', id: 'Cara layar dibangun' },
    options: [
      { id: 'micro-frontends', name: 'Micro-frontends', qaFit: [3, 5, 3, 3, 2, 5, 3, 3, 3, 3, 2, 2] },
      { id: 'spa', name: 'Single-page app (SPA)', qaFit: [3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 4, 4] },
      { id: 'ssr', name: 'Server-rendered (SSR/SSG)', qaFit: [5, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3] },
    ],
  },
};
