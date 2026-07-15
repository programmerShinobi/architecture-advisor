import { useState } from 'react';
import { IconRadar2, IconTable } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { DIMENSIONS, DIMENSION_ORDER } from '../../config/dimensions';
import { composite, displayScore } from '../../lib/scoring';
import type { Bilingual, DimensionId, Weights } from '../../types';

// Compact radar-axis labels in canonical QA order (the radar uses short labels in both modes).
const SHORT: Bilingual[] = [
  { en: 'Performance', id: 'Performa' },
  { en: 'Scalability', id: 'Skalabilitas' },
  { en: 'Availability', id: 'Ketersediaan' },
  { en: 'Security', id: 'Keamanan' },
  { en: 'Maintainable', id: 'Pemeliharaan' },
  { en: 'Deploy ease', id: 'Rilis' },
  { en: 'Testability', id: 'Pengujian' },
  { en: 'Monitoring', id: 'Observabilitas' },
  { en: 'Consistency', id: 'Konsistensi' },
  { en: 'Integration', id: 'Integrasi' },
  { en: 'Low cost', id: 'Biaya' },
  { en: 'Speed to ship', id: 'Waktu rilis' },
];
// Theme-aware series colors (defined in index.css :root / html.light) — vibrant aurora hues on
// dark, deeper versions on light, so overlaid options stay distinct and legible in both themes.
const PALETTE = ['var(--radar-1)', 'var(--radar-2)', 'var(--radar-3)', 'var(--radar-4)', 'var(--radar-5)'];

const cx = 190;
const cy = 178;
const R = 118;
const N = 12;
const ang = (i: number) => ((-90 + i * (360 / N)) * Math.PI) / 180;
const pt = (i: number, v: number): [number, number] => {
  const r = (v / 5) * R;
  return [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
};
const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).map((n) => n.toFixed(1)).join(',')).join(' ');

interface Props {
  weights: Weights;
  mode: 'guided' | 'expert';
}

