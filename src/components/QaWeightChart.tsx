import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useI18n } from '../i18n/I18nContext';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../config/qualityAttributes';
import { roundWeights } from '../lib/scoring';
import type { Weights } from '../types';

interface Props {
  weights: Weights;
}

// Horizontal bar chart of the normalized QA weights (the utility tree). Shows only QAs with a
// non-zero weight, sorted descending; economic QAs (cost, time-to-market) get a distinct color.
export function QaWeightChart({ weights }: Props) {
  const { t, tr } = useI18n();
  const rounded = roundWeights(weights);

  const data = QA_ORDER.map((q) => ({
    id: q,
    name: tr(QUALITY_ATTRIBUTES[q].name),
    weight: rounded[q],
    economic: QUALITY_ATTRIBUTES[q].economicFlag,
  }))
    .filter((d) => d.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const height = Math.max(120, data.length * 30 + 16);

  return (
    <section aria-labelledby="priorities-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="priorities-heading" className="text-base font-semibold">
        {t('priorities.heading')}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t('priorities.intro')}</p>

      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 0, right: 36, bottom: 0, left: 8 }}>
            <XAxis type="number" domain={[0, 'dataMax']} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'rgb(var(--ink-soft))' }}
            />
            <Tooltip
              cursor={{ fill: 'rgb(var(--surface-2))' }}
              formatter={(v: number) => [`${v}%`, t('priorities.heading')]}
              contentStyle={{
                background: 'rgb(var(--surface))',
                border: '1px solid rgb(var(--line))',
                borderRadius: 8,
                fontSize: 12,
                color: 'rgb(var(--ink))',
              }}
            />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 11, fill: 'rgb(var(--ink-soft))', formatter: (v: number) => `${v}%` }}>
              {data.map((d) => (
                <Cell key={d.id} fill={d.economic ? '#0d9488' : 'rgb(var(--brand))'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-xs text-ink-soft">
        <span className="inline-block h-2 w-2 rounded-sm align-middle" style={{ background: '#0d9488' }} />{' '}
        {t('priorities.economic')}
      </p>
    </section>
  );
}
