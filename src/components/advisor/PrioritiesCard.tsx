import { IconPencil } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../../config/qualityAttributes';
import { roundWeights } from '../../lib/scoring';
import type { QaId, Weights } from '../../types';

interface Props {
  weights: Weights;
  onAdjust: () => void;
  editing?: boolean;
}

// "What matters most" / "Quality priorities" — the derived QA weights as labelled bars.
export function PrioritiesCard({ weights, onAdjust, editing = false }: Props) {
  const { t, tr } = useI18n();
  const rounded = roundWeights(weights);
  const rows = (QA_ORDER.filter((q) => rounded[q] > 0) as QaId[]).sort((a, b) => rounded[b] - rounded[a]);

  return (
    <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '15px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="f-num">2</span>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            <span className="guided-only">{t('prio.title.g')}</span>
            <span className="expert-only">{t('step2.e')}</span>
          </span>
        </div>
        <button
          type="button"
          className="expert-only f-btn"
          onClick={onAdjust}
          aria-pressed={editing}
          style={
            editing
              ? { background: 'var(--color-text-info)', color: 'var(--color-background-primary)', borderColor: 'var(--color-text-info)' }
              : undefined
          }
        >
          <IconPencil size={13} aria-hidden />
          {editing ? t('prio.adjustDone') : t('prio.adjust')}
        </button>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
        <span className="guided-only">{t('prio.derived.g')}</span>
        <span className="expert-only">{t('prio.derived.e')}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows.map((q, i) => {
          // Top-two priorities in the brand accent, the rest muted — theme-aware tokens (not the
          // pre-reskin hardcoded green/purple) so the bars track the Aurora palette in both themes.
          const color = i < 2 ? 'var(--color-text-info)' : 'var(--color-text-tertiary)';
          return (
            <div key={q}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                <span style={{ fontWeight: 500 }}>
                  <span className="guided-only">{tr(QUALITY_ATTRIBUTES[q].plain)}</span>
                  <span className="expert-only">{tr(QUALITY_ATTRIBUTES[q].name)}</span>
                </span>
                <span className="num" style={{ color: 'var(--color-text-secondary)' }}>
                  {rounded[q]}%
                </span>
              </div>
              <div className="f-gloss" style={{ marginBottom: '5px' }}>
                {tr(QUALITY_ATTRIBUTES[q].gloss)}
              </div>
              <div style={{ height: '8px', background: 'var(--color-background-tertiary)', borderRadius: '99px' }}>
                <div style={{ height: '100%', width: `${rounded[q]}%`, background: color, borderRadius: '99px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
