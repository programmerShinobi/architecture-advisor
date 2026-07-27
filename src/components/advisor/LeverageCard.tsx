import { IconAlertTriangle } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { FACTORS } from '../../config/factors';
import type { Leverage } from '../../lib/scoring';
import type { FactorId } from '../../types';

interface Props {
  rows: Leverage[];
}

/**
 * "Which of your answers is actually deciding this?" — a tornado view of factor leverage.
 *
 * THE GAP THIS FILLS. SensitivityCard next door lists the answers that would flip the winner, which
 * leaves every other answer in one undifferentiated pile marked "does not flip it". But that pile
 * holds two very different things: answers that barely move the result, and answers that move it a
 * great deal while the same option still finishes first. Only the first kind is safe to be unsure
 * about, and someone hesitating over a question needs to know which kind they are looking at.
 *
 * WHY THE BARS POINT BOTH WAYS. Each answer is nudged one level down and one level up, and the bar
 * shows how far the winner's LEAD over its closest rival moves — left when the lead shrinks, right
 * when it grows. Sorting by the larger of the two swings produces the classic tornado silhouette,
 * widest at the top, so the answers that decide the outcome are simply the ones you read first.
 *
 * ACCESSIBILITY. A bar chart that only encodes magnitude in pixel width is unreadable to a screen
 * reader and unreliable for anyone judging small differences by eye, so every row states its own
 * number in text and the bars are decorative reinforcement. Colour is never the sole carrier of the
 * "this unseats your pick" signal either — that row also carries an icon and a worded label.
 */
export function LeverageCard({ rows }: Props) {
  const { t, tr } = useI18n();
  const shown = rows.filter((r) => r.swing > 0).slice(0, 6);
  if (shown.length === 0) return null;

  const widest = shown[0].swing;
  const fmt = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}`;

  return (
    <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '14px 15px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{t('lev.title')}</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '12px', lineHeight: 1.5 }}>{t('lev.intro')}</div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '9px' }}>
        {shown.map((r) => {
          const label = tr(FACTORS[r.factor as FactorId].label);
          // Half-width per side: the centre line is the current answer, so a swing can never
          // overflow its half even when it is the widest bar in the set.
          const pct = (v: number) => `${(Math.abs(v) / widest) * 50}%`;
          const worst = Math.min(r.down ?? 0, r.up ?? 0);
          const best = Math.max(r.down ?? 0, r.up ?? 0);
          const reading = t('lev.reading')
            .replace('{factor}', label)
            .replace('{lose}', fmt(worst))
            .replace('{gain}', fmt(best));

          return (
            <li key={r.factor}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{label}</span>
                {/* The magnitude is this card's whole reason to exist, so it is shown on every row —
                    including the rows that unseat the pick, where it matters most. The signed figure
                    is the bigger of the two swings, because "how much can this cost me" is the
                    question being asked. */}
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px', flex: 'none' }}>
                  <span style={{ fontSize: '11px', fontVariantNumeric: 'tabular-nums', color: r.unseats ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)' }}>
                    {fmt(Math.abs(worst) >= Math.abs(best) ? worst : best)}
                  </span>
                  {r.unseats && (
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                      <IconAlertTriangle size={10} style={{ color: 'var(--color-text-warning)' }} aria-hidden />
                      {t('lev.unseats')}
                    </span>
                  )}
                </span>
              </div>

              {/* Decorative: the same figures are stated in the visually-hidden reading below. */}
              <div aria-hidden style={{ display: 'flex', alignItems: 'center', height: '8px', background: 'var(--color-background-secondary)', borderRadius: '2px' }}>
                <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', height: '100%' }}>
                  {worst < 0 && (
                    <span style={{ width: pct(worst), height: '100%', background: r.unseats ? 'var(--color-text-warning)' : 'var(--color-text-tertiary)', borderRadius: '2px 0 0 2px' }} />
                  )}
                </div>
                <div style={{ width: '50%', height: '100%' }}>
                  {best > 0 && (
                    <span style={{ display: 'block', width: pct(best), height: '100%', background: 'var(--color-text-success)', borderRadius: '0 2px 2px 0' }} />
                  )}
                </div>
              </div>

              <span className="sr-only">{reading}</span>
            </li>
          );
        })}
      </ul>

      <div style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', marginTop: '11px', lineHeight: 1.5 }}>{t('lev.unit')}</div>
    </div>
  );
}
