import type { QaId, QualityAttribute } from '../types';

// 12 quality attributes — the spine of the model, grounded in ISO/IEC 25010:2023.
// Order is canonical and MUST match the qaFit-vector order in dimensions.ts.
// Source of truth: docs/03-blueprint/model-data-sheet.md Section 1 + Build Spec Section 3.

export const QA_ORDER: QaId[] = [
  'performance',
  'scalability',
  'availability',
  'security',
  'maintainability',
  'deployability',
  'testability',
  'observability',
  'dataConsistency',
  'interoperability',
  'costEfficiency',
  'timeToMarket',
];

export const QUALITY_ATTRIBUTES: Record<QaId, QualityAttribute> = {
  performance: {
    id: 'performance',
    name: { en: 'Performance & latency', id: 'Performa & latensi' },
    isoMapping: 'Performance efficiency (time behaviour)',
    economicFlag: false,
  },
  scalability: {
    id: 'scalability',
    name: { en: 'Scalability', id: 'Skalabilitas' },
    isoMapping: 'Flexibility › scalability (new 2023 subcharacteristic)',
    economicFlag: false,
  },
  availability: {
    id: 'availability',
    name: { en: 'Availability & resilience', id: 'Ketersediaan & ketahanan' },
    isoMapping: 'Reliability (availability, fault tolerance, recoverability)',
    economicFlag: false,
  },
  security: {
    id: 'security',
    name: { en: 'Security', id: 'Keamanan' },
    isoMapping: 'Security',
    economicFlag: false,
  },
  maintainability: {
    id: 'maintainability',
    name: { en: 'Maintainability & evolvability', id: 'Kemudahan pemeliharaan & evolusi' },
    isoMapping: 'Maintainability (modularity, modifiability)',
    economicFlag: false,
  },
  deployability: {
    id: 'deployability',
    name: { en: 'Deployability & release independence', id: 'Kemudahan rilis & independensi rilis' },
    isoMapping: 'Maintainability/Flexibility (operational)',
    economicFlag: false,
  },
  testability: {
    id: 'testability',
    name: { en: 'Testability', id: 'Kemudahan pengujian' },
    isoMapping: 'Maintainability › testability',
    economicFlag: false,
  },
  observability: {
    id: 'observability',
    name: { en: 'Observability', id: 'Observabilitas' },
    isoMapping: '(operational concern; not an ISO top-level characteristic)',
    economicFlag: false,
  },
  dataConsistency: {
    id: 'dataConsistency',
    name: { en: 'Data consistency & integrity', id: 'Konsistensi & integritas data' },
    isoMapping: 'Functional suitability (correctness) / Reliability',
    economicFlag: false,
  },
  interoperability: {
    id: 'interoperability',
    name: { en: 'Interoperability & integration', id: 'Interoperabilitas & integrasi' },
    isoMapping: 'Compatibility › interoperability',
    economicFlag: false,
  },
  costEfficiency: {
    id: 'costEfficiency',
    name: { en: 'Cost efficiency', id: 'Efisiensi biaya' },
    isoMapping: '(economic — outside ISO product quality model)',
    economicFlag: true,
  },
  timeToMarket: {
    id: 'timeToMarket',
    name: { en: 'Time-to-market / delivery speed', id: 'Waktu rilis / kecepatan pengiriman' },
    isoMapping: '(business/delivery goal — outside ISO model)',
    economicFlag: true,
  },
};
