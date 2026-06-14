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
}

const levels = (v: number[]): Levels => ({
  team: v[0], distribution: v[1], ttm: v[2], budget: v[3], lifespan: v[4], scale: v[5],
  dataVolume: v[6], async: v[7], realtime: v[8], domain: v[9], consistency: v[10],
  security: v[11], legacy: v[12], devops: v[13],
});

export const PRESETS: Preset[] = [
  {
    id: 'startup-mvp',
    label: { en: 'Startup MVP', id: 'MVP startup' },
    description: {
      en: 'New product, small team, ship fast — keep it simple.',
      id: 'Produk baru, tim kecil, rilis cepat — buat sesederhana mungkin.',
    },
    levels: levels([0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    id: 'regulated',
    label: { en: 'Regulated / enterprise', id: 'Teregulasi / enterprise' },
    description: {
      en: 'Strong consistency, strict compliance, long-lived complex domain.',
      id: 'Konsistensi kuat, kepatuhan ketat, domain kompleks berumur panjang.',
    },
    levels: levels([1, 0, 0, 1, 2, 0, 0, 0, 0, 2, 2, 2, 1, 1]),
  },
  {
    id: 'high-traffic-ecommerce',
    label: { en: 'High-traffic e-commerce', id: 'E-commerce trafik tinggi' },
    description: {
      en: 'Large distributed team, high scale and data volume, mature DevOps.',
      id: 'Tim besar terdistribusi, skala & volume data tinggi, DevOps matang.',
    },
    levels: levels([2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 1, 1, 0, 2]),
  },
  {
    id: 'iot-streaming',
    label: { en: 'IoT / streaming', id: 'IoT / streaming' },
    description: {
      en: 'Real-time, heavy async and data volume, high scale.',
      id: 'Real-time, beban asinkron & volume data berat, skala tinggi.',
    },
    levels: levels([1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 1, 0, 2]),
  },
  {
    id: 'internal-tool',
    label: { en: 'Internal tool', id: 'Alat internal' },
    description: {
      en: 'Modest internal app, quick to deliver, some legacy integration.',
      id: 'Aplikasi internal sederhana, cepat dirilis, ada integrasi legacy.',
    },
    levels: levels([1, 0, 2, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1]),
  },
];
