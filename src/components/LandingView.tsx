import { useEffect, useRef } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import type { DictKey } from '../i18n/dict';
import { HeroRadar } from './HeroRadar';
import { DIMENSIONS } from '../config/dimensions';
import type { DimensionId } from '../types';

// The landing / home page (Aurora Slate) — mirrors the composition of prototype-v2/preview-modern.html
// (hero → pattern bento → how it works), but data-driven from the real model and bilingual via the
// dict. CTAs lead into the Advisor; pattern cards deep-link into the Insights Catalog. The engine,
// Insights, and tests are untouched — this is a new front door, not a rewrite.

interface Props {
  onStart: () => void;
  onOpenInsights: () => void;
  onOpenArch: (dim: DimensionId, optId: string) => void;
}

// Four real architectures featured on the landing (names come from the frozen model; the short
// blurb is a bilingual dict string), matching the prototype's four showcase cards.
const FEATURED: {
  dim: DimensionId;
  optId: string;
  tag: string;
  span: 4 | 2;
  blurbKey: DictKey;
  art?: 'spark' | 'nodes';
  popular?: boolean;
}[] = [
  { dim: 'D2', optId: 'event-driven', tag: 'SYS-01', span: 4, art: 'spark', popular: true, blurbKey: 'lp.blurb.event-driven' },
  { dim: 'D1', optId: 'modular-monolith', tag: 'SYS-02', span: 2, blurbKey: 'lp.blurb.modular-monolith' },
  { dim: 'D1', optId: 'serverless', tag: 'SYS-03', span: 2, blurbKey: 'lp.blurb.serverless' },
  { dim: 'D3', optId: 'cqrs', tag: 'SYS-04', span: 4, art: 'nodes', blurbKey: 'lp.blurb.cqrs' },
];

const nameOf = (dim: DimensionId, optId: string) => DIMENSIONS[dim].options.find((o) => o.id === optId)?.name;

export function LandingView({ onStart, onOpenInsights, onOpenArch }: Readonly<Props>) {
  const { t } = useI18n();
  const howRef = useRef<HTMLElement>(null);

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

        <div className="lp-bento">
          {FEATURED.map((f) => {
            const name = nameOf(f.dim, f.optId);
            if (!name) return null;
            return (
              <button
                key={`${f.dim}:${f.optId}`}
                type="button"
                className={`lp-card aa-reveal lp-c-${f.span}`}
                onClick={() => onOpenArch(f.dim, f.optId)}
              >
                {f.art === 'spark' && (
                  <span className="lp-card-art" aria-hidden>
                    <span className="lp-spark">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </span>
                )}
                {f.art === 'nodes' && (
                  <span className="lp-card-art" aria-hidden>
                    <svg className="lp-nodes" viewBox="0 0 300 90">
                      <line x1="40" y1="45" x2="120" y2="20" />
                      <line x1="40" y1="45" x2="120" y2="70" />
                      <line x1="120" y1="20" x2="200" y2="45" />
                      <line x1="120" y1="70" x2="200" y2="45" />
                      <line x1="200" y1="45" x2="266" y2="45" />
                      <circle cx="40" cy="45" r="9" />
                      <circle cx="120" cy="20" r="9" />
                      <circle cx="120" cy="70" r="9" />
                      <circle cx="200" cy="45" r="9" />
                      <circle cx="266" cy="45" r="9" />
                    </svg>
                  </span>
                )}
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
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="lp-section" ref={howRef}>
        <div className="lp-sec-head aa-reveal">
          <div>
            <span className="lp-kicker">{t('lp.how.kicker')}</span>
            <h2>{t('lp.how.h2')}</h2>
          </div>
        </div>
        <div className="lp-steps">
          {(['s1', 's2', 's3'] as const).map((s) => (
            <div key={s} className="lp-step aa-reveal">
              <h3>{t(`lp.how.${s}.h`)}</h3>
              <p>
                <span className="guided-only">{t(`lp.how.${s}.p`)}</span>
                <span className="expert-only">{t(`lp.how.${s}.px`)}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
