import { useEffect, useRef } from 'react';
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import type { DictKey } from '../../i18n/dict';
import { HeroRadar } from './HeroRadar';
import { DIMENSIONS } from '../../config/dimensions';
import type { DimensionId } from '../../types';

// The landing / home page (Aurora Slate) — mirrors the composition of prototype-v2/preview-modern.html
// (hero → pattern bento → how it works), but data-driven from the real model and bilingual via the
// dict. CTAs lead into the Advisor; pattern cards deep-link into the Insights Catalog. The engine,
// Insights, and tests are untouched — this is a new front door, not a rewrite.

interface Props {
  onStart: () => void;
  onOpenInsights: () => void;
  onOpenArch: (dim: DimensionId, optId: string) => void;
}

// Real architectures featured on the landing SLIDER (names come from the frozen model; the short
// blurb is a bilingual dict string). Six uniform slides — snap-scrolled, arrow-navigable.
type ArtKind = 'spark' | 'nodes' | 'modules' | 'bolt' | 'mesh' | 'hex';

const FEATURED: {
  dim: DimensionId;
  optId: string;
  tag: string;
  blurbKey: DictKey;
  art: ArtKind;
  popular?: boolean;
}[] = [
  { dim: 'D2', optId: 'event-driven', tag: 'SYS-01', art: 'spark', popular: true, blurbKey: 'lp.blurb.event-driven' },
  { dim: 'D1', optId: 'modular-monolith', tag: 'SYS-02', art: 'modules', blurbKey: 'lp.blurb.modular-monolith' },
  { dim: 'D1', optId: 'serverless', tag: 'SYS-03', art: 'bolt', blurbKey: 'lp.blurb.serverless' },
  { dim: 'D3', optId: 'cqrs', tag: 'SYS-04', art: 'nodes', blurbKey: 'lp.blurb.cqrs' },
  { dim: 'D1', optId: 'microservices', tag: 'SYS-05', art: 'mesh', blurbKey: 'lp.blurb.microservices' },
  { dim: 'D4', optId: 'hexagonal', tag: 'SYS-06', art: 'hex', blurbKey: 'lp.blurb.hexagonal' },
];

const nameOf = (dim: DimensionId, optId: string) => DIMENSIONS[dim].options.find((o) => o.id === optId)?.name;

// Symbolic art per pattern (owner request: every card gets an image that REPRESENTS its title,
// like the event-driven bars). Calm theme-aware colors — never louder than the copy.
function CardArt({ kind }: Readonly<{ kind: ArtKind }>) {
  const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
  const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
  if (kind === 'spark') {
    return (
      <span className="lp-spark">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  }
  if (kind === 'nodes') {
    // CQRS: a write path splitting into read replicas (data flows along the lines).
    return (
      <svg className="lp-art lp-art-nodes" viewBox="0 0 300 90" aria-hidden>
        <line x1="40" y1="45" x2="120" y2="20" {...S} />
        <line x1="40" y1="45" x2="120" y2="70" {...S} />
        <line x1="120" y1="20" x2="200" y2="45" {...S} />
        <line x1="120" y1="70" x2="200" y2="45" {...S} />
        <line x1="200" y1="45" x2="266" y2="45" {...S} />
        {[[40, 45], [120, 20], [120, 70], [200, 45], [266, 45]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" {...F} />
        ))}
      </svg>
    );
  }
  if (kind === 'modules') {
    // Modular monolith: one container, firm module boundaries inside (the active module glows).
    return (
      <svg className="lp-art lp-art-modules" viewBox="0 0 300 90" aria-hidden>
        <rect x="70" y="10" width="160" height="70" rx="12" {...S} />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => (
            <rect key={`${c}-${r}`} className={c === 1 && r === 0 ? 'hl' : undefined} x={84 + c * 46} y={20 + r * 28} width="38" height="22" rx="6" {...(c === 1 && r === 0 ? F : S)} />
          )),
        )}
      </svg>
    );
  }
  if (kind === 'bolt') {
    // Serverless: functions firing on demand (staggered flicker).
    return (
      <svg className="lp-art lp-art-bolt" viewBox="0 0 300 90" aria-hidden>
        {[110, 150, 190].map((x, i) => (
          <polygon key={x} points={`${x},14 ${x - 14},50 ${x - 2},50 ${x - 10},76 ${x + 12},40 ${x},40`} {...F} transform={i === 1 ? '' : 'translate(0 4) scale(0.96)'} />
        ))}
      </svg>
    );
  }
  if (kind === 'mesh') {
    // Microservices: small autonomous services, loosely meshed (nodes breathe).
    const pts: [number, number][] = [[90, 26], [150, 16], [210, 30], [110, 66], [178, 62], [242, 58]];
    const links = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
    return (
      <svg className="lp-art lp-art-mesh" viewBox="0 0 300 90" aria-hidden>
        {links.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} {...S} opacity={0.45} />
        ))}
        {pts.map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r={i === 1 ? 9 : 7} {...F} />
        ))}
      </svg>
    );
  }
  // hex — Hexagonal: ports & adapters around a protected core (the ring slowly turns).
  return (
    <svg className="lp-art lp-art-hex" viewBox="0 0 300 90" aria-hidden>
      <g className="ring">
        <polygon points={hexPts(150, 45, 36)} {...S} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          return <circle key={i} cx={150 + 36 * Math.cos(a)} cy={45 + 36 * Math.sin(a)} r="3.4" fill="var(--color-text-info)" opacity="0.55" />;
        })}
      </g>
      <polygon points={hexPts(150, 45, 22)} {...F} />
      <circle className="core" cx="150" cy="45" r="5" fill="var(--color-text-info)" opacity="0.85" />
    </svg>
  );
}

