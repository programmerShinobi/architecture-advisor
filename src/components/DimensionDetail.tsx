import {
  IconAffiliate,
  IconArrowsShuffle,
  IconArrowDown,
  IconBulb,
  IconDatabase,
  IconLayoutGrid,
  IconMessageCircle,
  IconScale,
  IconShieldCheck,
  IconStack2,
  IconThumbDown,
  IconThumbUp,
  type Icon,
} from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { DIMENSIONS } from '../config/dimensions';
import { DIM_NARRATIVE, OPTION_BLURB } from '../config/dimensionContent';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import { contributions, displayScore } from '../lib/scoring';
import type { DimensionId, RankedOption, Weights } from '../types';

const DIM_ICON: Record<DimensionId, Icon> = {
  D1: IconAffiliate,
  D2: IconArrowsShuffle,
  D3: IconDatabase,
  D4: IconStack2,
  D5: IconLayoutGrid,
};

interface Props {
  dim: DimensionId;
  ranked: RankedOption[];
  weights: Weights;
}

export function DimensionDetail({ dim, ranked, weights }: Props) {
  const { t, tr, lang } = useI18n();
  const dimension = DIMENSIONS[dim];
  const top = ranked[0];
  const topScore = displayScore(top.score);
  const robust = topScore - displayScore(ranked[1].score) >= 8;
  const DimIcon = DIM_ICON[dim];
  const narrative = DIM_NARRATIVE[dim];
  const topOption = dimension.options.find((o) => o.id === top.id) ?? dimension.options[0];
  const blurb = OPTION_BLURB[`${dim}:${top.id}`];

  const contrib = contributions(weights, topOption.qaFit)
    .filter((c) => c.points > 0)
    .slice(0, 4);
  const maxPts = Math.max(...contrib.map((c) => c.points), 0.001);

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
        <span className="guided-only">{tr(dimension.guidedLabel)}</span>
        <span className="expert-only">{tr(dimension.name)}</span>
      </div>

      <div style={{ border: '2px solid var(--color-border-info)', background: 'var(--color-background-info)', borderRadius: 'var(--border-radius-md)', padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px', flexWrap: 'wrap', gap: '7px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <DimIcon size={20} style={{ color: 'var(--color-text-info)' }} aria-hidden />
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-info)' }}>{top.name}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '11px', background: 'var(--color-text-info)', color: 'var(--color-background-primary)', padding: '2px 9px', borderRadius: '99px' }}>
              {t('detail.bestFit')}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-info)', border: '0.5px solid var(--color-border-info)', padding: '2px 9px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {robust ? <IconShieldCheck size={12} aria-hidden /> : <IconScale size={12} aria-hidden />}
              {robust ? t('detail.robust') : t('detail.closeCall')}
            </span>
            <span className="num" style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-info)' }}>
              {topScore}%
            </span>
          </span>
        </div>

        {blurb && (
          <div style={{ fontSize: '13px', color: 'var(--color-text-info)', lineHeight: 1.55 }}>
            <span className="guided-only">{tr(blurb.plain)}.</span>
            <span className="expert-only">{tr(blurb.expert)}.</span>
          </div>
        )}

        {/* Guided: what this means for you */}
        <div className="guided-only" style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginTop: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <IconMessageCircle size={15} style={{ color: 'var(--color-text-info)' }} aria-hidden />
            {t('detail.means')}
          </div>
          {([
            [IconThumbUp, 'var(--color-text-success)', t('detail.good'), narrative.good],
            [IconThumbDown, 'var(--color-text-warning)', t('detail.cost'), narrative.cost],
            [IconBulb, 'var(--color-text-info)', t('detail.know'), narrative.know],
          ] as const).map(([Ic, color, label, text], i) => (
            <div key={i} style={{ display: 'flex', gap: '9px', marginBottom: i < 2 ? '9px' : 0 }}>
              <Ic size={16} style={{ color, marginTop: '1px', flex: 'none' }} aria-hidden />
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{label}</span> {tr(text)}.
              </span>
            </div>
          ))}
        </div>

        {/* Expert: top contributing attributes (live) */}
        <div className="expert-only" style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginTop: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '9px' }}>{t('detail.contrib')}</div>
          {contrib.map((c) => (
            <div key={c.qa} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 38px', alignItems: 'center', gap: '9px', marginBottom: '7px' }}>
              <span style={{ fontSize: '12px' }}>{QUALITY_ATTRIBUTES[c.qa].name[lang]}</span>
              <div style={{ height: '6px', background: 'var(--color-background-tertiary)', borderRadius: '99px' }}>
                <div style={{ height: '100%', width: `${(c.points / maxPts) * 100}%`, background: '#1D9E75', borderRadius: '99px' }} />
              </div>
              <span className="num" style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
                {c.points.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {dim === 'D1' && (
          <div style={{ fontSize: '11px', color: 'var(--color-text-info)', marginTop: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <IconArrowDown size={13} aria-hidden /> {t('detail.radarNote')}
          </div>
        )}
      </div>

      {/* Non-top options (for non-D1 dimensions, mirroring the prototype) */}
      {dim !== 'D1' && (
        <div style={{ marginTop: '9px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ranked.slice(1).map((o) => {
            const s = displayScore(o.score);
            const b = OPTION_BLURB[`${dim}:${o.id}`];
            return (
              <div key={o.id} className="f-row" style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '11px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px' }}>{o.name}</span>
                  <span className="num" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{s}%</span>
                </div>
                {b && <div className="f-gloss" style={{ marginBottom: '6px' }}>{tr(b.plain)}</div>}
                <div style={{ height: '6px', background: 'var(--color-background-tertiary)', borderRadius: '99px' }}>
                  <div style={{ height: '100%', width: `${s}%`, background: 'var(--color-border-secondary)', borderRadius: '99px' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
