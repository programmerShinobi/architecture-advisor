import type { Bilingual, Levels } from '../types';

// Scenario presets — full factor-level sets, calibrated & machine-verified against the outcome
// targets in SRS Section 5.3 (all 25 targets hold; ADR-0002). Levels are verbatim from the
// canonical docs/03-blueprint/model-data-sheet.md Section 6, in factor order:
//   team, distribution, ttm, budget, lifespan, scale, dataVolume, async, realtime, domain,
//   consistency, security, legacy, devops
// Applying a preset clears all expert overrides/locks (scoring-algorithm.md Section 3.4).

export interface Preset {
  id: string;
  label: Bilingual;
  description: Bilingual;
  levels: Levels;
  /**
   * The five ADR-0002 presets are `calibrated: true` — machine-verified against the SRS Section
   * 5.3 outcome targets and bit-pinned by the frozen guards. Helper scenarios (Fase 2) are
   * `calibrated: false`: conveniences that pre-fill the 14 factors, NOT part of the ratified
   * model — structurally validated by check-app-config.mjs and outcome-pinned by a unit test.
   */
  calibrated: boolean;
}

const levels = (v: number[]): Levels => ({
  team: v[0], distribution: v[1], ttm: v[2], budget: v[3], lifespan: v[4], scale: v[5],
  dataVolume: v[6], async: v[7], realtime: v[8], domain: v[9], consistency: v[10],
  security: v[11], legacy: v[12], devops: v[13],
});

export const PRESETS: Preset[] = [
  {
    id: 'startup-mvp',
    label: { en: 'New idea / small startup', id: 'Ide baru / startup kecil' },
    description: {
      en: 'New product, small team, ship fast — keep it simple.',
      id: 'Produk baru, tim kecil, rilis cepat — buat sesederhana mungkin.',
    },
    levels: levels([0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    calibrated: true,
  },
  {
    id: 'regulated',
    label: { en: 'Bank or healthcare', id: 'Bank atau kesehatan' },
    description: {
      en: 'Strong consistency, strict compliance, long-lived complex domain.',
      id: 'Konsistensi kuat, kepatuhan ketat, domain kompleks berumur panjang.',
    },
    levels: levels([1, 0, 0, 1, 2, 0, 0, 0, 0, 2, 2, 2, 1, 1]),
    calibrated: true,
  },
  {
    id: 'high-traffic-ecommerce',
    label: { en: 'Busy online shop', id: 'Toko online ramai' },
    description: {
      en: 'Large distributed team, high scale and data volume, mature DevOps.',
      id: 'Tim besar terdistribusi, skala & volume data tinggi, DevOps matang.',
    },
    levels: levels([2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 1, 1, 0, 2]),
    calibrated: true,
  },
  {
    id: 'iot-streaming',
    label: { en: 'Sensors / live data', id: 'Sensor / data langsung' },
    description: {
      en: 'Real-time, heavy async and data volume, high scale.',
      id: 'Real-time, beban asinkron & volume data berat, skala tinggi.',
    },
    levels: levels([1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 1, 0, 2]),
    calibrated: true,
  },
  {
    id: 'internal-tool',
    label: { en: 'Internal tool', id: 'Alat internal' },
    description: {
      en: 'Modest internal app, quick to deliver, some legacy integration.',
      id: 'Aplikasi internal sederhana, cepat dirilis, ada integrasi legacy.',
    },
    levels: levels([1, 0, 2, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1]),
    calibrated: true,
  },

  // ---- Helper scenarios (Fase 2, DECISIONS.md) — NOT part of the ratified model. ----
  {
    id: 'saas-b2b',
    label: { en: 'B2B SaaS product', id: 'Produk SaaS B2B' },
    description: {
      en: 'Multi-tenant subscription product: long-lived, security-conscious, steady growth.',
      id: 'Produk langganan multi-tenant: berumur panjang, sadar keamanan, tumbuh stabil.',
    },
    levels: levels([1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 0, 1]),
    calibrated: false,
  },
  {
    id: 'mobile-consumer',
    label: { en: 'Consumer mobile app', id: 'Aplikasi mobile konsumen' },
    description: {
      en: 'A consumer app backend: ship fast, spiky traffic, notifications and feeds.',
      id: 'Backend aplikasi konsumen: rilis cepat, trafik melonjak, notifikasi dan feed.',
    },
    levels: levels([1, 0, 2, 1, 1, 2, 1, 1, 1, 0, 0, 1, 0, 1]),
    calibrated: false,
  },
  {
    id: 'data-platform',
    label: { en: 'Data / analytics platform', id: 'Platform data / analitik' },
    description: {
      en: 'Ingest, transform and serve heavy data: pipelines, dashboards, ML features.',
      id: 'Menyerap, mengolah, dan menyajikan data berat: pipeline, dasbor, fitur ML.',
    },
    levels: levels([1, 1, 0, 2, 2, 2, 2, 2, 1, 1, 0, 1, 1, 2]),
    calibrated: false,
  },
  {
    id: 'legacy-modernization',
    label: { en: 'Legacy modernization', id: 'Modernisasi legacy' },
    description: {
      en: 'A big estate with old constraints and a plan to modernise incrementally.',
      id: 'Sistem besar dengan constraint lama dan rencana modernisasi bertahap.',
    },
    levels: levels([2, 1, 0, 2, 2, 1, 1, 1, 0, 2, 2, 2, 2, 1]),
    calibrated: false,
  },
  {
    id: 'realtime-collab',
    label: { en: 'Real-time collaboration', id: 'Kolaborasi real-time' },
    description: {
      en: 'Chat, live documents or multiplayer: presence, low latency, always-on.',
      id: 'Chat, dokumen live, atau multiplayer: presence, latensi rendah, selalu aktif.',
    },
    levels: levels([1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1, 0, 2]),
    calibrated: false,
  },
];
