import { localAdvisorAdapter } from './localAdvisorAdapter';
import type { ChatAdapter } from './types';

export type { ChatAdapter, ChatChunk, ChatContext, ChatMessage, ChatRole, ChatMode, ChatSuggestion } from './types';
export { buildChatContext, isValidContext, isValidLevels } from './context';
export { answerText, localAdvisorAdapter } from './localAdvisorAdapter';

/**
 * The single swap-point for the ChatService (Adapter Pattern). Today it returns the local,
 * offline, rule-based advisor. To wire a network LLM later, implement a new `ChatAdapter` and
 * return it here — NO UI, hook, or state code changes (they depend only on the `ChatAdapter`
 * contract). That is the entire long-term-scalability guarantee, in one function.
 */
export function getChatAdapter(): ChatAdapter {
  return localAdvisorAdapter;
}
