import { IconX } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { DIMENSIONS, DIMENSION_ORDER } from '../../config/dimensions';
import { FACTORS, FACTOR_ORDER } from '../../config/factors';
import { PRESETS } from '../../config/presets';
import { effectiveWeights, rankWith, displayScore } from '../../lib/scoring';
import { isScenario, type ScenarioState } from '../../lib/scenarioIO';
import type { DimensionId } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  snapA: ScenarioState | null;
  snapB: ScenarioState | null;
  onPinA: () => void;
  onPinB: () => void;
  onClear: () => void;
  onSwap: () => void;
}

// Pin two scenarios and compare the recommendation + scores side by side — a standout
// decision-support feature. Pure: derived from each snapshot via the engine.
export function ScenarioCompare({ open, onClose, snapA: rawA, snapB: rawB, onPinA, onPinB, onClear, onSwap }: Props) {
  const { t, tr, lang } = useI18n();
  if (!open) return null;

  // Defensive: a stale/corrupt snapshot from localStorage (e.g. after a future schema change)
  // is treated as empty instead of crashing the comparison.
  const snapA = isScenario(rawA) ? rawA : null;
  const snapB = isScenario(rawB) ? rawB : null;

  const presetLabel = (s: ScenarioState) => {
    const p = PRESETS.find((x) => JSON.stringify(x.levels) === JSON.stringify(s.levels));
    return p ? tr(p.label) : t('compare.custom');
  };
  const topPick = (s: ScenarioState, dim: DimensionId) => {
    const w = effectiveWeights(s.levels, s.overrides);
    const r = rankWith(w, dim)[0];
    return { name: r.name, score: displayScore(r.score) };
  };
  const factorDiffs = () => {
    if (!snapA || !snapB) return [];
    return FACTOR_ORDER.filter((f) => (snapA.levels[f] ?? 0) !== (snapB.levels[f] ?? 0)).map((f) => ({
      label: tr(FACTORS[f].label),
      a: tr(FACTORS[f].levels[snapA.levels[f] ?? 0]),
      b: tr(FACTORS[f].levels[snapB.levels[f] ?? 0]),
    }));
  };

  const btn = 'f-btn';
  const both = snapA && snapB;
  const diffs = factorDiffs();

  return (
    <div className="f-ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label={t('compare.title')} style={{ width: '100%', maxWidth: '720px', maxHeight: '85vh', overflow: 'auto', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 12px 40px rgba(0,0,0,.25)' }}>
        <div style={{ position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>{t('compare.title')}</span>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }}>
            <IconX size={18} aria-hidden />
          </button>
        </div>

        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            <button type="button" className={btn} onClick={onPinA}>{t('compare.pinA')}</button>
            <button type="button" className={btn} onClick={onPinB}>{t('compare.pinB')}</button>
            {both && <button type="button" className={btn} onClick={onSwap}>{t('compare.swap')}</button>}
            {(snapA || snapB) && <button type="button" className={btn} onClick={onClear}>{t('compare.clear')}</button>}
          </div>

          {!both ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t('compare.empty')}</p>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', textAlign: 'left' }}>
                    <th style={{ padding: '6px 8px', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>{t('compare.dimension')}</th>
                    <th style={{ padding: '6px 8px', fontWeight: 500 }}>A · {presetLabel(snapA)}</th>
                    <th style={{ padding: '6px 8px', fontWeight: 500 }}>B · {presetLabel(snapB)}</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMENSION_ORDER.map((dim) => {
                    const a = topPick(snapA, dim), b = topPick(snapB, dim);
                    const differ = a.name !== b.name;
                    return (
                      <tr key={dim} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', background: differ ? 'var(--color-background-info)' : undefined }}>
                        <td style={{ padding: '7px 8px', color: 'var(--color-text-tertiary)' }}>
                          <span className="guided-only">{tr(DIMENSIONS[dim].guidedLabel)}</span>
                          <span className="expert-only">{tr(DIMENSIONS[dim].name)}</span>
                        </td>
                        <td style={{ padding: '7px 8px', fontWeight: differ ? 600 : 400 }}>{a.name} <span className="num" style={{ color: 'var(--color-text-tertiary)' }}>{a.score}</span></td>
                        <td style={{ padding: '7px 8px', fontWeight: differ ? 600 : 400 }}>{b.name} <span className="num" style={{ color: 'var(--color-text-tertiary)' }}>{b.score}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ fontSize: '12px', fontWeight: 500, margin: '16px 0 6px' }}>{t('compare.factorsDiff')}</div>
              {diffs.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{t('compare.noFactorDiff')}</p>
              ) : (
                <ul style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.7, paddingLeft: '18px', margin: 0 }}>
                  {diffs.map((d) => (
                    <li key={d.label}>
                      <span style={{ color: 'var(--color-text-primary)' }}>{d.label}:</span> {d.a} <span style={{ color: 'var(--color-text-tertiary)' }}>(A)</span> → {d.b} <span style={{ color: 'var(--color-text-tertiary)' }}>(B)</span>
                    </li>
                  ))}
                </ul>
              )}
              <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '10px' }}>
                {lang === 'id' ? 'Baris yang disorot = rekomendasi berbeda antara A dan B.' : 'Highlighted rows = the recommendation differs between A and B.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
