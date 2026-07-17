import type { ReactNode } from 'react';
import type { DimensionId } from '../../types';

/**
 * Symbolic, gently ANIMATED art for every one of the 21 architectures (Fase 2d, owner request):
 * shown on each Catalog card, and in a larger `detailed` variant on the Catalog detail page so
 * newcomers can SEE the shape of the idea, not just read it. The detailed variant goes deep
 * (rev.2): every part carries its own tiny label (CLIENT, BUS, DB, CORE…) plus a one-line
 * caption, like a miniature explanatory diagram.
 *
 * Same calm visual language as the landing patterns: theme-aware accents, transform/opacity-only
 * animations (`aa-anim-*` utilities — frozen under reduced-motion / aurora-static). Labels are
 * short canonical mono words (like the radar's DEPLOYMENT/COMMS), identical in both languages.
 */

const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
const DOT = { fill: 'var(--color-text-info)' } as const;

/** Caption under the drawing (detail page). Sized to stay quieter than the drawing itself
    (owner: text must never overpower the image). */
const Label = ({ x, y, children }: Readonly<{ x: number; y: number; children: ReactNode }>) => (
  <text x={x} y={y} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.08em', fill: 'var(--color-text-tertiary)' }}>
    {children}
  </text>
);

/** Tiny per-part label (detail page, rev.2 — "sedalam-dalamnya"). */
const PL = ({ x, y, children, dim = false }: Readonly<{ x: number; y: number; children: ReactNode; dim?: boolean }>) => (
  <text x={x} y={y} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '6px', letterSpacing: '0.05em', fill: dim ? 'var(--color-text-tertiary)' : 'var(--color-text-info)', opacity: 0.9 }}>
    {children}
  </text>
);

/** Small flow arrow. */
const Arrow = ({ x1, y1, x2, y2, anim = true }: Readonly<{ x1: number; y1: number; x2: number; y2: number; anim?: boolean }>) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (t: number) => x2 - 6 * Math.cos(a - t);
  const hy = (t: number) => y2 - 6 * Math.sin(a - t);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} {...S} className={anim ? 'aa-anim-dash' : undefined} />
      <polyline points={`${hx(0.5)},${hy(0.5)} ${x2},${y2} ${hx(-0.5)},${hy(-0.5)}`} {...S} strokeWidth={1.4} />
    </g>
  );
};

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
  /** Larger canvas + per-part labels for the detail page. */
  detailed?: boolean;
}

