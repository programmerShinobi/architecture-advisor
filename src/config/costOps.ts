import type { Bilingual } from '../types';

// Qualitative operational-overhead and infra-cost indicators per D1 deployment option
// (Build Spec Section 8.11). These are defensible expert defaults, NOT values frozen in the
// Model Data Sheet — to be recorded in DECISIONS.md and editable like any other config.

export type OpsLevel = 'low' | 'med' | 'high';

export interface CostOps {
  overhead: OpsLevel;
  infraCost: OpsLevel;
  caveat: Bilingual;
}

export const COST_OPS: Record<string, CostOps> = {
  layered: {
    overhead: 'low',
    infraCost: 'low',
    caveat: {
      en: 'One deployable; cost scales with the whole stack, not per feature.',
      id: 'Satu unit rilis; biaya naik mengikuti seluruh tumpukan, bukan per fitur.',
    },
  },
  monolith: {
    overhead: 'low',
    infraCost: 'low',
    caveat: {
      en: 'Cheapest at small scale; costs rise sharply when the whole app must scale.',
      id: 'Termurah pada skala kecil; biaya melonjak saat seluruh aplikasi harus naik skala.',
    },
  },
  'modular-monolith': {
    overhead: 'low',
    infraCost: 'low',
    caveat: {
      en: 'Monolith economics with cleaner internal boundaries; still a single deploy.',
      id: 'Ekonomi monolith dengan batas internal lebih rapi; tetap satu unit rilis.',
    },
  },
  microservices: {
    overhead: 'high',
    infraCost: 'high',
    caveat: {
      en: 'High operational overhead and infra cost — justified mainly at real scale and team size.',
      id: 'Overhead operasional dan biaya infra tinggi — umumnya hanya pantas pada skala dan ukuran tim yang nyata.',
    },
  },
  serverless: {
    overhead: 'med',
    infraCost: 'med',
    caveat: {
      en: 'Scales to zero (cheap when idle) but cost and latency vary with load; watch vendor lock-in.',
      id: 'Skala turun ke nol (murah saat menganggur) tetapi biaya dan latensi bervariasi dengan beban; waspadai vendor lock-in.',
    },
  },
};
