import type { ReactNode } from 'react';

/**
 * Living motif art for the non-architecture Insights items (Fase 2e, owner request: EVERY
 * element carries a moving symbol matching its own title — cards get the simple preview,
 * detail views the larger `detailed` variant with a caption). Same visual language and the
 * same gentle `aa-anim-*` classes as ArchArt (auto-frozen under reduced-motion/low-core).
 */

const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
const DOT = { fill: 'var(--color-text-info)' } as const;

const Cap = ({ children }: Readonly<{ children: ReactNode }>) => (
  <text x={150} y={86} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.08em', fill: 'var(--color-text-tertiary)' }}>
    {children}
  </text>
);

export type MotifKind =
  | 'stairs' // learning fundamentals — steps going up
  | 'split' // monolith splitting into services
  | 'bus' // communication styles — messages on a bus
  | 'cylinders' // data ownership — databases
  | 'hexcore' // clean code structure — protected core
  | 'browser' // frontend at scale — browser with tiles
  | 'gauge' // evaluating / review path
  | 'team' // team-size experiment
  | 'warning' // premature-split experiment
  | 'wave' // realtime / streaming
  | 'anchor' // consistency anchor
  | 'bridge' // legacy strangler — incremental bridge
  | 'tiles' // frontend autonomy
  | 'radar' // methods & practice — the model itself
  | 'article'; // evergreen article / reference doc


