import { useId } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { buildC4, type C4NodeKind } from '../lib/c4';

interface Props {
  optionId: string;
}

const W = 600;
const PAD = 18;
const ROW_GAP = 80;
const BOX_H = 40;

const boxWidth = (label: string, n: number) =>
  Math.max(96, Math.min(W / n - 18, label.length * 7.3 + 30));

function style(kind: C4NodeKind) {
  if (kind === 'actor')
    return { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', text: 'var(--color-text-info)' };
  if (kind === 'store')
    return { fill: 'var(--color-background-secondary)', stroke: 'var(--color-border-secondary)', text: 'var(--color-text-secondary)' };
  return { fill: 'var(--color-background-secondary)', stroke: 'var(--color-border-secondary)', text: 'var(--color-text-primary)' };
}

// Renders the C4 stub as deterministic SVG (rows of nodes, fan-out / 1:1 edges). Theme-aware
// via CSS variables; no diagram library, so it cannot fail to render.
export function C4Preview({ optionId }: Props) {
  const { t } = useI18n();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { rows } = buildC4(optionId);
  const height = PAD * 2 + (rows.length - 1) * ROW_GAP + BOX_H;

  // Node centers per row.
  const pos = rows.map((row, r) =>
    row.map((nd, i) => ({
      x: (W * (i + 1)) / (row.length + 1),
      y: PAD + r * ROW_GAP + BOX_H / 2,
      w: boxWidth(nd.label, row.length),
      node: nd,
    })),
  );

  // Edges between consecutive rows: 1:1 when equal length > 1, else fan-out/fan-in.
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let r = 0; r < pos.length - 1; r++) {
    const a = pos[r], b = pos[r + 1];
    const oneToOne = a.length === b.length && a.length > 1;
    a.forEach((pa, i) => {
      const targets = oneToOne ? [b[i]] : b;
      targets.forEach((pb) => edges.push({ x1: pa.x, y1: pa.y + BOX_H / 2, x2: pb.x, y2: pb.y - BOX_H / 2 }));
    });
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" style={{ maxWidth: `${W}px` }} role="img" aria-label={t('c4.heading')}>
          <defs>
            <marker id={`arr-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text-tertiary)" />
            </marker>
          </defs>
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="var(--color-text-tertiary)"
              strokeWidth={1}
              markerEnd={`url(#arr-${uid})`}
            />
          ))}
          {pos.flat().map((p, i) => {
            const s = style(p.node.kind);
            const x = p.x - p.w / 2;
            const y = p.y - BOX_H / 2;
            const rx = p.node.kind === 'actor' ? BOX_H / 2 : 7;
            return (
              <g key={i}>
                {p.node.kind === 'store' ? (
                  <g>
                    <rect x={x} y={y + 5} width={p.w} height={BOX_H - 10} fill={s.fill} stroke={s.stroke} strokeWidth={1} />
                    <ellipse cx={p.x} cy={y + 5} rx={p.w / 2} ry={5} fill={s.fill} stroke={s.stroke} strokeWidth={1} />
                    <ellipse cx={p.x} cy={y + BOX_H - 5} rx={p.w / 2} ry={5} fill={s.fill} stroke={s.stroke} strokeWidth={1} />
                  </g>
                ) : (
                  <rect x={x} y={y} width={p.w} height={BOX_H} rx={rx} fill={s.fill} stroke={s.stroke} strokeWidth={1} />
                )}
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fill={s.text} style={{ fontFamily: 'var(--font-sans)' }}>
                  {p.node.label}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
}
