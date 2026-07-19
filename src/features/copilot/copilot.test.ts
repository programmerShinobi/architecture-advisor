import { describe, it, expect, vi } from 'vitest';
import { createCopilotBus } from './eventBus';
import { isTourId, tourId, TOUR_IDS } from './dataTourId';
import { localCopilotService } from './copilotService';
import { MAIN_TOUR } from './tourConfig';
import type { CopilotContext } from './types';

// Copilot engine is pure/deterministic (the DOM overlay is verified in-browser). These lock the
// contracts: whitelist safety, leak-free bus, grounded/localized step content, valid tour config.

describe('data-tour-id whitelist', () => {
  it('accepts only whitelisted ids; rejects anything else (command validation)', () => {
    expect(isTourId('recommendation')).toBe(true);
    expect(isTourId('evil-selector')).toBe(false);
    expect(isTourId(42)).toBe(false);
    expect(isTourId(null)).toBe(false);
  });
  it('tourId() spreads a typed data-tour-id attribute, nothing else', () => {
    expect(tourId('ai-advisor')).toEqual({ 'data-tour-id': 'ai-advisor' });
  });
});

describe('event bus — typed, synchronous, leak-free', () => {
  it('delivers commands to subscribers and stops after unsubscribe (no leaks)', () => {
    const bus = createCopilotBus();
    const a = vi.fn();
    const off = bus.on(a);
    bus.emit({ type: 'highlight', target: 'recommendation', stepIndex: 2 });
    expect(a).toHaveBeenCalledTimes(1);
    off();
    bus.emit({ type: 'stop' });
    expect(a).toHaveBeenCalledTimes(1); // no delivery after cleanup
  });
  it('a handler that unsubscribes mid-emit does not corrupt iteration', () => {
    const bus = createCopilotBus();
    const calls: string[] = [];
    const off1 = bus.on(() => {
      calls.push('one');
      off1();
    });
    bus.on(() => calls.push('two'));
    expect(() => bus.emit({ type: 'stop' })).not.toThrow();
    expect(calls).toEqual(['one', 'two']);
  });
});

describe('local copilot service — grounded, localized, enriched', () => {
  const ctx = (over: Partial<CopilotContext> = {}): CopilotContext => ({ lang: 'en', ...over });
  const recStep = MAIN_TOUR.steps.find((s) => s.target === 'recommendation')!;

  it('localizes a step (EN/ID)', () => {
    expect(localCopilotService.describe(MAIN_TOUR.steps[0], ctx()).title).toBe(MAIN_TOUR.steps[0].title.en);
    expect(localCopilotService.describe(MAIN_TOUR.steps[0], ctx({ lang: 'id' })).title).toBe(MAIN_TOUR.steps[0].title.id);
  });
  it('weaves the live top pick into the recommendation step (context-aware)', () => {
    const v = localCopilotService.describe(recStep, ctx({ topPick: 'Microservices' }));
    expect(v.body).toContain('Microservices');
  });
  it('omits the live fact gracefully when absent (no crash / no undefined)', () => {
    const v = localCopilotService.describe(recStep, ctx());
    expect(v.body).not.toContain('undefined');
  });
});

describe('tour config integrity', () => {
  it('every step targets a whitelisted id and is bilingual', () => {
    for (const s of MAIN_TOUR.steps) {
      expect(TOUR_IDS, s.id).toContain(s.target);
      expect(s.title.en && s.title.id, `${s.id} title`).toBeTruthy();
      expect(s.body.en && s.body.id, `${s.id} body`).toBeTruthy();
      for (const d of [...(s.dos ?? []), ...(s.donts ?? [])]) expect(d.en && d.id).toBeTruthy();
    }
  });
});