const pent = (cx: number, cy: number, r: number) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = ((Math.PI * 2) / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

export function MotifArt({ kind, detailed = false, caption }: Readonly<{ kind: MotifKind; detailed?: boolean; caption?: string }>) {
  const cy = detailed ? 44 : 45;
  let body: ReactNode;
  switch (kind) {
    case 'stairs':
      body = (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={84 + i * 36} y={64 - i * 15} width={30} height={10 + i * 15} rx={4} {...(i === 3 ? F : S)} className={i === 3 ? 'aa-anim-breathe' : undefined} />
          ))}
          <circle cx={99} cy={54} r={4} {...DOT} className="aa-anim-breathe" />
          <line x1={99} y1={54} x2={213} y2={12} {...S} opacity={0.4} strokeDasharray="4 6" className="aa-anim-dash" />
        </>
      );
      break;
    case 'split':
      body = (
        <>
          <rect x={74} y={cy - 20} width={44} height={40} rx={8} {...S} />
          <line x1={122} y1={cy} x2={150} y2={cy} {...S} strokeDasharray="4 6" className="aa-anim-dash" />
          {[[176, cy - 22], [196, cy], [176, cy + 22]].map(([x, y], i) => (
            <circle key={x * 100 + y} cx={x} cy={y} r={10} {...F} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </>
      );
      break;
    case 'bus':
      body = (
        <>
          <line x1={70} y1={cy + 14} x2={230} y2={cy + 14} {...S} strokeWidth={2.4} strokeDasharray="5 8" className="aa-anim-dash" />
          {[100, 150, 200].map((x, i) => (
            <g key={x}>
              <rect x={x - 17} y={cy - 26} width={34} height={22} rx={6} {...(i === 1 ? F : S)} />
              <circle cx={x} cy={cy + 14} r={3.4} {...DOT} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
            </g>
          ))}
        </>
      );
      break;
    case 'cylinders':
      body = (
        <>
          {[104, 150, 196].map((x, i) => (
            <g key={x} className={i === 1 ? 'aa-anim-breathe' : undefined}>
              <ellipse cx={x} cy={cy - 16} rx={17} ry={6} {...(i === 1 ? F : S)} />
              <path d={`M ${x - 17} ${cy - 16} v 30 a 17 6 0 0 0 34 0 v -30`} {...(i === 1 ? F : S)} />
            </g>
          ))}
          <line x1={121} y1={cy} x2={133} y2={cy} {...S} opacity={0.4} strokeDasharray="3 5" className="aa-anim-dash" />
          <line x1={167} y1={cy} x2={179} y2={cy} {...S} opacity={0.4} strokeDasharray="3 5" className="aa-anim-dash" />
        </>
      );
      break;
    case 'hexcore': {
      const hex = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${(150 + 30 * Math.cos(a)).toFixed(1)},${(cy + 30 * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      body = (
        <>
          <g className="aa-anim-spin" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <polygon points={hex} {...S} />
          </g>
          <circle cx={150} cy={cy} r={11} {...F} />
          <circle cx={150} cy={cy} r={4} {...DOT} className="aa-anim-breathe" />
        </>
      );
      break;
    }
    case 'browser':
      body = (
        <>
          <rect x={92} y={cy - 28} width={116} height={56} rx={8} {...S} />
          <line x1={92} y1={cy - 16} x2={208} y2={cy - 16} {...S} opacity={0.5} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={100 + i * 36} y={cy - 8} width={30} height={28} rx={5} {...(i === 1 ? F : S)} className={i === 1 ? 'aa-anim-breathe' : undefined} style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </>
      );
      break;
    case 'gauge':
      body = (
        <>
          <path d={`M 106 ${cy + 16} A 44 44 0 0 1 194 ${cy + 16}`} {...S} strokeWidth={2.2} />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = Math.PI - (Math.PI / 4) * i;
            return <circle key={i} cx={150 + 44 * Math.cos(a)} cy={cy + 16 - 44 * Math.sin(a)} r={2.6} {...DOT} opacity={0.5} />;
          })}
          <line x1={150} y1={cy + 16} x2={178} y2={cy - 12} stroke="var(--color-text-info)" strokeWidth={2.4} strokeLinecap="round" className="aa-anim-breathe" />
          <circle cx={150} cy={cy + 16} r={5} {...DOT} />
        </>
      );
      break;
    case 'team':
      body = (
        <>
          {[[110, cy - 8, 7], [134, cy - 8, 7], [122, cy + 12, 7]].map(([x, y, r], i) => (
            <circle key={x * 100 + y} cx={x} cy={y} r={r} {...F} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
          <line x1={152} y1={cy} x2={172} y2={cy} {...S} strokeDasharray="4 6" className="aa-anim-dash" />
          <rect x={180} y={cy - 18} width={22} height={36} rx={5} {...S} />
          <rect x={206} y={cy - 18} width={22} height={36} rx={5} {...S} />
        </>
      );
      break;
    case 'warning':
      body = (
        <>
          <rect x={86} y={cy - 18} width={40} height={36} rx={7} {...S} />
          <line x1={130} y1={cy} x2={152} y2={cy} {...S} strokeDasharray="4 6" className="aa-anim-dash" />
          {[[172, cy - 16], [188, cy + 14], [204, cy - 8]].map(([x, y]) => (
            <circle key={x * 100 + y} cx={x} cy={y} r={7} {...S} opacity={0.55} />
          ))}
          <polygon points={`150,${cy - 30} 162,${cy - 8} 138,${cy - 8}`} {...F} className="aa-anim-flicker" />
          <text x={150} y={cy - 13} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, fill: 'var(--color-text-info)' }}>!</text>
        </>
      );
      break;
    case 'wave':
      body = (
        <>
          <path d={`M 76 ${cy} q 12 -20 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} {...S} strokeWidth={2} strokeDasharray="5 7" className="aa-anim-dash" />
          {[100, 148, 196].map((x, i) => (
            <circle key={x} cx={x} cy={cy - 9} r={3.6} {...DOT} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </>
      );
      break;
    case 'anchor':
      body = (
        <>
          <circle cx={150} cy={cy - 22} r={7} {...S} />
          <line x1={150} y1={cy - 15} x2={150} y2={cy + 16} {...S} strokeWidth={2.2} />
          <path d={`M 118 ${cy + 2} a 32 32 0 0 0 64 0`} {...S} strokeWidth={2.2} />
          <line x1={132} y1={cy - 4} x2={168} y2={cy - 4} {...S} />
          {[104, 196].map((x) => (
            <ellipse key={x} cx={x} cy={cy + 8} rx={13} ry={5} {...F} className="aa-anim-breathe" />
          ))}
        </>
      );
      break;
    case 'bridge':
      body = (
        <>
          <rect x={78} y={cy - 20} width={42} height={40} rx={7} {...S} opacity={0.5} />
          <rect x={180} y={cy - 20} width={42} height={40} rx={7} {...F} className="aa-anim-breathe" />
          <path d={`M 120 ${cy - 20} q 30 -26 60 0`} {...S} strokeDasharray="5 7" className="aa-anim-dash" />
          {[132, 150, 168].map((x, i) => (
            <circle key={x} cx={x} cy={cy - 32} r={3} {...DOT} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </>
      );
      break;
    case 'tiles':
      body = (
        <>
          {[0, 1, 2].map((c) => (
            <rect key={c} x={96 + c * 40} y={cy - 22} width={32} height={44} rx={6} {...(c === 1 ? F : S)} className={c === 1 ? 'aa-anim-breathe' : undefined} style={{ animationDelay: `${c * 0.3}s` }} />
          ))}
          <line x1={96} y1={cy + 30} x2={200} y2={cy + 30} {...S} opacity={0.4} strokeDasharray="4 6" className="aa-anim-dash" />
        </>
      );
      break;
    case 'radar':
      body = (
        <>
          <polygon points={pent(150, cy, 30)} {...S} />
          <polygon points={pent(150, cy, 17)} {...F} className="aa-anim-breathe" />
          <circle cx={150} cy={cy - 30} r={4} {...DOT} className="aa-anim-breathe" />
        </>
      );
      break;
    default:
      // article — a document with settling text lines.
      body = (
        <>
          <rect x={118} y={cy - 28} width={64} height={56} rx={7} {...S} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={128} y={cy - 16 + i * 12} width={i === 1 ? 30 : 44} height={5} rx={2.5} fill="var(--color-text-info)" opacity={0.35} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
          <circle cx={190} cy={cy + 20} r={7} {...F} className="aa-anim-breathe" />
        </>
      );
  }
  return (
    <svg className="lp-art" viewBox="0 0 300 90" aria-hidden>
      {body}
      {detailed && caption && <Cap>{caption}</Cap>}
    </svg>
  );
}
