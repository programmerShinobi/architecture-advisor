import { memo } from 'react';
import { IconRefresh, IconAlertTriangle } from '@tabler/icons-react';
import { renderMarkdown } from '../../lib/markdown';
import { ChatErrorBoundary } from './ChatErrorBoundary';
import type { ChatMessage } from '../../lib/chat';

interface Props {
  msg: ChatMessage;
  /** Localized "Failed to render output" fallback text. */
  renderErrorText: string;
  /** Localized "Regenerate" label; shown on the last errored assistant turn. */
  regenerateLabel: string;
  onRegenerate: () => void;
  showRegenerate: boolean;
}

// One chat bubble — MEMOIZED (Blueprint Phase 2.2: 60fps with 100+ messages; only the streaming
// bubble re-renders because its `text` prop changes). Assistant markdown is rendered with the app's
// dependency-free, XSS-safe-by-construction renderer (React elements, never dangerouslySetInnerHTML),
// wrapped in a per-bubble ErrorBoundary.
function ChatMessageItemBase({ msg, renderErrorText, regenerateLabel, onRegenerate, showRegenerate }: Readonly<Props>) {
  const isUser = msg.role === 'user';
  return (
    <div className={`aa-chat-msg ${isUser ? 'user' : 'bot'}`}>
      <div className="aa-chat-bubble">
        {isUser ? (
          msg.text
        ) : msg.error ? (
          <span className="aa-chat-error">
            <IconAlertTriangle size={14} aria-hidden /> {renderErrorText}
          </span>
        ) : (
          <ChatErrorBoundary
            fallback={
              <span className="aa-chat-error">
                <IconAlertTriangle size={14} aria-hidden /> {renderErrorText}
              </span>
            }
          >
            <div className="learn-prose aa-chat-prose">{renderMarkdown(msg.text)}</div>
          </ChatErrorBoundary>
        )}
        {msg.streaming && <span className="aa-chat-caret" aria-hidden />}
      </div>
      {!isUser && (msg.error || showRegenerate) && !msg.streaming && (
        <button type="button" className="aa-chat-regen" onClick={onRegenerate}>
          <IconRefresh size={13} aria-hidden />
          {regenerateLabel}
        </button>
      )}
    </div>
  );
}

// Re-render only when the visible content/flags of THIS message change.
export const ChatMessageItem = memo(
  ChatMessageItemBase,
  (a, b) =>
    a.msg.text === b.msg.text &&
    a.msg.streaming === b.msg.streaming &&
    a.msg.error === b.msg.error &&
    a.showRegenerate === b.showRegenerate &&
    a.renderErrorText === b.renderErrorText &&
    a.regenerateLabel === b.regenerateLabel,
);