export function RadarPanel({ weights, mode }: Props) {
  const { t, tr } = useI18n();
  const [dim, setDim] = useState<DimensionId>('D1');
  const [onState, setOnState] = useState<Record<string, boolean>>({});
  const [gridOpen, setGridOpen] = useState(false);
  const [sortKey, setSortKey] = useState<'name' | 'score' | number>('score');
  const [sortDir, setSortDir] = useState(-1);

  const options = DIMENSIONS[dim].options;
  const score = (qaFit: number[]) => displayScore(composite(weights, qaFit));
  const ranked = options.map((o) => ({ o, s: score(o.qaFit) })).sort((a, b) => b.s - a.s);
  const top3 = new Set(ranked.slice(0, 3).map((r) => r.o.id));
  const isOn = (id: string) => onState[`${dim}:${id}`] ?? top3.has(id);
  const toggle = (id: string) => setOnState((p) => ({ ...p, [`${dim}:${id}`]: !isOn(id) }));

  const top = ranked[0];
  const second = ranked[1];
  const gap = top.s - second.s;
  const verdict = (gap < 8 ? t('radar.verdictClose') : t('radar.verdictLead'))
    .replace('{a}', top.o.name)
    .replace('{as}', String(top.s))
    .replace('{b}', second.o.name)
    .replace('{bs}', String(second.s))
    .replace('{gap}', String(gap));

  const rings = [1, 2, 3, 4, 5];
  const gridCols: { k: 'name' | 'score' | number; t: string; idx?: number }[] = [
    { k: 'name', t: 'Option' },
    { k: 'score', t: 'Score%' },
    { k: 4, t: tr(SHORT[1]), idx: 1 },
    { k: 5, t: tr(SHORT[5]), idx: 5 },
    { k: 0, t: tr(SHORT[0]), idx: 0 },
    { k: 2, t: tr(SHORT[2]), idx: 2 },
    { k: 10, t: tr(SHORT[10]), idx: 10 },
  ];
  const gridRows = options
    .map((o) => ({ name: o.name, score: score(o.qaFit), fit: o.qaFit }))
    .sort((a, b) => {
      let va: number | string;
      let vb: number | string;
      if (sortKey === 'name') {
        va = a.name;
        vb = b.name;
      } else if (sortKey === 'score') {
        va = a.score;
        vb = b.score;
      } else {
        va = a.fit[sortKey];
        vb = b.fit[sortKey];
      }
      return (va > vb ? 1 : va < vb ? -1 : 0) * sortDir;
    });
  const sortOn = (k: 'name' | 'score' | number) => {
    if (sortKey === k) setSortDir((d) => -d);
    else {
      setSortKey(k);
      setSortDir(k === 'name' ? 1 : -1);
    }
  };

  return (
    <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '16px', marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <IconRadar2 size={17} style={{ verticalAlign: '-3px', marginRight: '7px', color: 'var(--color-text-info)' }} aria-hidden />
          <span className="guided-only">{t('radar.title.g')}</span>
          <span className="expert-only">{t('radar.title.e')}</span>
        </span>
        {mode === 'expert' && (
          <button type="button" className="f-btn" onClick={() => setGridOpen((v) => !v)}>
            <IconTable size={13} aria-hidden />
            {t('radar.dataGrid')}
          </button>
        )}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>{t('radar.help')}</div>

      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '7px' }}>{t('radar.compareFrom')}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '13px' }}>
        {DIMENSION_ORDER.map((d, i) => (
          <button key={d} type="button" className={'r-dimchip' + (d === dim ? ' on' : '')} aria-pressed={d === dim} onClick={() => setDim(d)}>
            <span className="dim-no" style={{ width: '18px', height: '18px', fontSize: '10px' }}>{i + 1}</span>
            <span className="guided-only">{tr(DIMENSIONS[d].guidedLabel)}</span>
            <span className="expert-only">{tr(DIMENSIONS[d].name)}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {options.map((o, i) => {
          const on = isOn(o.id);
          return (
            <button key={o.id} type="button" className={'r-chip' + (on ? '' : ' off')} aria-pressed={on} onClick={() => toggle(o.id)}>
              <span className="r-dot" style={{ background: PALETTE[i % PALETTE.length] }} />
              {o.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '18px', alignItems: 'start' }}>
        <div style={{ minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 380 360" width="100%" style={{ maxWidth: '380px' }} role="img" aria-label="Radar chart across twelve quality attributes">
            {rings.map((ring) => (
              <polygon key={ring} points={poly(Array(N).fill(ring))} fill="none" stroke="var(--aa-grid-line)" strokeWidth={ring === 5 ? 1 : 0.5} />
            ))}
            {Array.from({ length: N }).map((_, i) => {
              const pe = pt(i, 5);
              const lp = [cx + (R + 15) * Math.cos(ang(i)), cy + (R + 15) * Math.sin(ang(i))];
              const c = Math.cos(ang(i));
              const anchor = c > 0.25 ? 'start' : c < -0.25 ? 'end' : 'middle';
              return (
                <g key={i}>
                  <line x1={cx} y1={cy} x2={pe[0].toFixed(1)} y2={pe[1].toFixed(1)} stroke="var(--aa-grid-line)" strokeWidth={0.5} />
                  <text x={lp[0].toFixed(1)} y={(lp[1] + 3).toFixed(1)} textAnchor={anchor} fontSize={11} fill="var(--color-text-secondary)">
                    {tr(SHORT[i])}
                  </text>
                </g>
              );
            })}
            {options.map((o, i) =>
              isOn(o.id) ? (
                <g key={o.id}>
                  <polygon points={poly(o.qaFit)} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.12} stroke={PALETTE[i % PALETTE.length]} strokeWidth={1.75} strokeLinejoin="round" />
                  {o.qaFit.map((v, j) => {
                    const d = pt(j, v);
                    return <circle key={j} cx={d[0].toFixed(1)} cy={d[1].toFixed(1)} r={2.4} fill={PALETTE[i % PALETTE.length]} />;
                  })}
                </g>
              ) : null,
            )}
          </svg>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '13px' }}>{t('radar.bestFor')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {ranked.map(({ o, s }, idx) => {
              const best = idx === 0;
              const i = options.findIndex((x) => x.id === o.id);
              return (
                <div
                  key={o.id}
                  className="f-row"
                  style={{
                    background: best ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '10px 12px',
                    border: best ? '1.5px solid var(--color-border-info)' : undefined,
                    opacity: isOn(o.id) ? 1 : 0.85,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: best ? 'var(--color-text-info)' : 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span className="r-dot" style={{ background: PALETTE[i % PALETTE.length] }} />
                      {o.name}
                      {best && <span style={{ fontSize: '10px', background: 'var(--color-text-info)', color: 'var(--color-background-primary)', padding: '1px 8px', borderRadius: '99px' }}>{t('radar.topPick')}</span>}
                    </span>
                    <span className="num" style={{ fontSize: '13px', fontWeight: 500, color: best ? 'var(--color-text-info)' : 'var(--color-text-secondary)' }}>{s}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--color-background-tertiary)', borderRadius: '99px' }}>
                    <div style={{ height: '100%', width: `${s}%`, background: best ? 'var(--color-text-info)' : PALETTE[i % PALETTE.length], borderRadius: '99px' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', background: 'var(--color-background-info)', borderRadius: 'var(--border-radius-md)', padding: '11px 13px', marginTop: '13px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-info)', lineHeight: 1.6 }}>{verdict}</span>
          </div>
        </div>
      </div>

      {mode === 'expert' && gridOpen && (
        <div id="f-grid" style={{ marginTop: '16px', maxHeight: '230px', overflow: 'auto', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)' }}>
          <table>
            <thead>
              <tr>
                {gridCols.map((c) => (
                  <th key={String(c.k)} onClick={() => sortOn(c.k)}>
                    {c.t}
                    {sortKey === c.k ? (sortDir < 0 ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridRows.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td className="num" style={{ fontWeight: 500 }}>{r.score}</td>
                  <td className="num">{r.fit[1]}</td>
                  <td className="num">{r.fit[5]}</td>
                  <td className="num">{r.fit[0]}</td>
                  <td className="num">{r.fit[2]}</td>
                  <td className="num">{r.fit[10]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
