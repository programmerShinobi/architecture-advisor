// Copilot feature — the ONLY public surface (Phase 1.2, pluggable). App imports `<Copilot/>` and the
// non-invasive `tourId()` helper; everything else is internal to this module.

export { Copilot } from './Copilot';
export { tourId, isTourId, TOUR_IDS, type TourId } from './dataTourId';
export { getCopilotService, localCopilotService } from './copilotService';
export { MAIN_TOUR } from './tourConfig';
export type { CopilotView } from './types';
