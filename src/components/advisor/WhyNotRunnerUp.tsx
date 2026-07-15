import { IconScale } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { DIMENSIONS } from '../../config/dimensions';
import { QA_ORDER, QUALITY_ATTRIBUTES } from '../../config/qualityAttributes';
import { displayScore, isCloseCall } from '../../lib/scoring';
import type { DimensionId, RankedOption, Weights } from '../../types';

interface Props {
  dim: DimensionId;
  ranked: RankedOption[];
  weights: Weights;
}

// Explains, from the live per-QA contribution gap, why the #1 option beat #2 — and what would
// reverse it. A small, unique transparency touch.
export function WhyNotRunnerUp({ dim, ranked, weights }: Props) {
  const { t, lang } = useI18n();
  if (ranked.length < 2) return null;
  const fmt = (s: string, params: Record<string, string | number>) =>
    Object.entries(params).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), s);

  const opts = DIMENSIONS[dim].options;
  const fitOf = (id: string) => opts.find((o) => o.id === id)?.qaFit ?? [];
  const a = ranked[0], b = ranked[1];
  const fa = fitOf(a.id), fb = fitOf(b.id);

  const deltas = QA_ORDER.map((q, i) => ({ q, d: (weights[q] / 100) * ((fa[i] ?? 3) - (fb[i] ?? 3)) }));
  const favorsTop = deltas.filter((x) => x.d > 0.005).sort((x, y) => y.d - x.d).slice(0, 3);
  const favorsSecond = deltas.filter((x) => x.d < -0.005).sort((x, y) => x.d - y.d)[0];
  const close = isCloseCall(ranked);
  const params = { top: a.name, second: b.name, ts: displayScore(a.score), ss: displayScore(b.score) };

  return (
    <div style={{ marginTop: '9px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', padding: '11px 14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <IconScale size={15} style={{ color: 'var(--color-text-info)' }} aria-hidden />
        {t('why.title')}
      </div>

      {close || favorsTop.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
          {fmt(t('why.tie'), params)}
        </p>
      ) : (
        <>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: '0 0 6px' }}>
            {fmt(t('why.beats'), params)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: favorsSecond ? '8px' : 0 }}>
            {favorsTop.map(({ q, d }) => (
              <span key={q} style={{ fontSize: '11px', background: 'var(--color-background-success)', color: 'var(--color-text-success)', borderRadius: '99px', padding: '3px 9px' }}>
                {QUALITY_ATTRIBUTES[q].name[lang]} +{d.toFixed(2)}
              </span>
            ))}
          </div>
          {favorsSecond && (
            <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', lineHeight: 1.5, margin: 0 }}>
              {fmt(t('why.secondEdge'), { second: b.name, qa: QUALITY_ATTRIBUTES[favorsSecond.q].name[lang] })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
