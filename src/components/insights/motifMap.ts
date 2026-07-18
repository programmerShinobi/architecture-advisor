import type { MotifKind } from './MotifArt';

/** Map content ids → motifs (single source; separate file so MotifArt stays fast-refreshable). */
export const MOTIF_FOR: Record<string, MotifKind> = {
  // Roadmap paths
  'architecture-fundamentals': 'stairs',
  'monolith-to-microservices': 'split',
  'communication-styles': 'bus',
  'data-ownership': 'cylinders',
  'clean-code-structure': 'hexcore',
  'frontend-at-scale': 'browser',
  'reviewing-architecture': 'gauge',
  // Academy modules
  'd1-deployment': 'split',
  'd2-communication': 'bus',
  'd3-data': 'cylinders',
  'd4-structure': 'hexcore',
  'd5-frontend': 'browser',
  'methods-practice': 'radar',
  // Lab experiments
  'team-size-flip': 'team',
  'premature-split': 'warning',
  'realtime-streaming': 'wave',
  'consistency-anchor': 'anchor',
  'legacy-strangler': 'bridge',
  'ceremony-vs-speed': 'gauge',
  'frontend-autonomy': 'tiles',
};
