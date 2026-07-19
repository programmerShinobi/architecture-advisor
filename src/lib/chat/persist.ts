// Tiny, dependency-free persistence helpers for the chat (no engine/React imports), so App can
// wipe chat state on "Start Over" WITHOUT pulling the lazy chat chunk into the initial bundle.

export const CHAT_KEY = 'aa.chat.messages';
export const CHAT_CHANNEL = 'aa.chat';

/**
 * Wipe persisted chat + tell other tabs to clear (anti-contamination). Safe to call whether or not
 * the chat panel is mounted; the mounted hook has its own in-tab reset for the same-tab case.
 */
export function resetChatPersistence(): void {
  try {
    localStorage.removeItem(CHAT_KEY);
  } catch {
    /* ignore storage errors */
  }
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHAT_CHANNEL);
      bc.postMessage({ type: 'reset' });
      bc.close();
    }
  } catch {
    /* ignore */
  }
}
