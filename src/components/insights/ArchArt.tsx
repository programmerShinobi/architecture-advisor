import type { ReactNode } from 'react';
import type { DimensionId } from '../../types';

/**
 * Symbolic, gently ANIMATED art for every one of the 21 architectures (Fase 2d, owner request):
 * shown on each Catalog card, and in a larger `detailed` variant (with universal mono labels)
 * on the Catalog detail page so newcomers can SEE the shape of the idea, not just read it.
 *
 * Same calm visual language as the landing patterns: theme-aware accents, transform/opacity-only
 * animations (`aa-anim-*` utilities — frozen under reduced-motion / aurora-static). Labels are
 * short canonical mono words (like the radar's DEPLOYMENT/COMMS), identical in both languages.
 */

const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
const DOT = { fill: 'var(--color-text-info)' } as const;

const Label = ({ x, y, children, anchor = 'middle' }: Readonly<{ x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }>) => (
  <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', fill: 'var(--color-text-tertiary)' }}>
    {children}
  </text>
);

/** Database cylinder. */
const Cyl = ({ x, y, w = 34, h = 26 }: Readonly<{ x: number; y: number; w?: number; h?: number }>) => (
  <g>
    <path d={`M ${x} ${y + 6} v ${h - 12} a ${w / 2} 6 0 0 0 ${w} 0 v ${-(h - 12)}`} {...F} />
    <ellipse cx={x + w / 2} cy={y + 6} rx={w / 2} ry={6} {...F} />
  </g>
);

/** Browser frame. */
const Browser = ({ x, y, w = 84, h = 56, children }: Readonly<{ x: number; y: number; w?: number; h?: number; children?: ReactNode }>) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} {...S} />
    <line x1={x} y1={y + 13} x2={x + w} y2={y + 13} {...S} opacity={0.4} />
    <circle cx={x + 9} cy={y + 6.5} r={1.8} {...DOT} opacity={0.5} />
    <circle cx={x + 16} cy={y + 6.5} r={1.8} {...DOT} opacity={0.5} />
    {children}
  </g>
);

const box = (x: number, y: number, w: number, h: number, hl = false, extra?: string) => (
  <rect className={extra} x={x} y={y} width={w} height={h} rx={6} {...(hl ? F : S)} />
);

interface Props {
  dim: DimensionId;
  optId: string;
  /** Larger canvas + universal labels for the detail page. */
  detailed?: boolean;
}

