import type { CopilotContext, CopilotService, CopilotStep, CopilotStepView } from './types';
import type { Bilingual } from '../../types';

// The LOCAL CopilotService (Adapter Pattern). Rule-based + deterministic: it localizes a config step
// and ENRICHES it with a live fact from the app (e.g. the current top pick on the recommendation
// step), then the hook emits the structured highlight command over the bus. No LLM, no network.

const tr = (b: Bilingual, lang: 'en' | 'id') => b[lang];

export const localCopilotService: CopilotService = {
  id: 'local-copilot',
  describe(step: CopilotStep, ctx: CopilotContext): CopilotStepView {
    let body = tr(step.body, ctx.lang);
    // Context-awareness: weave a real, current fact into the recommendation step.
    if (step.target === 'recommendation' && ctx.topPick) {
      body +=
        ctx.lang === 'id'
          ? `\n\nSaat ini teratas: **${ctx.topPick}**.`
          : `\n\nCurrently leading: **${ctx.topPick}**.`;
    }
    return {
      title: tr(step.title, ctx.lang),
      body,
      dos: (step.dos ?? []).map((d) => tr(d, ctx.lang)),
      donts: (step.donts ?? []).map((d) => tr(d, ctx.lang)),
      target: step.target,
      placement: step.placement ?? 'bottom',
      view: step.view,
      floating: step.floating ?? false,
    };
  },
};

/** Single swap-point for the CopilotService (mirrors getChatAdapter). */
export function getCopilotService(): CopilotService {
  return localCopilotService;
}
