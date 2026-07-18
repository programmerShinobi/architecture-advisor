import { useEffect } from 'react';
import { useChat, type ChatContextInput } from '../../hooks/useChat';
import { ChatPanel } from './ChatPanel';

interface Props {
  contextInput: ChatContextInput;
  onClose: () => void;
  /** App registers the chat's reset() so "Start Over" can wipe it in the same tab (null on unmount). */
  registerReset: (reset: (() => void) | null) => void;
}

// Owns the chat STATE (useChat) and renders the panel. Lives only in the lazy chunk, so useChat +
// the adapter + the Markdown renderer never touch the initial bundle (Blueprint Phase 2.1 FCP).
export function ChatMount({ contextInput, onClose, registerReset }: Readonly<Props>) {
  const chat = useChat(contextInput);

  useEffect(() => {
    registerReset(chat.reset);
    return () => registerReset(null);
  }, [chat.reset, registerReset]);

  return (
    <ChatPanel
      messages={chat.messages}
      streaming={chat.streaming}
      onSend={chat.send}
      onStop={chat.stop}
      onRegenerate={chat.regenerate}
      onReset={chat.reset}
      onClose={onClose}
    />
  );
}

export default ChatMount;