export function ArchArt({ dim, optId, detailed = false }: Readonly<Props>) {
  const key = `${dim}:${optId}`;
  const H = detailed ? 132 : 90;
  const cy = detailed ? 56 : 45; // vertical middle of the drawing area
  const L = detailed; // show labels?

  const body = (() => {
    switch (key) {
      // ---------------- D1 · deployment ----------------
      case 'D1:layered':
        return (
          <>
            {[0, 1, 2].map((i) => box(96, cy - 34 + i * 24, 108, 18, i === 1, i === 1 ? 'aa-anim-breathe' : undefined))}
            {L && <Label x={150} y={cy + 46}>UI · LOGIC · DATA</Label>}
          </>
        );
      case 'D1:monolith':
        return (
          <>
            <rect x={106} y={cy - 32} width={88} height={64} rx={12} {...F} className="aa-anim-breathe" />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={126 + (i % 2) * 48} cy={cy - 12 + Math.floor(i / 2) * 24} r={4} {...DOT} opacity={0.45} />
            ))}
            {L && <Label x={150} y={cy + 48}>ONE DEPLOY</Label>}
          </>
        );
      case 'D1:modular-monolith':
        return (
          <>
            <rect x={82} y={cy - 33} width={136} height={66} rx={12} {...S} />
            {[0, 1, 2].map((c) =>
              [0, 1].map((r) => box(93 + c * 40, cy - 24 + r * 26, 32, 20, c === 1 && r === 0, c === 1 && r === 0 ? 'aa-anim-breathe' : undefined)),
            )}
            {L && <Label x={150} y={cy + 48}>MODULES · ONE DEPLOY</Label>}
          </>
        );
      case 'D1:microservices': {
        const pts: [number, number][] = [[104, cy - 22], [150, cy - 30], [196, cy - 18], [118, cy + 20], [172, cy + 24]];
        const links = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4]];
        return (
          <>
            {links.map(([a, b]) => (
              <line key={`${a}${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} {...S} opacity={0.4} className="aa-anim-dash" />
            ))}
            {pts.map(([x, y], i) => (
              <circle key={x} cx={x} cy={y} r={i === 1 ? 9 : 7} {...F} className="aa-anim-breathe" />
            ))}
            {L && <Label x={150} y={cy + 48}>SMALL · AUTONOMOUS</Label>}
          </>
        );
      }
      case 'D1:serverless':
        return (
          <>
            {[118, 150, 182].map((x, i) => (
              <polygon key={x} points={`${x},${cy - 30} ${x - 12},${cy + 2} ${x - 2},${cy + 2} ${x - 9},${cy + 26} ${x + 11},${cy - 7} ${x},${cy - 7}`} {...F} className="aa-anim-flicker" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
            {L && <Label x={150} y={cy + 48}>ON-DEMAND FUNCTIONS</Label>}
          </>
        );

      // ---------------- D2 · communication ----------------
      case 'D2:synchronous':
        return (
          <>
            {box(84, cy - 14, 44, 30)}
            {box(172, cy - 14, 44, 30, true)}
            <line x1={130} y1={cy - 4} x2={170} y2={cy - 4} {...S} className="aa-anim-dash" />
            <line x1={170} y1={cy + 10} x2={130} y2={cy + 10} {...S} className="aa-anim-dash" style={{ animationDirection: 'reverse' }} />
            {L && <Label x={150} y={cy + 42}>REQUEST ⇄ RESPONSE</Label>}
          </>
        );
      case 'D2:async-messaging':
        return (
          <>
            {box(78, cy - 14, 40, 30)}
            <rect x={130} y={cy - 10} width={44} height={22} rx={6} {...S} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={141 + i * 11} cy={cy + 1} r={3} {...DOT} opacity={0.6} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
            {box(186, cy - 14, 40, 30, true)}
            <line x1={120} y1={cy + 1} x2={128} y2={cy + 1} {...S} />
            <line x1={176} y1={cy + 1} x2={184} y2={cy + 1} {...S} />
            {L && <Label x={150} y={cy + 42}>QUEUE — FIRE & FORGET</Label>}
          </>
        );
      case 'D2:event-driven':
        return (
          <>
            <line x1={80} y1={cy + 16} x2={220} y2={cy + 16} {...S} strokeWidth={2.4} className="aa-anim-dash" />
            {[100, 150, 200].map((x, i) => (
              <g key={x}>
                {box(x - 16, cy - 30, 32, 24, i === 1)}
                <line x1={x} y1={cy - 6} x2={x} y2={cy + 14} {...S} opacity={0.5} />
                <circle cx={x} cy={cy + 16} r={3.4} {...DOT} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
              </g>
            ))}
            {L && <Label x={150} y={cy + 42}>EVENT BUS · PUB/SUB</Label>}
          </>
        );
      case 'D2:streaming':
        return (
          <>
            <path d={`M 78 ${cy} C 96 ${cy - 22}, 114 ${cy - 22}, 132 ${cy} S 168 ${cy + 22}, 186 ${cy} S 214 ${cy - 22}, 222 ${cy - 8}`} {...S} strokeWidth={2.2} className="aa-anim-dash" />
            {[92, 132, 172, 210].map((x, i) => (
              <circle key={x} cx={x} cy={cy + (i % 2 === 0 ? -10 : 10)} r={3.2} {...DOT} opacity={0.6} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
            {L && <Label x={150} y={cy + 42}>CONTINUOUS FLOW</Label>}
          </>
        );

      // ---------------- D3 · data ----------------
      case 'D3:single-db':
        return (
          <>
            {[96, 150, 204].map((x) => box(x - 16, cy - 34, 32, 20))}
            {[96, 150, 204].map((x) => (
              <line key={x} x1={x} y1={cy - 13} x2={150} y2={cy + 4} {...S} opacity={0.5} className="aa-anim-dash" />
            ))}
            <Cyl x={133} y={cy + 2} />
            {L && <Label x={150} y={cy + 46}>ONE SOURCE OF TRUTH</Label>}
          </>
        );
      case 'D3:db-per-service':
        return (
          <>
            {[96, 150, 204].map((x, i) => (
              <g key={x}>
                {box(x - 18, cy - 32, 36, 22, i === 1)}
                <line x1={x} y1={cy - 9} x2={x} y2={cy - 2} {...S} opacity={0.5} />
                <Cyl x={x - 14} y={cy} w={28} h={22} />
              </g>
            ))}
            {L && <Label x={150} y={cy + 44}>OWN DATA PER SERVICE</Label>}
          </>
        );
      case 'D3:cqrs':
        return (
          <>
            <line x1={64} y1={cy} x2={112} y2={cy - 18} {...S} className="aa-anim-dash" />
            <line x1={64} y1={cy} x2={112} y2={cy + 18} {...S} className="aa-anim-dash" />
            <line x1={124} y1={cy - 18} x2={186} y2={cy} {...S} className="aa-anim-dash" />
            <line x1={124} y1={cy + 18} x2={186} y2={cy} {...S} className="aa-anim-dash" />
            <line x1={196} y1={cy} x2={236} y2={cy} {...S} className="aa-anim-dash" />
            {([[64, cy], [118, cy - 18], [118, cy + 18], [191, cy], [236, cy]] as const).map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={8} {...F} className="aa-anim-breathe" />
            ))}
            {L && <Label x={150} y={cy + 46}>WRITE PATH ≠ READ PATH</Label>}
          </>
        );
      case 'D3:event-sourcing':
        return (
          <>
            {[0, 1, 2, 3, 4].map((i) => box(84 + i * 28, cy - 10, 22, 20, i === 4, i === 4 ? 'aa-anim-breathe' : undefined))}
            <line x1={78} y1={cy + 22} x2={222} y2={cy + 22} {...S} opacity={0.4} />
            {L && <Label x={150} y={cy + 42}>APPEND-ONLY LOG</Label>}
          </>
        );
      case 'D3:polyglot':
        return (
          <>
            <Cyl x={88} y={cy - 14} w={30} h={26} />
            <polygon points={`150,${cy - 16} 165,${cy - 7} 165,${cy + 9} 150,${cy + 18} 135,${cy + 9} 135,${cy - 7}`} {...F} className="aa-anim-breathe" />
            {box(188, cy - 13, 28, 26)}
            {L && <Label x={150} y={cy + 44}>RIGHT STORE PER JOB</Label>}
          </>
        );

      // ---------------- D4 · code structure ----------------
      case 'D4:layered':
        return (
          <>
            {[0, 1, 2, 3].map((i) => box(100, cy - 36 + i * 19, 100, 14, i === 0))}
            {L && <Label x={150} y={cy + 46}>CALLS FLOW DOWN</Label>}
          </>
        );
      case 'D4:hexagonal': {
        const hex = (r: number) =>
          Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 3) * i - Math.PI / 2;
            return `${(150 + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
          }).join(' ');
        return (
          <>
            <g className="aa-anim-spin">
              <polygon points={hex(34)} {...S} />
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const a = (Math.PI / 3) * i - Math.PI / 2;
                return <circle key={i} cx={150 + 34 * Math.cos(a)} cy={cy + 34 * Math.sin(a)} r={3.2} {...DOT} opacity={0.55} />;
              })}
            </g>
            <polygon points={hex(19)} {...F} />
            <circle cx={150} cy={cy} r={4.6} {...DOT} className="aa-anim-breathe" />
            {L && <Label x={150} y={cy + 52}>PORTS & ADAPTERS</Label>}
          </>
        );
      }
      case 'D4:clean':
        return (
          <>
            {[34, 24, 14].map((r, i) => (
              <circle key={r} cx={150} cy={cy} r={r} {...(i === 2 ? F : S)} opacity={0.75 - i * 0.1} />
            ))}
            <circle cx={150} cy={cy} r={4.5} {...DOT} className="aa-anim-breathe" />
            {L && <Label x={150} y={cy + 52}>DEPENDENCIES POINT IN</Label>}
          </>
        );
      case 'D4:vertical-slice':
        return (
          <>
            {[0, 1, 2].map((i) => box(96, cy - 30 + i * 22, 108, 16))}
            <rect x={132} y={cy - 34} width={36} height={70} rx={8} {...F} className="aa-anim-breathe" />
            {L && <Label x={150} y={cy + 50}>ONE FEATURE, ALL LAYERS</Label>}
          </>
        );

      // ---------------- D5 · frontend ----------------
      case 'D5:spa':
        return (
          <>
            <Browser x={108} y={cy - 28}>
              <rect x={116} y={cy - 10} width={68} height={30} rx={5} {...F} className="aa-anim-breathe" />
            </Browser>
            {L && <Label x={150} y={cy + 44}>ONE PAGE, LIVE APP</Label>}
          </>
        );
      case 'D5:ssr':
        return (
          <>
            {box(76, cy - 16, 36, 34)}
            <line x1={114} y1={cy + 1} x2={128} y2={cy + 1} {...S} className="aa-anim-dash" />
            <Browser x={132} y={cy - 28}>
              <rect x={140} y={cy - 10} width={68} height={8} rx={3} {...F} />
              <rect x={140} y={cy + 2} width={50} height={8} rx={3} {...F} opacity={0.55} />
            </Browser>
            {L && <Label x={150} y={cy + 44}>SERVER RENDERS FIRST</Label>}
          </>
        );
      case 'D5:micro-frontends':
        return (
          <>
            <Browser x={104} y={cy - 28} w={92}>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={111 + i * 27} y={cy - 10} width={24} height={30} rx={4} {...(i === 1 ? F : S)} className={i === 1 ? 'aa-anim-breathe' : undefined} />
              ))}
            </Browser>
            {L && <Label x={150} y={cy + 44}>TEAMS OWN UI SLICES</Label>}
          </>
        );
      default:
        return <circle cx={150} cy={cy} r={10} {...F} />;
    }
  })();

  return (
    <svg className="lp-art" viewBox={`0 0 300 ${H}`} aria-hidden focusable="false">
      {body}
    </svg>
  );
}
