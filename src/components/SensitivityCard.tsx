import { IconArrowDownRight, IconArrowUpRight, IconShieldCheck } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { FACTORS } from '../config/factors';
import type { Flip } from '../lib/scoring';
import type { FactorId, Levels } from '../types';

interface Props {
  flips: Flip[];
  levels: Levels;
}

// "What would change this?" — which single factor change would flip the top D1 pick (live).
export function SensitivityCard({ flips, levels }: Props) {
  const { t, tr } = useI18n();
  const shown = flips.slice(0, 3);

  return (
    <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '14px 15px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{t('sens.title')}</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>{t('sens.intro')}</div>

      {shown.map((f) => {
        const factor = FACTORS[f.factor as FactorId];
        const up = f.to > (levels[f.factor as FactorId] ?? 0);
        const Arrow = up ? IconArrowUpRight : IconArrowDownRight;
        const text = t('sens.flip')
          .replace('{factor}', tr(factor.label))
          .replace('{level}', tr(factor.levels[f.to]))
          .replace('{winner}', f.newWinner);
        return (
          <div key={`${f.factor}-${f.to}`} style={{ display: 'flex', gap: '9px', marginBottom: '10px', alignItems: 'flex-start' }}>
            <Arrow size={15} style={{ color: 'var(--color-text-warning)', marginTop: '1px', flex: 'none' }} aria-hidden />
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{text}</span>
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
        <IconShieldCheck size={15} style={{ color: 'var(--color-text-success)', marginTop: '1px', flex: 'none' }} aria-hidden />
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{t('sens.robust')}</span>
      </div>
    </div>
  );
}
