import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat, type ChatContextInput } from './useChat';
import { CHAT_KEY } from '../lib/chat/persist';
import { DEFAULT_LEVELS } from '../config/defaults';

const input: ChatContextInput = { levels: DEFAULT_LEVELS, overrides: {}, mode: 'guided', lang: 'en' };

// State-bridge safety (Blueprint Phase 3.1): send/stream/persist/reset with no leaks or spam.
describe('useChat', () => {
  beforeEach(() => localStorage.clear());

  it('send appends a user + a streamed assistant reply and persists them', async () => {
    const { result } = renderHook(() => useChat(input));
    act(() => result.current.send('recommend'));
    await waitFor(() => expect(result.current.streaming).toBe(false), { timeout: 4000 });
    const roles = result.current.messages.map((m) => m.role);
    expect(roles).toEqual(['user', 'assistant']);
    expect(result.current.messages[1].text.length).toBeGreaterThan(0);
    // persisted (hydration-safe storage)
    expect(JSON.parse(localStorage.getItem(CHAT_KEY) ?? '[]')).toHaveLength(2);
  });

  it('throttles rapid double-submits (no compute/API spam)', () => {
    const { result } = renderHook(() => useChat(input));
    act(() => {
      result.current.send('recommend');
      result.current.send('recommend again immediately');
    });
    // only the first user message is accepted within the throttle window
    expect(result.current.messages.filter((m) => m.role === 'user')).toHaveLength(1);
  });

  it('reset() wipes messages and persistence', async () => {
    const { result } = renderHook(() => useChat(input));
    act(() => result.current.send('recommend'));
    await waitFor(() => expect(result.current.streaming).toBe(false), { timeout: 4000 });
    act(() => result.current.reset());
    expect(result.current.messages).toEqual([]);
    // Persistence holds no messages (the persist effect rewrites "[]" after the removeItem — both
    // hydrate to empty).
    expect(JSON.parse(localStorage.getItem(CHAT_KEY) ?? '[]')).toHaveLength(0);
  });

  it('ignores empty/whitespace sends', () => {
    const { result } = renderHook(() => useChat(input));
    act(() => result.current.send('   '));
    expect(result.current.messages).toEqual([]);
  });
});
