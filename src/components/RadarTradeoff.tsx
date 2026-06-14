import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useI18n } from '../i18n/I18nContext';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../config/qualityAttributes';
import { DIMENSIONS } from '../config/dimensions';
import type { RankedOption } from '../types';

interface Props {
  ranked: RankedOption[];
}

const COLORS = ['#2563eb', '#0d9488', '#db2777'];

// Overlay the top options of D1 across all 12 QAs so trade-offs are visible at a glance.
export function RadarTradeoff({ ranked }: Props) {
  const { t, tr } = useI18n();
  const top = ranked.slice(0, 3);
  const byId = Object.fromEntries(DIMENSIONS.D1.options.map((o) => [o.id, o]));

  const data = QA_ORDER.map((q, i) => {
    const row: Record<string, string | number> = { qa: tr(QUALITY_ATTRIBUTES[q].name).split(/[&/]/)[0].trim() };
    for (const o of top) row[o.name] = byId[o.id]?.qaFit[i] ?? 3;
    return row;
  });

  return (
    <section aria-labelledby="radar-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="radar-heading" className="text-base font-semibold">
        {t('radar.heading')}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{t('radar.intro')}</p>

      <div className="mt-3 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid stroke="rgb(var(--line))" />
            <PolarAngleAxis dataKey="qa" tick={{ fontSize: 10, fill: 'rgb(var(--ink-soft))' }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9, fill: 'rgb(var(--ink-soft))' }} />
            {top.map((o, i) => (
              <Radar
                key={o.id}
                name={o.name}
                dataKey={o.name}
                stroke={COLORS[i]}
                fill={COLORS[i]}
                fillOpacity={0.12}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'rgb(var(--surface))',
                border: '1px solid rgb(var(--line))',
                borderRadius: 8,
                fontSize: 12,
                color: 'rgb(var(--ink))',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
