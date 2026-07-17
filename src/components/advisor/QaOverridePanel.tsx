import { IconAdjustmentsHorizontal, IconLock, IconWand } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../../config/qualityAttributes';
import { roundWeights, type Overrides } from '../../lib/scoring';
import type { QaId, Weights } from '../../types';

interface Props {
  weights: Weights;
  overrides: Overrides;
  onChange: (next: Overrides) => void;
}

// Expert mode: override any QA weight directly (which locks it); unlocked weights share the
// remainder, proportional to the factor-derived values (ATAM-style stakeholder prioritization).
// Fase 2c redesign (owner feedback): plain-language header + modern sliders synced with the
// number inputs, so even newcomers read it as "the adjuster" — and it opens directly under the
// priorities card. Test contract preserved: spinbutton per QA name, "Unlock", "Clear all overrides".
export function QaOverridePanel({ weights, overrides, onChange }: Readonly<Props>) {
  const { t, tr } = useI18n();
  const rounded = roundWeights(weights);

  const setOverride = (q: QaId, raw: string) => {
    const v = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
    onChange({ ...overrides, [q]: v });
  };
  const unlock = (q: QaId) => {
    const next = { ...overrides };
    delete next[q];
    onChange(next);
  };

  const hasLocks = Object.keys(overrides).length > 0;

  return (
    <section aria-labelledby="override-heading" className="aa-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <h2 id="override-heading" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '14.5px', fontWeight: 600, margin: 0 }}>
          <IconAdjustmentsHorizontal size={16} style={{ color: 'var(--color-text-info)' }} aria-hidden />
          {t('override.heading')}
        </h2>
        {hasLocks && (
          <button type="button" onClick={() => onChange({})} className="f-chip" style={{ color: 'var(--color-text-info)', fontSize: '11.5px' }}>
            {t('override.clear')}
          </button>
        )}
      </div>
      <p style={{ margin: '6px 0 10px', fontSize: '12.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{t('override.intro')}</p>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '4px' }}>
        {QA_ORDER.map((q) => {
          const locked = overrides[q] !== undefined;
          const value = locked ? (overrides[q] as number) : rounded[q];
          const name = tr(QUALITY_ATTRIBUTES[q].name);
          return (
            <li
              key={q}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) auto auto',
                alignItems: 'center',
                gap: '4px 10px',
                padding: '7px 10px',
                borderRadius: 'var(--border-radius-md)',
                background: locked ? 'var(--color-background-info)' : 'transparent',
              }}
            >
              <span style={{ fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: locked ? 600 : 400 }}>
                {name}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={value}
                  aria-label={name}
                  onChange={(e) => setOverride(q, e.target.value)}
                  className="no-spin"
                  style={{
                    width: '46px',
                    textAlign: 'right',
                    fontSize: '12.5px',
                    fontVariantNumeric: 'tabular-nums',
                    padding: '3px 6px',
                    borderRadius: 'var(--border-radius-md)',
                    outline: 'none',
                    border: `1px solid ${locked ? 'var(--color-border-info)' : 'var(--color-border-secondary)'}`,
                    background: 'transparent',
                    color: locked ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                    fontWeight: locked ? 600 : 400,
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>%</span>
              </span>
              <span style={{ width: '70px', textAlign: 'right' }}>
                {locked ? (
                  <button type="button" onClick={() => unlock(q)} className="f-chip" style={{ fontSize: '10.5px', padding: '3px 9px', display: 'inline-flex', gap: '4px' }}>
                    <IconLock size={11} aria-hidden />
                    {t('override.unlock')}
                  </button>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--color-text-tertiary)' }}>
                    <IconWand size={11} aria-hidden />
                    {t('override.auto')}
                  </span>
                )}
              </span>
              {/* Modern slider — the same value, draggable; calm accent via accent-color. */}
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                aria-label={`${name} — slider`}
                onChange={(e) => setOverride(q, e.target.value)}
                className="aa-range"
                style={{ gridColumn: '1 / -1' }}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
