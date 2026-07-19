import { useCallback, useEffect, useRef, useState } from 'react';
import { buildChatContext, getChatAdapter, type ChatMessage } from '../lib/chat';
import { CHAT_KEY as KEY, CHAT_CHANNEL as CHANNEL } from '../lib/chat/persist';
import type { Overrides } from '../lib/scoring';

// The foolproof chat state bridge (Blueprint Phase 1.1/1.2 + 3.1). It owns the Message[] state and:
//   • DEEP-CLONES the live pipeline context on every send (chat can never mutate app state)
//   • persists messages, hydration-safe (pure-client SPA: a lazy, try/catch localStorage read — no
//     SSR step exists to mismatch)
//   • THROTTLES submissions + ignores sends while streaming (no compute/API spam, no double-submit)
//   • streams via the adapter with an AbortSignal (stop / regenerate / unmount all cancel cleanly)
//   • RESETS across tabs: reset() wipes state + storage and broadcasts, so other tabs silently clear
//     (anti-contamination) — WITHOUT resetting on tab navigation (that must not disrupt a stream).

const THROTTLE_MS = 600;

let seq = 0;

export interface ChatContextInput {
  levels: unknown;
  overrides: Overrides;
  mode: string;
  lang: string;
}

// Message ids are DOM keys, not security tokens — a monotonic counter is stable and lint-safe.
const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `m${Date.now()}-${seq++}`;

function hydrate(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(arr)) return [];
    // Never rehydrate a half-streamed turn as "streaming".
    return arr
      .filter((m): m is ChatMessage => !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
      .map((m) => ({ ...m, streaming: false }));
  } catch {
    return [];
  }
}

export function useChat(contextInput: ChatContextInput) {
  const [messages, setMessages] = useState<ChatMessage[]>(hydrate);
  const [streaming, setStreaming] = useState(false);

  // Refs so send/reset stay stable and always read the LATEST app context + message list. Updated
  // in effects (never during render) so React's ref rules hold.
  const ctxRef = useRef(contextInput);
  const messagesRef = useRef(messages);
  const abortRef = useRef<AbortController | null>(null);
  const lastSentRef = useRef(0);
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    ctxRef.current = contextInput;
    messagesRef.current = messages;
  });

  // Persist (hydration-safe write; failures ignored under private mode / full storage).
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Cross-tab reset sync (anti-contamination) — silent wipe when another tab resets.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const bc = new BroadcastChannel(CHANNEL);
    bcRef.current = bc;
    bc.onmessage = (e: MessageEvent) => {
      if (e.data && (e.data as { type?: string }).type === 'reset') {
        abortRef.current?.abort();
        setStreaming(false);
        setMessages([]);
      }
    };
    return () => {
      bc.close();
      bcRef.current = null;
    };
  }, []);

  // Abort any in-flight stream on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const runAdapter = useCallback(async (history: ChatMessage[]) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const context = buildChatContext(ctxRef.current); // fresh deep clone at send time
    const assistantId = uid();
    setMessages((m) => [...m, { id: assistantId, role: 'assistant', text: '', ts: Date.now(), streaming: true }]);
    setStreaming(true);
    try {
      for await (const { delta } of getChatAdapter().reply(history, context, ac.signal)) {
        setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, text: x.text + delta } : x)));
      }
      setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, streaming: false } : x)));
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      setMessages((m) =>
        m.map((x) => (x.id === assistantId ? { ...x, streaming: false, error: !aborted } : x)),
      );
    } finally {
      if (abortRef.current === ac) setStreaming(false);
    }
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      const now = Date.now();
      if (!text || streaming || now - lastSentRef.current < THROTTLE_MS) return; // anti-spam guard
      lastSentRef.current = now;
      const userMsg: ChatMessage = { id: uid(), role: 'user', text, ts: now };
      const next = [...messagesRef.current, userMsg];
      setMessages(next);
      void runAdapter(next);
    },
    [streaming, runAdapter],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  /** Retry the last turn (network fallback / malformed output) — drop trailing assistant msgs, re-run. */
  const regenerate = useCallback(() => {
    if (streaming) return;
    const msgs = messagesRef.current;
    let end = msgs.length;
    while (end > 0 && msgs[end - 1].role === 'assistant') end--;
    if (end === 0) return;
    const history = msgs.slice(0, end);
    setMessages(history);
    void runAdapter(history);
  }, [streaming, runAdapter]);

  /** Wipe everything (Start Over) + broadcast so other tabs clear silently (anti-contamination). */
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
    setMessages([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    bcRef.current?.postMessage({ type: 'reset' });
  }, []);

  return { messages, streaming, send, stop, regenerate, reset };
}
