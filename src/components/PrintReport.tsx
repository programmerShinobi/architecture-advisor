import { useI18n } from '../i18n/I18nContext';
import { buildSnapshot, type ExportInput } from '../lib/snapshot';
import { label } from '../lib/exportLabels';
import { contributions, displayScore } from '../lib/scoring';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import { FACTOR_ORDER, FACTORS } from '../config/factors';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';

// A clean, print-only rendering of the decision (white background, black text, independent of
// the screen theme). Shown only via @media print; "Print / PDF" calls window.print().
export function PrintReport({ exportInput }: { exportInput: ExportInput }) {
  const { t } = useI18n();
  const s = buildSnapshot(exportInput);
  const lang = s.lang;
  const L = (k: Parameters<typeof label>[1]) => label(lang, k);
  const tr = (b: { en: string; id: string }) => b[lang];

  const d1 = DIMENSIONS.D1.options.find((o) => o.id === s.selections.D1) ?? DIMENSIONS.D1.options[0];
  const contribRows = contributions(s.weights, d1.qaFit).filter((c) => c.weight > 0.05);

  const box: React.CSSProperties = { color: '#000', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', padding: '24px', maxWidth: '720px', margin: '0 auto', fontSize: '12px', lineHeight: 1.5 };
  const h2: React.CSSProperties = { fontSize: '14px', margin: '16px 0 6px', borderBottom: '1px solid #ccc', paddingBottom: '3px' };
  const th: React.CSSProperties = { textAlign: 'left', borderBottom: '1px solid #999', padding: '3px 6px', fontWeight: 600 };
  const td: React.CSSProperties = { borderBottom: '1px solid #e0e0e0', padding: '3px 6px' };

  return (
    <div className="print-only" style={box}>
      <h1 style={{ fontSize: '18px', margin: 0 }}>{t('print.title')}</h1>
      <div style={{ color: '#666', fontSize: '11px' }}>
        {t('print.generated')}: {new Date().toISOString().slice(0, 10)}
      </div>

      <h2 style={h2}>{L('factorInputs')}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {FACTOR_ORDER.map((f) => (
            <tr key={f}>
              <td style={td}>{tr(FACTORS[f].label)}</td>
              <td style={{ ...td, fontWeight: 600 }}>{tr(FACTORS[f].levels[s.levels[f] ?? 0])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={h2}>{L('qaPriorities')}</h2>
      <div>
        {s.topQAs.map((q) => `${tr(QUALITY_ATTRIBUTES[q].name)} ${s.rounded[q]}%`).join(' · ')}
      </div>

      <h2 style={h2}>{L('recommendations')}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>{L('option')}</th>
            <th style={th}>{L('score')}</th>
          </tr>
        </thead>
        <tbody>
          {DIMENSION_ORDER.map((dim) => {
            const top = s.rankings[dim][0];
            return (
              <tr key={dim}>
                <td style={td}>
                  <strong>{tr(DIMENSIONS[dim].name)}:</strong> {top.name}
                </td>
                <td style={{ ...td, fontWeight: 600 }}>{displayScore(top.score)}/100</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={h2}>
        {L('contribution')}: {d1.name}
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>{L('option')}</th>
            <th style={th}>{L('weight')}</th>
            <th style={th}>{L('fit')}</th>
            <th style={th}>{L('points')}</th>
          </tr>
        </thead>
        <tbody>
          {contribRows.map((c) => (
            <tr key={c.qa}>
              <td style={td}>{tr(QUALITY_ATTRIBUTES[c.qa].name)}</td>
              <td style={td}>{Math.round(c.weight)}%</td>
              <td style={td}>{c.fit}</td>
              <td style={td}>{c.points.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {s.antiPatterns.length > 0 && (
        <>
          <h2 style={h2}>{L('antiPatterns')}</h2>
          <ul style={{ paddingLeft: '18px', margin: 0 }}>
            {s.antiPatterns.map((r) => (
              <li key={r.id}>
                <strong>[{r.severity}]</strong> {tr(r.message)}
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: '20px', fontSize: '10px', color: '#666', borderTop: '1px solid #ccc', paddingTop: '8px' }}>
        {L('disclaimer')}
      </p>
    </div>
  );
}
