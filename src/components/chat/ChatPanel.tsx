import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { IconSend, IconPlayerStop, IconRotate2, IconX, IconSparkles, IconArrowDown, IconHelpCircle, IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { ChatMessageItem } from './ChatMessageItem';
import { CHAT_TOPICS } from './chatTopics';
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
  const { t, tr } = useI18n();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  // Capability browser: `browsing` is the explicit toggle, `openTopic` the drilled-in category
  // (two levels — showing all ~27 intents at once is the overwhelm this is meant to cure).
  const [browsing, setBrowsing] = useState(false);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const showBrowser = browsing && !streaming;

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
    // The browser replaces the transcript in this scroll area, so following the bottom sentinel
    // would drag its opening line out of view — read as clipped text, which it was.
    if (showBrowser) return;
    if (atBottomRef.current) endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages, showBrowser]);

  // Entering the browser, or moving between its two levels, always starts at the top of that list.
  useEffect(() => {
    if (showBrowser) listRef.current?.scrollTo({ top: 0 });
  }, [showBrowser, openTopic]);

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
          {/* The capability browser used to be reachable only by typing "help" — the one thing a
              confused newcomer cannot know. It is now a permanent control, so the depth is
              discoverable at any point in the conversation, not just on an empty panel. */}
          <button
            type="button"
            className={'aa-ctl-icon' + (browsing ? ' on' : '')}
            onClick={() => { setBrowsing((b) => !b); setOpenTopic(null); }}
            title={t('chat.browse')}
            aria-label={t('chat.browse')}
            aria-expanded={browsing}
          >
            <IconHelpCircle size={16} aria-hidden />
          </button>
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
        {showBrowser ? (
          <div className="aa-chat-topics">
            <p className="aa-chat-empty-lead">{t(openTopic ? 'chat.browse.pick' : 'chat.browse.lead')}</p>

            {openTopic === null ? (
              CHAT_TOPICS.map((topic) => {
                const Ic = topic.icon;
                return (
                  <button key={topic.id} type="button" className="aa-chat-topic" onClick={() => setOpenTopic(topic.id)} aria-expanded={false}>
                    <Ic size={17} aria-hidden className="aa-chat-topic-ic" />
                    <span className="aa-chat-topic-txt">
                      <span className="aa-chat-topic-label">{tr(topic.label)}</span>
                      <span className="aa-chat-topic-hint">{tr(topic.hint)}</span>
                    </span>
                    <IconChevronRight size={15} aria-hidden className="aa-chat-topic-go" />
                  </button>
                );
              })
            ) : (
              <>
                <button type="button" className="aa-chat-topic-back" onClick={() => setOpenTopic(null)}>
                  <IconChevronLeft size={14} aria-hidden />
                  {t('chat.browse.back')}
                </button>
                {CHAT_TOPICS.filter((x) => x.id === openTopic).map((topic) =>
                  topic.asks.map((ask) => (
                    <button
                      key={ask.en}
                      type="button"
                      className="aa-chat-ask"
                      onClick={() => { onSend(tr(ask)); setBrowsing(false); setOpenTopic(null); }}
                    >
                      {tr(ask)}
                    </button>
                  )),
                )}
              </>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div className="aa-chat-empty">
            <p className="aa-chat-empty-lead">{t('chat.empty')}</p>
            <div className="aa-chat-sugs">
              {SUGGESTIONS.map((k) => (
                <button key={k} type="button" className="f-chip" onClick={() => onSend(t(k))}>
                  {t(k)}
                </button>
              ))}
            </div>
            {/* The six chips above are a fast start, not the whole menu — say so, or a newcomer
                exhausts them, guesses, hits the fallback and concludes the advisor is stupid. */}
            <button type="button" className="aa-chat-browse-cta" onClick={() => setBrowsing(true)}>
              <IconHelpCircle size={14} aria-hidden />
              {t('chat.browse.cta')}
            </button>
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

      {/* Not while browsing: scrolling that list to the top trips the bottom sentinel, and a
          "jump to latest" control over a topic menu points at nothing. */}
      {showJump && !showBrowser && (
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
