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
    plain: { en: 'Speed & quick response', id: 'Kecepatan & respons cepat' },
    gloss: { en: 'Pages and actions feel snappy', id: 'Halaman dan aksi terasa gesit' },
    isoMapping: 'Performance efficiency (time behaviour)',
    economicFlag: false,
  },
  scalability: {
    id: 'scalability',
    name: { en: 'Scalability', id: 'Skalabilitas' },
    plain: { en: 'Handling lots of users', id: 'Menangani banyak pengguna' },
    gloss: { en: 'Stays fast when crowds show up', id: 'Tetap cepat saat ramai pengunjung' },
    isoMapping: 'Flexibility › scalability (new 2023 subcharacteristic)',
    economicFlag: false,
  },
  availability: {
    id: 'availability',
    name: { en: 'Availability & resilience', id: 'Ketersediaan & ketahanan' },
    plain: { en: 'Always staying online', id: 'Selalu tersedia online' },
    gloss: { en: 'Keeps working even if one part fails', id: 'Tetap berjalan walau satu bagian gagal' },
    isoMapping: 'Reliability (availability, fault tolerance, recoverability)',
    economicFlag: false,
  },
  security: {
    id: 'security',
    name: { en: 'Security', id: 'Keamanan' },
    plain: { en: 'Keeping data safe', id: 'Menjaga data tetap aman' },
    gloss: { en: 'Protects against misuse and breaches', id: 'Melindungi dari penyalahgunaan dan kebocoran' },
    isoMapping: 'Security',
    economicFlag: false,
  },
  maintainability: {
    id: 'maintainability',
    name: { en: 'Maintainability & evolvability', id: 'Kemudahan pemeliharaan & evolusi' },
    plain: { en: 'Easy to change later', id: 'Mudah diubah nanti' },
    gloss: { en: 'Simple to fix and extend over time', id: 'Mudah diperbaiki dan dikembangkan seiring waktu' },
    isoMapping: 'Maintainability (modularity, modifiability)',
    economicFlag: false,
  },
  deployability: {
    id: 'deployability',
    name: { en: 'Deployability & release independence', id: 'Kemudahan rilis & independensi rilis' },
    plain: { en: 'Easy, frequent updates', id: 'Pembaruan mudah dan sering' },
    gloss: {
      en: 'Teams ship changes without waiting on each other',
      id: 'Tim merilis perubahan tanpa saling menunggu',
    },
    isoMapping: 'Maintainability/Flexibility (operational)',
    economicFlag: false,
  },
  testability: {
    id: 'testability',
    name: { en: 'Testability', id: 'Kemudahan pengujian' },
    plain: { en: 'Easy to test', id: 'Mudah diuji' },
    gloss: { en: "Confidence that changes don't break things", id: 'Yakin perubahan tak merusak yang lain' },
    isoMapping: 'Maintainability › testability',
    economicFlag: false,
  },
  observability: {
    id: 'observability',
    name: { en: 'Observability', id: 'Observabilitas' },
    plain: { en: "Seeing what's happening", id: 'Melihat apa yang terjadi' },
    gloss: { en: 'Logs, metrics and traces when things go wrong', id: 'Log, metrik, dan trace saat ada masalah' },
    isoMapping: '(operational concern; not an ISO top-level characteristic)',
    economicFlag: false,
  },
  dataConsistency: {
    id: 'dataConsistency',
    name: { en: 'Data consistency & integrity', id: 'Konsistensi & integritas data' },
    plain: { en: 'Data stays correct', id: 'Data tetap benar' },
    gloss: { en: 'No lost or conflicting updates', id: 'Tak ada pembaruan hilang atau bentrok' },
    isoMapping: 'Functional suitability (correctness) / Reliability',
    economicFlag: false,
  },
  interoperability: {
    id: 'interoperability',
    name: { en: 'Interoperability & integration', id: 'Interoperabilitas & integrasi' },
    plain: { en: 'Works with other systems', id: 'Bekerja dengan sistem lain' },
    gloss: { en: 'Integrates cleanly with what you have', id: 'Terintegrasi rapi dengan yang sudah ada' },
    isoMapping: 'Compatibility › interoperability',
    economicFlag: false,
  },
  costEfficiency: {
    id: 'costEfficiency',
    name: { en: 'Cost efficiency', id: 'Efisiensi biaya' },
    plain: { en: 'Keeping costs down', id: 'Menekan biaya' },
    gloss: { en: 'Good value to build and run', id: 'Hemat untuk dibangun dan dijalankan' },
    isoMapping: '(economic — outside ISO product quality model)',
    economicFlag: true,
  },
  timeToMarket: {
    id: 'timeToMarket',
    name: { en: 'Time-to-market / delivery speed', id: 'Waktu rilis / kecepatan pengiriman' },
    plain: { en: 'Launching quickly', id: 'Meluncur cepat' },
    gloss: { en: 'Getting the first version out fast', id: 'Merilis versi pertama dengan cepat' },
    isoMapping: '(business/delivery goal — outside ISO model)',
    economicFlag: true,
  },
};
