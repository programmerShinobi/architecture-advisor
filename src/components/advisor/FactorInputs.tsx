import { IconChevronRight } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { FACTOR_ORDER, FACTORS } from '../../config/factors';
import { FactorField } from './FactorField';
import type { FactorId, Levels } from '../../types';

interface Props {
  levels: Levels;
  onChange: (next: Levels) => void;
}

// Project factors organized into collapsible group dropdowns (Team & delivery / Scale &
// performance / Domain, data & risk). The first group is open by default; the others expand on
// demand — a tidier, more professional layout than a long flat list.
export function FactorInputs({ levels, onChange }: Props) {
  const { tr } = useI18n();

  // Group factors in canonical order, preserving first-seen group order.
  const groups: { label: string; ids: FactorId[] }[] = [];
  for (const id of FACTOR_ORDER) {
    const label = tr(FACTORS[id].group);
    const g = groups.find((x) => x.label === label) ?? (groups.push({ label, ids: [] }), groups[groups.length - 1]);
    g.ids.push(id);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {groups.map((g, i) => (
        <details key={g.label} open={i === 0} className="group">
          <summary>
            <IconChevronRight size={14} className="transition-transform group-open:rotate-90" aria-hidden />
            {g.label}
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
              {g.ids.length}
            </span>
          </summary>
          <div style={{ padding: '0 14px 12px' }}>
            {g.ids.map((id) => (
              <FactorField
                key={id}
                factor={FACTORS[id]}
                level={levels[id] ?? 0}
                onChange={(level) => onChange({ ...levels, [id]: level })}
              />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
