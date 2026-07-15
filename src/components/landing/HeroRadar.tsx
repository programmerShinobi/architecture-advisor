import { useI18n } from '../../i18n/I18nContext';
import { PRESETS } from '../../config/presets';
import { rank, displayScore } from '../../lib/scoring';

/**
 * Decorative 5-dimension radar motif for the landing hero (Aurora Slate signature #2), mirroring
 * `prototype-v2/preview-modern.html`. Static and `role="img"` — it's brand art, NOT the app's
 * functional 12-attribute RadarPanel. Gradient ids are landing-scoped (`lp-…`) to stay unique.
 *
 * The floating badges are NOT mockup text: they show the frozen engine's real communication-style
 * (D2) recommendation + fit score for the "busy online shop" preset — the same architecture the
 * landing's featured pattern card highlights. Computed once at module load (pure, deterministic).
 */
const HERO_PRESET = PRESETS.find((p) => p.id === 'high-traffic-ecommerce');
const HERO_TOP = HERO_PRESET ? rank(HERO_PRESET.levels, 'D2')[0] : undefined;
/** "Event-driven (pub/sub)" → "Event-driven" — the chip is a badge, not a spec. */
const HERO_TOP_NAME = HERO_TOP?.name.split(' (')[0] ?? '';
const HERO_TOP_SCORE = HERO_TOP ? displayScore(HERO_TOP.score) : 0;

export function HeroRadar() {
  const { t, tr } = useI18n();
  return (
    <div className="radar-wrap">
      <div className="radar-card">
        <svg className="radar-svg" viewBox="0 0 272 216" role="img" aria-label={t('lp.radar.aria')}>
          <defs>
            <linearGradient id="lpRadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B7CFF" />
              <stop offset="100%" stopColor="#38E1FF" />
            </linearGradient>
          </defs>
          {/* grid pentagon 3 rings, centre (136,104), R = 70 / 46.9 / 23.4 */}
          <polygon className="radar-grid" points="136,34 202.6,82.4 177.2,160.6 94.8,160.6 69.4,82.4" />
          <polygon className="radar-grid" points="136,57.1 180.6,89.5 163.6,141.9 108.4,141.9 91.4,89.5" />
          <polygon className="radar-grid" points="136,80.6 158.3,96.8 149.8,122.9 122.2,122.9 113.7,96.8" />
          <line className="radar-axis" x1="136" y1="104" x2="136" y2="34" />
          <line className="radar-axis" x1="136" y1="104" x2="202.6" y2="82.4" />
          <line className="radar-axis" x1="136" y1="104" x2="177.2" y2="160.6" />
          <line className="radar-axis" x1="136" y1="104" x2="94.8" y2="160.6" />
          <line className="radar-axis" x1="136" y1="104" x2="69.4" y2="82.4" />
          <line className="radar-sweep" x1="136" y1="104" x2="136" y2="34" stroke="url(#lpRadGrad)" strokeWidth="1.5" />
          <polygon className="radar-shape" points="136,44.5 182.6,88.9 160.7,138 103.9,148.2 92.1,89.7" style={{ stroke: 'url(#lpRadGrad)' }} />
          {[
            [136, 44.5],
            [182.6, 88.9],
            [160.7, 138],
            [103.9, 148.2],
            [92.1, 89.7],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} className="radar-pt" cx={cx} cy={cy} r="3.4" style={{ stroke: 'url(#lpRadGrad)' }} />
          ))}
          <text className="radar-label" x="136" y="20" textAnchor="middle">DEPLOYMENT</text>
          <text className="radar-label" x="210" y="86" textAnchor="start">COMMS</text>
          <text className="radar-label" x="178" y="182" textAnchor="middle">DATA</text>
          <text className="radar-label" x="94" y="182" textAnchor="middle">SCALING</text>
          <text className="radar-label" x="62" y="86" textAnchor="end">DELIVERY</text>
        </svg>
      </div>
      <div className="radar-chip chip-a" title={HERO_PRESET ? tr(HERO_PRESET.label) : undefined}>
        <span className="dot" style={{ background: '#7CF5C8' }} />
        {t('lp.chip.fit')} · {HERO_TOP_SCORE} / 100
      </div>
      <div className="radar-chip chip-b" title={HERO_PRESET ? tr(HERO_PRESET.label) : undefined}>
        <span className="dot" style={{ background: '#8B7CFF' }} />
        {HERO_TOP_NAME} · {t('lp.chip.rec')}
      </div>
    </div>
  );
}
