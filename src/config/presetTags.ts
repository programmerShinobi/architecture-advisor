import type { Bilingual } from '../types';

// Filter tags for the Scenario Card Gallery (Master Blueprint Phase 1.3). Kept out of presets.ts
// so the frozen preset-level guards are untouched; tags are pure UI metadata. Injectable: add a
// preset id → tag ids here and (optionally) a new tag label below — the gallery adapts automatically.

export const PRESET_TAGS: Record<string, string[]> = {
  'startup-mvp': ['startup', 'small'],
  regulated: ['enterprise', 'compliance'],
  'high-traffic-ecommerce': ['high-scale', 'enterprise'],
  'iot-streaming': ['realtime', 'data'],
  'internal-tool': ['internal', 'small'],
  'saas-b2b': ['saas', 'enterprise'],
  'mobile-consumer': ['mobile', 'startup'],
  'data-platform': ['data', 'high-scale'],
  'legacy-modernization': ['legacy', 'enterprise'],
  'realtime-collab': ['realtime', 'saas'],
};

/** Curated quick-filter chips shown above the gallery (order matters; label is bilingual). */
export const PRESET_FILTERS: { id: string; label: Bilingual }[] = [
  { id: 'startup', label: { en: 'Startup', id: 'Startup' } },
  { id: 'enterprise', label: { en: 'Enterprise', id: 'Enterprise' } },
  { id: 'high-scale', label: { en: 'High-scale', id: 'Skala tinggi' } },
  { id: 'realtime', label: { en: 'Real-time', id: 'Real-time' } },
  { id: 'data', label: { en: 'Data', id: 'Data' } },
  { id: 'saas', label: { en: 'SaaS', id: 'SaaS' } },
  { id: 'legacy', label: { en: 'Legacy', id: 'Legacy' } },
];