export function ArchArt({ dim, optId, detailed = false }: Readonly<Props>) {
  const key = `${dim}:${optId}`;
  const H = detailed ? 140 : 90;
  const cy = detailed ? 58 : 45; // vertical middle of the drawing area
  const L = detailed;

  const body = (() => {
    switch (key) {
      // ---------------- D1 · deployment ----------------
      case 'D1:layered':
        return (
          <>
            {[0, 1, 2].map((i) => box(96, cy - 34 + i * 24, 108, 18, i === 1, i === 1 ? 'aa-anim-breathe' : undefined))}
            {L && (
              <>
                <PL x={150} y={cy - 22}>PRESENTATION</PL>
                <PL x={150} y={cy + 2}>BUSINESS LOGIC</PL>
                <PL x={150} y={cy + 26}>DATA ACCESS</PL>
                <Arrow x1={216} y1={cy - 26} x2={216} y2={cy + 22} />
                <PL x={232} y={cy} dim>CALLS</PL>
                <Label x={150} y={cy + 52}>ONE DEPLOYABLE · CLEAR LAYERS</Label>
              </>
            )}
          </>
        );
      case 'D1:monolith':
        return (
          <>
            <rect x={106} y={cy - 32} width={88} height={64} rx={12} {...F} className="aa-anim-breathe" />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={126 + (i % 2) * 48} cy={cy - 12 + Math.floor(i / 2) * 24} r={4} {...DOT} opacity={0.45} />
            ))}
            {L && (
              <>
                <PL x={150} y={cy + 2}>ALL FEATURES</PL>
                <Arrow x1={206} y1={cy} x2={238} y2={cy} />
                <PL x={252} y={cy + 3} dim>DEPLOY</PL>
                <PL x={252} y={cy + 13} dim>×1</PL>
                <Label x={150} y={cy + 54}>ONE APP · ONE RELEASE</Label>
              </>
            )}
          </>
        );
      case 'D1:modular-monolith':
        return (
          <>
            <rect x={82} y={cy - 33} width={136} height={66} rx={12} {...S} />
            {[0, 1, 2].map((c) =>
              [0, 1].map((r) => box(93 + c * 40, cy - 24 + r * 26, 32, 20, c === 1 && r === 0, c === 1 && r === 0 ? 'aa-anim-breathe' : undefined)),
            )}
            {L && (
              <>
                <PL x={109} y={cy - 11}>ORDERS</PL>
                <PL x={149} y={cy - 11}>BILLING</PL>
                <PL x={189} y={cy - 11}>USERS</PL>
                <PL x={150} y={cy + 44} dim>FIRM BOUNDARIES INSIDE</PL>
                <Label x={150} y={cy + 56}>MODULES · STILL ONE DEPLOY</Label>
              </>
            )}
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
            {L && (
              <>
                {pts.map(([x, y], i) => (
                  <PL key={x} x={x} y={y - 12}>{['CART', 'API', 'PAY', 'SHIP', 'STOCK'][i]}</PL>
                ))}
                <PL x={150} y={cy + 44} dim>EACH DEPLOYS ALONE, OVER THE NETWORK</PL>
                <Label x={150} y={cy + 56}>SMALL · AUTONOMOUS SERVICES</Label>
              </>
            )}
          </>
        );
      }
      case 'D1:serverless':
        return (
          <>
            {[118, 150, 182].map((x, i) => (
              <polygon key={x} points={`${x},${cy - 30} ${x - 12},${cy + 2} ${x - 2},${cy + 2} ${x - 9},${cy + 26} ${x + 11},${cy - 7} ${x},${cy - 7}`} {...F} className="aa-anim-flicker" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
            {L && (
              <>
                {[118, 150, 182].map((x) => (
                  <PL key={x} x={x} y={cy + 38}>fn()</PL>
                ))}
                <Arrow x1={78} y1={cy - 2} x2={100} y2={cy - 2} />
                <PL x={78} y={cy - 10} dim>EVENT</PL>
                <PL x={222} y={cy - 2} dim>SLEEPS AT 0</PL>
                <Label x={150} y={cy + 56}>RUNS ON DEMAND · PAY PER USE</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={106} y={cy + 4}>CLIENT</PL>
                <PL x={194} y={cy + 4}>SERVER</PL>
                <PL x={150} y={cy - 9} dim>REQUEST →</PL>
                <PL x={150} y={cy + 21} dim>← RESPONSE</PL>
                <PL x={150} y={cy + 38} dim>THE CALLER WAITS</PL>
                <Label x={150} y={cy + 54}>SIMPLE · TEMPORALLY COUPLED</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={98} y={cy + 4}>SENDER</PL>
                <PL x={152} y={cy - 15}>QUEUE</PL>
                <PL x={206} y={cy + 4}>WORKER</PL>
                <PL x={150} y={cy + 34} dim>SEND NOW — PROCESS WHEN READY</PL>
                <Label x={150} y={cy + 52}>DECOUPLED IN TIME</Label>
              </>
            )}
          </>
        );
      case 'D2:event-driven':
        return (
          <>
            <line x1={72} y1={cy + 16} x2={228} y2={cy + 16} {...S} strokeWidth={2.4} className="aa-anim-dash" />
            {[100, 150, 200].map((x, i) => (
              <g key={x}>
                {box(x - 22, cy - 30, 44, 24, i === 1)}
                <line x1={x} y1={cy - 6} x2={x} y2={cy + 14} {...S} opacity={0.5} />
                <circle cx={x} cy={cy + 16} r={3.4} {...DOT} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
              </g>
            ))}
            {L && (
              <>
                <PL x={100} y={cy - 15}>PUBLISH</PL>
                <PL x={150} y={cy - 15}>REACT</PL>
                <PL x={200} y={cy - 15}>REACT</PL>
                <PL x={150} y={cy + 30}>EVENT BUS</PL>
                <PL x={150} y={cy + 44} dim>ADD A NEW REACTOR WITHOUT TOUCHING PUBLISHERS</PL>
                <Label x={150} y={cy + 58}>FACTS FLOW · LOOSE COUPLING</Label>
              </>
            )}
          </>
        );
      case 'D2:streaming':
        return (
          <>
            <path d={`M 78 ${cy} C 96 ${cy - 22}, 114 ${cy - 22}, 132 ${cy} S 168 ${cy + 22}, 186 ${cy} S 214 ${cy - 22}, 222 ${cy - 8}`} {...S} strokeWidth={2.2} className="aa-anim-dash" />
            {[92, 132, 172, 210].map((x, i) => (
              <circle key={x} cx={x} cy={cy + (i % 2 === 0 ? -10 : 10)} r={3.2} {...DOT} opacity={0.6} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
            {L && (
              <>
                <PL x={78} y={cy - 18}>PRODUCER</PL>
                <PL x={150} y={cy + 32}>RECORDS, IN ORDER, REPLAYABLE</PL>
                <PL x={226} y={cy - 20}>CONSUMERS</PL>
                <Label x={150} y={cy + 52}>A CONTINUOUS, REPLAYABLE FLOW</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={96} y={cy - 21}>APP</PL>
                <PL x={150} y={cy - 21}>APP</PL>
                <PL x={204} y={cy - 21}>APP</PL>
                <PL x={150} y={cy + 20}>DB</PL>
                <PL x={216} y={cy + 18} dim>ONE ACID TX</PL>
                <Label x={150} y={cy + 52}>ONE SOURCE OF TRUTH</Label>
              </>
            )}
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
            {L && (
              <>
                {[96, 150, 204].map((x, i) => (
                  <PL key={x} x={x} y={cy - 18}>{['ORDERS', 'BILLING', 'USERS'][i]}</PL>
                ))}
                {[96, 150, 204].map((x) => (
                  <PL key={`d${x}`} x={x} y={cy + 15}>DB</PL>
                ))}
                <PL x={150} y={cy + 36} dim>NO SHARED TABLES — SYNC VIA EVENTS/API</PL>
                <Label x={150} y={cy + 52}>OWN DATA PER SERVICE</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={64} y={cy - 14}>APP</PL>
                <PL x={118} y={cy - 32}>WRITE MODEL</PL>
                <PL x={118} y={cy + 36}>READ MODEL</PL>
                <PL x={191} y={cy - 14}>SYNC</PL>
                <PL x={236} y={cy - 14}>QUERY</PL>
                <PL x={150} y={cy + 50} dim>EACH SIDE SHAPED FOR ITS JOB</PL>
                <Label x={150} y={cy + 62}>WRITE PATH ≠ READ PATH</Label>
              </>
            )}
          </>
        );
      case 'D3:event-sourcing':
        return (
          <>
            {[0, 1, 2, 3, 4].map((i) => box(84 + i * 28, cy - 10, 22, 20, i === 4, i === 4 ? 'aa-anim-breathe' : undefined))}
            <line x1={78} y1={cy + 22} x2={222} y2={cy + 22} {...S} opacity={0.4} />
            {L && (
              <>
                {[0, 1, 2, 3, 4].map((i) => (
                  <PL key={i} x={95 + i * 28} y={cy + 3}>E{i + 1}</PL>
                ))}
                <PL x={150} y={cy - 20} dim>EVERY CHANGE, APPENDED — NEVER EDITED</PL>
                <Arrow x1={222} y1={cy + 30} x2={244} y2={cy + 30} />
                <PL x={254} y={cy + 33} dim>REPLAY</PL>
                <Label x={150} y={cy + 52}>THE LOG IS THE TRUTH</Label>
              </>
            )}
          </>
        );
      case 'D3:polyglot':
        return (
          <>
            <Cyl x={88} y={cy - 14} w={30} h={26} />
            <polygon points={`150,${cy - 16} 165,${cy - 7} 165,${cy + 9} 150,${cy + 18} 135,${cy + 9} 135,${cy - 7}`} {...F} className="aa-anim-breathe" />
            {box(188, cy - 13, 28, 26)}
            {L && (
              <>
                <PL x={103} y={cy + 30}>SQL</PL>
                <PL x={150} y={cy + 30}>GRAPH</PL>
                <PL x={202} y={cy + 30}>KEY-VALUE</PL>
                <PL x={150} y={cy - 26} dim>EACH JOB GETS ITS BEST-FIT STORE</PL>
                <Label x={150} y={cy + 52}>RIGHT STORE PER JOB</Label>
              </>
            )}
          </>
        );

      // ---------------- D4 · code structure ----------------
      case 'D4:layered':
        return (
          <>
            {[0, 1, 2, 3].map((i) => box(100, cy - 36 + i * 19, 100, 14, i === 0))}
            {L && (
              <>
                <PL x={150} y={cy - 26}>API</PL>
                <PL x={150} y={cy - 7}>APPLICATION</PL>
                <PL x={150} y={cy + 12}>DOMAIN</PL>
                <PL x={150} y={cy + 31}>DATA</PL>
                <Arrow x1={212} y1={cy - 28} x2={212} y2={cy + 28} />
                <Label x={150} y={cy + 54}>CALLS FLOW DOWN, ONE WAY</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={150} y={cy + 2}>CORE</PL>
                <PL x={202} y={cy - 30}>ADAPTERS</PL>
                <PL x={98} y={cy + 34}>PORTS</PL>
                <PL x={150} y={cy + 52} dim>DB / UI / API PLUG IN — THE CORE NEVER KNOWS</PL>
                <Label x={150} y={cy + 64}>PORTS & ADAPTERS</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={150} y={cy + 2}>ENTITIES</PL>
                <PL x={150} y={cy - 27}>USE CASES</PL>
                <PL x={150} y={cy - 40} dim>UI · DB · FRAMEWORKS</PL>
                <Arrow x1={206} y1={cy - 18} x2={172} y2={cy - 4} anim={false} />
                <PL x={216} y={cy - 22} dim>IN</PL>
                <Label x={150} y={cy + 56}>DEPENDENCIES POINT INWARD</Label>
              </>
            )}
          </>
        );
      case 'D4:vertical-slice':
        return (
          <>
            {[0, 1, 2].map((i) => box(96, cy - 30 + i * 22, 108, 16))}
            <rect x={132} y={cy - 34} width={36} height={70} rx={8} {...F} className="aa-anim-breathe" />
            {L && (
              <>
                <PL x={116} y={cy - 20} dim>UI</PL>
                <PL x={116} y={cy + 2} dim>LOGIC</PL>
                <PL x={116} y={cy + 24} dim>DATA</PL>
                <PL x={150} y={cy + 2}>FEATURE</PL>
                <PL x={150} y={cy + 48} dim>SHIP A FEATURE, TOP TO BOTTOM</PL>
                <Label x={150} y={cy + 60}>ONE FEATURE, ALL LAYERS</Label>
              </>
            )}
          </>
        );

      // ---------------- D5 · frontend ----------------
      case 'D5:spa':
        return (
          <>
            <Browser x={108} y={cy - 28}>
              <rect x={116} y={cy - 10} width={68} height={30} rx={5} {...F} className="aa-anim-breathe" />
            </Browser>
            {L && (
              <>
                <PL x={150} y={cy + 8}>JS APP</PL>
                <Arrow x1={196} y1={cy + 4} x2={228} y2={cy + 4} />
                <PL x={240} y={cy + 7} dim>API</PL>
                <PL x={150} y={cy + 42} dim>RENDERS IN THE BROWSER, NO FULL RELOADS</PL>
                <Label x={150} y={cy + 56}>ONE PAGE, LIVE APP</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={94} y={cy + 4}>SERVER</PL>
                <PL x={122} y={cy - 8} dim>HTML</PL>
                <PL x={174} y={cy + 26}>READY-MADE PAGE</PL>
                <PL x={150} y={cy + 44} dim>FAST FIRST PAINT · GREAT SEO</PL>
                <Label x={150} y={cy + 58}>SERVER RENDERS FIRST</Label>
              </>
            )}
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
            {L && (
              <>
                <PL x={123} y={cy + 8}>A</PL>
                <PL x={150} y={cy + 8}>B</PL>
                <PL x={177} y={cy + 8}>C</PL>
                <PL x={150} y={cy - 34} dim>ONE PAGE, THREE TEAMS' CODE</PL>
                <PL x={150} y={cy + 42} dim>EACH SLICE SHIPS ON ITS OWN</PL>
                <Label x={150} y={cy + 56}>TEAMS OWN UI SLICES</Label>
              </>
            )}
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
