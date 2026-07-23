import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconArrowLeft, IconArrowRight, IconX, IconCheck } from '@tabler/icons-react';
import { useI18n } from '../../../i18n/I18nContext';
import { renderMarkdown } from '../../../lib/markdown';
import { findTourTarget, type TourId } from '../dataTourId';
import { DosDontsCard } from './DosDontsCard';
import type { CopilotBus } from '../eventBus';
import type { CopilotStepView } from '../types';

interface Props {
  running: boolean;
  step: CopilotStepView | null;
  index: number;
  total: number;
  bus: CopilotBus;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 6;

// The portal overlay (Copilot Phase 2.1). Renders at document.body to escape ALL z-index stacking
// contexts. A box-shadow spotlight rings the target; the card is placed beside it and clamped to the
// visual viewport. ResizeObserver + MutationObserver + scroll/resize + visualViewport keep the ring
// glued to the target (mobile keyboard included) and DESTROY it if the target unmounts (silent
// fallback → the card centers, no ring). Every observer/listener is cleaned up (zero leaks).
export function CopilotOverlay({ running, step, index, total, bus, onNext, onPrev, onStop }: Readonly<Props>) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<TourId | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardH, setCardH] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Measure the real card height so desktop placement can keep the WHOLE card on screen.
  useLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [step, rect, activeId]);

  // Bus subscription: highlight → track a target; dismiss/stop → drop the ring. Cleaned on unmount.
  useEffect(() => {
    const off = bus.on((cmd) => {
      if (cmd.type === 'highlight') setActiveId(cmd.target);
      else setActiveId(null); // dismiss | stop
    });
    return off;
  }, [bus]);

  // (No separate !running sync needed: every stop/reset path emits {stop} on the bus, which the
  // subscription above already turns into setActiveId(null).)

  // Track the active target's rect against every source of movement; destroy on unmount.
  const measure = useCallback(() => {
    if (!activeId) {
      setRect(null);
      return;
    }
    const el = findTourTarget(activeId);
    if (!el) {
      setRect(null); // silent fallback — target gone
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [activeId]);

  useEffect(() => {
    // Initial measure is deferred to a paint frame (never a synchronous set in the effect body).
    const raf = requestAnimationFrame(measure);
    if (!activeId) return () => cancelAnimationFrame(raf);
    const el = findTourTarget(activeId);
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    // Recompute on layout shifts + destroy if the target is removed from the DOM.
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', measure);
    vv?.addEventListener('scroll', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
      vv?.removeEventListener('resize', measure);
      vv?.removeEventListener('scroll', measure);
    };
  }, [activeId, measure]);

  // Esc stops the tour; focus the card when a step opens (a11y).
  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onStop();
    };
    window.addEventListener('keydown', onKey);
    cardRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [running, index, onStop]);

  if (!running || !step) return null;

  const vw = window.visualViewport?.width ?? window.innerWidth;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  // Phones: the card is a bottom SHEET (always fully visible, never clipped) — CSS positions it.
  const sheet = vw <= 640;
  const cardW = Math.min(340, vw - 24);
  const h = cardH || 320; // measured card height (fallback until first layout)

  // Desktop: anchor near the ring, but ALWAYS clamp the whole card inside the viewport using its
  // real height — prefer below, flip above if it won't fit, else clamp. Never runs off-screen.
  let cardStyle: React.CSSProperties = { width: cardW, maxWidth: cardW };
  if (!sheet && rect) {
    const cx = rect.left + rect.width / 2 - cardW / 2;
    const belowTop = rect.top + rect.height + 12;
    const aboveTop = rect.top - h - 12;
    // A "left"/"right" step only gets a side placement if there's genuinely room for it — a target
    // that spans nearly the full row (e.g. a wide section header) has none, and forcing the card
    // there would land it directly ON TOP of the target instead of beside it (the "kepotong" bug on
    // wide viewports). Fall back to the same below/above logic as any other placement.
    const wantsLeft = step.placement === 'left';
    const wantsRight = step.placement === 'right';
    const sideFits = wantsLeft ? rect.left - 12 >= cardW + 14 : wantsRight ? vw - (rect.left + rect.width) - 12 >= cardW + 14 : false;
    let top: number;
    let left = cx;
    if (sideFits) {
      left = wantsLeft ? rect.left - cardW - 14 : rect.left + rect.width + 14;
      top = rect.top;
    } else if (step.placement === 'top' && aboveTop >= 12) {
      top = aboveTop;
    } else if (belowTop + h <= vh - 12) {
      top = belowTop;
    } else if (aboveTop >= 12) {
      top = aboveTop;
    } else {
      top = (vh - h) / 2;
    }
    cardStyle = {
      ...cardStyle,
      left: clamp(left, 12, Math.max(12, vw - cardW - 12)),
      top: clamp(top, 12, Math.max(12, vh - h - 12)),
    };
  } else if (!sheet) {
    cardStyle = { ...cardStyle, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  }

  const last = index === total - 1;

  return createPortal(
    <div className="aa-cop-portal">
      {rect ? (
        <div
          className="aa-cop-spot"
          style={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
          aria-hidden
        />
      ) : (
        <div className="aa-cop-scrim" aria-hidden />
      )}
      <div
        ref={cardRef}
        className={'aa-cop-card aa-glass' + (sheet ? ' sheet' : '')}
        style={cardStyle}
        role="dialog"
        aria-label={step.title}
        aria-modal="false"
        tabIndex={-1}
      >
        <div className="aa-cop-head">
          <span className="aa-cop-step">
            {index + 1}/{total}
          </span>
          <button type="button" className="aa-ctl-icon" onClick={onStop} aria-label={t('copilot.close')} title={t('copilot.close')}>
            <IconX size={15} aria-hidden />
          </button>
        </div>
        {/* Only this middle region scrolls — the header + footer stay pinned, so the step counter,
            close, and Back/Next are NEVER clipped on any viewport height (responsive, no cut-off). */}
        <div className="aa-cop-scroll">
          <h3 className="aa-cop-title">{step.title}</h3>
          <div className="aa-cop-body learn-prose">{renderMarkdown(step.body)}</div>
          {!rect && <p className="aa-cop-offscreen">{t('copilot.offscreen')}</p>}
          {(step.dos.length > 0 || step.donts.length > 0) && (
            <div className="aa-cop-rules-wrap">
              <DosDontsCard kind="do" label={t('copilot.dos')} items={step.dos} />
              <DosDontsCard kind="dont" label={t('copilot.donts')} items={step.donts} />
            </div>
          )}
        </div>
        <div className="aa-cop-foot">
          <button type="button" className="f-btn" onClick={onPrev} disabled={index === 0}>
            <IconArrowLeft size={14} aria-hidden />
            {t('copilot.back')}
          </button>
          <button type="button" className="aa-export-btn primary" onClick={onNext}>
            {last ? t('copilot.done') : t('copilot.next')}
            {last ? <IconCheck size={14} aria-hidden /> : <IconArrowRight size={14} aria-hidden />}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