// Shared pentagon/hexagon point helper.
const hexPts = (cx: number, cy: number, r: number, sides = 6) =>
  Array.from({ length: sides }, (_, i) => {
    const a = ((Math.PI * 2) / sides) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

// Symbolic art for the three "how it works" steps (owner request: same visual language as the
// Pattern Library cards) — 1 answer the questions · 2 weights derive · 3 the recommendation.
function StepArt({ step }: Readonly<{ step: 's1' | 's2' | 's3' }>) {
  const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
  const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
  if (step === 's1') {
    // A factor question: label + 3-level segmented control (the chosen level glows).
    return (
      <svg className="lp-art lp-art-form" viewBox="0 0 300 90" aria-hidden>
        <rect x="70" y="16" width="92" height="7" rx="3.5" fill="var(--color-text-info)" opacity="0.35" />
        <rect x="70" y="36" width="160" height="26" rx="8" {...S} />
        <rect className="hl" x="124" y="40" width="50" height="18" rx="6" {...F} />
        <rect x="70" y="72" width="60" height="7" rx="3.5" fill="var(--color-text-info)" opacity="0.22" />
      </svg>
    );
  }
  if (step === 's2') {
    // Derived priorities: weight bars settling into place.
    return (
      <svg className="lp-art lp-art-weights" viewBox="0 0 300 90" aria-hidden>
        {[[16, 150], [36, 108], [56, 72], [76, 44]].map(([y, w], i) => (
          <g key={y}>
            <rect x="70" y={y} width="160" height="10" rx="5" fill="var(--color-text-info)" opacity="0.12" />
            <rect className={`bar b${i}`} x="70" y={y} width={w} height="10" rx="5" fill="var(--color-text-info)" opacity="0.55" />
          </g>
        ))}
      </svg>
    );
  }
  // s3: the recommendation — a mini radar with one lit pick.
  return (
    <svg className="lp-art lp-art-pick" viewBox="0 0 300 90" aria-hidden>
      <polygon points={hexPts(150, 47, 34, 5)} {...S} />
      <polygon points={hexPts(150, 47, 20, 5)} {...F} />
      <circle className="core" cx="150" cy="13" r="5.5" fill="var(--color-text-info)" opacity="0.85" />
      <line x1="150" y1="47" x2="150" y2="13" {...S} opacity={0.5} />
    </svg>
  );
}

export function LandingView({ onStart, onOpenInsights, onOpenArch }: Readonly<Props>) {
  const { t } = useI18n();
  const howRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Scroll a snap slider by one card (width + gap); snap handles the final alignment.
  const slideEl = (el: HTMLDivElement | null, dir: 1 | -1) => {
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.lp-card, .lp-step');
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  const slide = (dir: 1 | -1) => slideEl(sliderRef.current, dir);
  const slideSteps = (dir: 1 | -1) => slideEl(stepsRef.current, dir);

  // Reveal-on-scroll for the landing sections (shares the app's `.aa-reveal` utility). Instant under
  // reduced-motion / without IntersectionObserver, so content is never left hidden.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.aa-landing .aa-reveal:not(.in)'));
    if (els.length === 0) return;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="aa-landing">
      {/* ---------- HERO ---------- */}
      <section className="lp-hero">
        <div>
          <span className="lp-eyebrow">
            {t('lp.eyebrow.a')} · <b>{t('lp.eyebrow.b')}</b>
          </span>
          <h1 className="lp-h1">
            {t('lp.h1.pre')}
            <span className="lp-grad">{t('lp.h1.grad')}</span>
            {t('lp.h1.post')}
          </h1>
          <p className="lp-lede">
            <span className="guided-only">{t('lp.lede')}</span>
            <span className="expert-only">{t('lp.lede.x')}</span>
          </p>
          <div className="lp-actions">
            <button type="button" className="lp-btn lp-btn-primary" onClick={onStart}>
              {t('lp.cta.start')}
              <IconArrowRight size={16} aria-hidden />
            </button>
            <button type="button" className="lp-btn lp-btn-ghost" onClick={() => howRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              {t('lp.cta.how')}
            </button>
          </div>
          <div className="lp-meta">
            <div>
              <b>5</b>
              {t('lp.meta.dims')}
            </div>
            <div>
              <b>25010</b>
              {t('lp.meta.iso')}
            </div>
            <div>
              <b>100%</b>
              {t('lp.meta.client')}
            </div>
          </div>
        </div>
        <HeroRadar />
      </section>

      {/* ---------- PATTERN BENTO ---------- */}
      <section className="lp-section">
        <div className="lp-sec-head aa-reveal">
          <div>
            <span className="lp-kicker">{t('lp.patterns.kicker')}</span>
            <h2>{t('lp.patterns.h2')}</h2>
            <p>{t('lp.patterns.sub')}</p>
          </div>
          <button type="button" className="lp-btn lp-btn-ghost" onClick={onOpenInsights}>
            {t('lp.patterns.all')}
            <IconArrowRight size={15} aria-hidden />
          </button>
        </div>

        {/* Modern snap slider (Fase 2c): swipe on touch, arrows on fine pointers, edge fades. */}
        <div className="lp-slider-wrap">
          <button type="button" className="lp-slider-btn prev" onClick={() => slide(-1)} aria-label={t('lp.slider.prev')}>
            <IconChevronLeft size={18} aria-hidden />
          </button>
          <button type="button" className="lp-slider-btn next" onClick={() => slide(1)} aria-label={t('lp.slider.next')}>
            <IconChevronRight size={18} aria-hidden />
          </button>
          <div className="lp-slider" ref={sliderRef} aria-label={t('lp.patterns.h2')}>
          {FEATURED.map((f) => {
            const name = nameOf(f.dim, f.optId);
            if (!name) return null;
            return (
              <button
                key={`${f.dim}:${f.optId}`}
                type="button"
                className="lp-card aa-reveal"
                onClick={() => onOpenArch(f.dim, f.optId)}
              >
                <span className="lp-card-art" aria-hidden>
                  <CardArt kind={f.art} />
                </span>
                <span className="lp-tag">
                  {f.tag}
                  {f.popular ? ` · ${t('lp.tag.popular')}` : ''}
                </span>
                <span className="lp-card-title">{name}</span>
                <span className="lp-card-p">{t(f.blurbKey)}</span>
                <span className="lp-card-link">
                  {t('lp.card.learn')}
                  <IconArrowRight size={14} aria-hidden />
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="lp-section" ref={howRef}>
        <div className="lp-sec-head aa-reveal">
          <div>
            <span className="lp-kicker">{t('lp.how.kicker')}</span>
            <h2>{t('lp.how.h2')}</h2>
          </div>
        </div>
        {/* Grid on desktop; a swipe slider on phones & tablets WITH arrow hints (Fase 2e,
            owner: the arrows tell users the cards can be swiped). The arrows only exist in
            slider mode (hidden ≥1025px via .lp-steps-btn). */}
        <div className="lp-slider-wrap">
          <button type="button" className="lp-slider-btn lp-steps-btn prev" onClick={() => slideSteps(-1)} aria-label={t('lp.slider.prev')}>
            <IconChevronLeft size={18} aria-hidden />
          </button>
          <button type="button" className="lp-slider-btn lp-steps-btn next" onClick={() => slideSteps(1)} aria-label={t('lp.slider.next')}>
            <IconChevronRight size={18} aria-hidden />
          </button>
          <div className="lp-steps" ref={stepsRef}>
            {(['s1', 's2', 's3'] as const).map((s) => (
              <div key={s} className="lp-step aa-reveal">
                <span className="lp-card-art lp-step-art" aria-hidden>
                  <StepArt step={s} />
                </span>
                <h3>{t(`lp.how.${s}.h`)}</h3>
                <p>
                  <span className="guided-only">{t(`lp.how.${s}.p`)}</span>
                  <span className="expert-only">{t(`lp.how.${s}.px`)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
