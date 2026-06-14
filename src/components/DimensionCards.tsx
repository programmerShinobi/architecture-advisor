import { useI18n } from '../i18n/I18nContext';
import { DIMENSIONS, DIMENSION_ORDER } from '../config/dimensions';
import type { DimensionId, RankedOption } from '../types';

interface Props {
  rankings: Record<DimensionId, RankedOption[]>;
  current: DimensionId;
  onSelect: (dim: DimensionId) => void;
}

// The 5 numbered dimension cards; selecting one drives the detail panel + radar focus.
export function DimensionCards({ rankings, current, onSelect }: Props) {
  const { t, tr } = useI18n();
  return (
    <>
      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '10px' }}>
        {t('results.pickLayer')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '10px' }}>
        {DIMENSION_ORDER.map((dim, i) => {
          const on = dim === current;
          const top = rankings[dim][0];
          return (
            <button
              key={dim}
              type="button"
              className={'f-dim' + (on ? ' on' : '')}
              aria-pressed={on}
              onClick={() => onSelect(dim)}
              style={{ textAlign: 'left', background: on ? undefined : 'transparent' }}
            >
              <span className="dim-no">{i + 1}</span>
              <div style={{ fontSize: '11px', marginTop: '7px', color: on ? 'var(--color-text-info)' : 'var(--color-text-tertiary)' }}>
                <span className="guided-only">{tr(DIMENSIONS[dim].guidedLabel)}</span>
                <span className="expert-only">{tr(DIMENSIONS[dim].name)}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.3, color: on ? 'var(--color-text-info)' : 'var(--color-text-primary)' }}>
                {top.name}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
