import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { IconMessageChatbot, IconX } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import type { ChatContextInput } from '../../hooks/useChat';

// Everything heavy (useChat + adapter + Markdown renderer) is behind this lazy import, so the FAB
// is the ONLY chat code in the initial bundle (Blueprint Phase 2.1 — FCP protected).
const ChatMount = lazy(() => import('./ChatMount'));

interface Props {
  contextInput: ChatContextInput;
  /** App registers the mounted chat's reset() so "Start Over" wipes it in-tab. */
  registerReset: (reset: (() => void) | null) => void;
}

// The floating chat launcher (Advisor "Chat Advisor"). Toggles the lazy panel; keeps its own open
// state. Esc closes. Opening never resets chat; closing keeps the session (persisted).
export function ChatFab({ contextInput, registerReset }: Readonly<Props>) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    setEverOpened(true);
  };

  return (
    <div className="aa-chat-root screen-only">
      {/* Mounted once opened, then kept mounted (display-toggled) so the session/stream survives
          closing the panel — closing must not reset the chat (Blueprint Phase 2.2 harmony). */}
      {everOpened && (
        <div style={{ display: open ? 'block' : 'none' }}>
          <Suspense fallback={null}>
            <ChatMount contextInput={contextInput} onClose={() => setOpen(false)} registerReset={registerReset} />
          </Suspense>
        </div>
      )}
      <button
        ref={btnRef}
        type="button"
        data-tour-id="chat-advisor"
        className={'aa-chat-fab' + (open ? ' open' : '')}
        onClick={toggle}
        aria-label={open ? t('chat.close') : t('chat.open')}
        aria-expanded={open}
        title={open ? t('chat.close') : t('chat.open')}
      >
        {open ? <IconX size={22} aria-hidden /> : <IconMessageChatbot size={22} aria-hidden />}
      </button>
    </div>
  );
}

export default ChatFab;
