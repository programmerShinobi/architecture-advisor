import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { IconSend, IconPlayerStop, IconRotate2, IconX, IconSparkles, IconArrowDown } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { ChatMessageItem } from './ChatMessageItem';
import type { ChatMessage } from '../../lib/chat';
import type { DictKey } from '../../i18n/dict';

interface Props {
  messages: readonly ChatMessage[];
  streaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  onReset: () => void;
  onClose: () => void;
}

const SUGGESTIONS: DictKey[] = ['chat.sug.recommend', 'chat.sug.explain', 'chat.sug.compare', 'chat.sug.why', 'chat.sug.risk', 'chat.sug.cost'];

// The chat panel — a DUMB presentation layer for the Message[] + stream (all logic lives in
// useChat). Smart-scroll (IntersectionObserver: auto-scroll unless the user scrolled up), full a11y
// (labelled dialog, polite live region, keyboard), and a Stop/Regenerate affordance.
export function ChatPanel({ messages, streaming, onSend, onStop, onRegenerate, onReset, onClose }: Readonly<Props>) {
  const { t } = useI18n();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  // Smart-scroll: observe a bottom sentinel. When it's visible the user is at the bottom → follow
  // new content; when they scroll up it's hidden → pause auto-scroll (no UI hijacking).
  useEffect(() => {
    const el = endRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        atBottomRef.current = e.isIntersecting;
        setShowJump(!e.isIntersecting);
      },
      { root: listRef.current, threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (atBottomRef.current) endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages]);

  const lastAssistantIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === 'assistant') return i;
    return -1;
  }, [messages]);

  const submit = () => {
    const text = draft.trim();
    if (!text || streaming) return;
    onSend(text);
    setDraft('');
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <section className="aa-chat-panel aa-glass" role="dialog" aria-label={t('chat.title')} aria-modal="false">
      <header className="aa-chat-head">
        <span className="aa-chat-title">
          <IconSparkles size={16} aria-hidden style={{ color: 'var(--color-text-info)' }} />
          {t('chat.title')}
        </span>
        <span className="aa-chat-tools">
          <button type="button" className="aa-ctl-icon" onClick={onReset} title={t('chat.reset')} aria-label={t('chat.reset')}>
            <IconRotate2 size={15} aria-hidden />
          </button>
          <button type="button" className="aa-ctl-icon" onClick={onClose} title={t('chat.close')} aria-label={t('chat.close')}>
            <IconX size={16} aria-hidden />
          </button>
        </span>
      </header>
      <p className="aa-chat-sub">{t('chat.sub')}</p>

      <div className="aa-chat-list" ref={listRef} aria-live="polite" aria-atomic="false">
        {messages.length === 0 ? (
          <div className="aa-chat-empty">
            <p>{t('chat.empty')}</p>
            <div className="aa-chat-sugs">
              {SUGGESTIONS.map((k) => (
                <button key={k} type="button" className="f-chip" onClick={() => onSend(t(k))}>
                  {t(k)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <ChatMessageItem
              key={m.id}
              msg={m}
              renderErrorText={t('chat.renderError')}
              regenerateLabel={t('chat.regenerate')}
              showRegenerate={i === lastAssistantIdx && !streaming}
              onRegenerate={onRegenerate}
            />
          ))
        )}
        <div ref={endRef} className="aa-chat-end" />
      </div>

      {showJump && (
        <button
          type="button"
          className="aa-chat-jump"
          onClick={() => endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })}
          aria-label={t('chat.jump')}
        >
          <IconArrowDown size={15} aria-hidden />
        </button>
      )}

      <form
        className="aa-chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          className="aa-chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={t('chat.placeholder')}
          aria-label={t('chat.placeholder')}
          rows={1}
        />
        {streaming ? (
          <button type="button" className="aa-chat-send stop" onClick={onStop} aria-label={t('chat.stop')} title={t('chat.stop')}>
            <IconPlayerStop size={16} aria-hidden />
          </button>
        ) : (
          <button type="submit" className="aa-chat-send" disabled={!draft.trim()} aria-label={t('chat.send')} title={t('chat.send')}>
            <IconSend size={16} aria-hidden />
          </button>
        )}
      </form>
    </section>
  );
}
