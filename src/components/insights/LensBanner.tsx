import type { ReactNode } from 'react';

/**
 * Static hero visual for the Playbook / Review / Library lens pages (Fase 2d, owner request):
 * NOT animated — a calm diagram that shows what the lens itself IS (steps you follow, an
 * evaluation with a verdict, a reference shelf), in the same visual language as the Catalog
 * symbols. Labels are short universal mono words, identical in both languages.
 */

const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
const DOT = { fill: 'var(--color-text-info)' } as const;

const Label = ({ x, y, children }: Readonly<{ x: number; y: number; children: ReactNode }>) => (
  <text x={x} y={y} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', fill: 'var(--color-text-tertiary)' }}>
    {children}
  </text>
);

export function LensBanner({ lens }: Readonly<{ lens: 'playbook' | 'review' | 'library' }>) {
  let body: ReactNode;
  if (lens === 'playbook') {
    // A playbook: numbered steps you follow, ending in the thing you build.
    body = (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={70} cy={22 + i * 22} r={8} {...(i === 0 ? F : S)} />
            <text x={70} y={25 + i * 22} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--color-text-info)' }}>
              {i + 1}
            </text>
            <line x1={86} y1={22 + i * 22} x2={i === 0 ? 196 : 176 - i * 18} y2={22 + i * 22} {...S} opacity={0.5} />
          </g>
        ))}
        <line x1={214} y1={44} x2={232} y2={44} {...S} />
        <rect x={236} y={26} width={36} height={36} rx={8} {...F} />
        <Label x={150} y={86}>STEPS → BUILD</Label>
      </>
    );
  } else if (lens === 'review') {
    // A review: evidence weighed on a gauge, ending in a verdict.
    body = (
      <>
        <path d="M 96 58 A 44 44 0 0 1 184 58" {...S} strokeWidth={2.2} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.PI - (Math.PI / 4) * i;
          return <circle key={i} cx={140 + 44 * Math.cos(a)} cy={58 - 44 * Math.sin(a)} r={2.6} {...DOT} opacity={0.5} />;
        })}
        <line x1={140} y1={58} x2={168} y2={30} stroke="var(--color-text-info)" strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={140} cy={58} r={5} {...DOT} />
        <rect x={206} y={40} width={44} height={20} rx={10} {...F} />
        <Label x={228} y={53}>✓</Label>
        <Label x={150} y={86}>EVIDENCE → VERDICT</Label>
      </>
    );
  } else {
    // A library: the reference shelf — spines + one opened book.
    body = (
      <>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={86 + i * 16} y={18 + (i % 2) * 3} width={12} height={46 - (i % 2) * 3} rx={3} {...(i === 1 ? F : S)} />
        ))}
        <path d="M 158 30 q 22 -8 44 0 v 32 q -22 -8 -44 0 Z" {...F} />
        <path d="M 202 30 q 22 -8 44 0 v 32 q -22 -8 -44 0 Z" {...S} />
        <line x1={202} y1={30} x2={202} y2={62} {...S} opacity={0.6} />
        <Label x={150} y={86}>CONCEPTS · TERMS · SOURCES</Label>
      </>
    );
  }
  return (
    <div className="learn-art-hero" style={{ height: '108px', marginBottom: '18px' }} aria-hidden>
      <svg className="lp-art" viewBox="0 0 300 92" focusable="false">
        {body}
      </svg>
    </div>
  );
}
