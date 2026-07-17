import type { ReactNode } from 'react';

/**
 * Living hero visual for EVERY Insights section page (Fase 2e, owner request — the outermost
 * level of each lens carries a moving symbol of what the lens IS): discover the catalog, follow
 * playbook steps, weigh a review, look things up in the library, walk a roadmap, answer academy
 * questions, run lab experiments. Gentle `aa-anim-*` motion (auto-frozen under reduced-motion /
 * low-core). Labels are short universal mono words, identical in both languages.
 */

const S = { stroke: 'var(--color-text-info)', strokeWidth: 1.6, fill: 'none', opacity: 0.75 } as const;
const F = { fill: 'var(--color-background-info)', stroke: 'var(--color-text-info)', strokeWidth: 1.4, opacity: 0.8 } as const;
const DOT = { fill: 'var(--color-text-info)' } as const;

const Label = ({ x, y, children }: Readonly<{ x: number; y: number; children: ReactNode }>) => (
  <text x={x} y={y} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.08em', fill: 'var(--color-text-tertiary)' }}>
    {children}
  </text>
);

export type LensId = 'catalog' | 'playbook' | 'review' | 'library' | 'roadmap' | 'academy' | 'lab';

export function LensBanner({ lens }: Readonly<{ lens: LensId }>) {
  let body: ReactNode;
  if (lens === 'catalog') {
    // The catalog: a wall of pattern symbols, one lit under the lens.
    body = (
      <>
        {[0, 1, 2, 3].map((c) =>
          [0, 1].map((r) => (
            <rect key={`${c}-${r}`} x={72 + c * 34} y={16 + r * 26} width={26} height={18} rx={5} {...(c === 1 && r === 0 ? F : S)} opacity={c === 1 && r === 0 ? 1 : 0.5} className={c === 1 && r === 0 ? 'aa-anim-breathe' : undefined} />
          )),
        )}
        <circle cx={224} cy={34} r={16} {...S} strokeWidth={2} className="aa-anim-breathe" />
        <line x1={236} y1={46} x2={250} y2={60} {...S} strokeWidth={2.4} strokeLinecap="round" />
        <Label x={150} y={86}>DISCOVER · 21 PATTERNS</Label>
      </>
    );
  } else if (lens === 'playbook') {
    // A playbook: numbered steps you follow, ending in the thing you build.
    body = (
      <>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={70} cy={22 + i * 22} r={8} {...(i === 0 ? F : S)} className={i === 0 ? 'aa-anim-breathe' : undefined} />
            <text x={70} y={25 + i * 22} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--color-text-info)' }}>
              {i + 1}
            </text>
            <line x1={86} y1={22 + i * 22} x2={i === 0 ? 196 : 176 - i * 18} y2={22 + i * 22} {...S} opacity={0.5} strokeDasharray="4 6" className="aa-anim-dash" />
          </g>
        ))}
        <line x1={214} y1={44} x2={232} y2={44} {...S} strokeDasharray="4 6" className="aa-anim-dash" />
        <rect x={236} y={26} width={36} height={36} rx={8} {...F} className="aa-anim-breathe" />
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
        <line x1={140} y1={58} x2={168} y2={30} stroke="var(--color-text-info)" strokeWidth={2.4} strokeLinecap="round" className="aa-anim-breathe" />
        <circle cx={140} cy={58} r={5} {...DOT} />
        <rect x={206} y={40} width={44} height={20} rx={10} {...F} className="aa-anim-breathe" />
        <Label x={228} y={53}>✓</Label>
        <Label x={150} y={86}>EVIDENCE → VERDICT</Label>
      </>
    );
  } else if (lens === 'library') {
    // A library: the reference shelf — spines + one opened book.
    body = (
      <>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={86 + i * 16} y={18 + (i % 2) * 3} width={12} height={46 - (i % 2) * 3} rx={3} {...(i === 1 ? F : S)} className={i === 1 ? 'aa-anim-breathe' : undefined} />
        ))}
        <path d="M 158 30 q 22 -8 44 0 v 32 q -22 -8 -44 0 Z" {...F} className="aa-anim-breathe" />
        <path d="M 202 30 q 22 -8 44 0 v 32 q -22 -8 -44 0 Z" {...S} />
        <line x1={202} y1={30} x2={202} y2={62} {...S} opacity={0.6} />
        <Label x={150} y={86}>CONCEPTS · TERMS · SOURCES</Label>
      </>
    );
  } else if (lens === 'roadmap') {
    // A roadmap: milestones climbing toward the flag.
    body = (
      <>
        <path d="M 72 66 q 40 -8 74 -22 t 78 -24" {...S} strokeWidth={2} strokeDasharray="5 7" className="aa-anim-dash" />
        {[[92, 62], [148, 42], [204, 24]].map(([x, y], i) => (
          <circle key={x} cx={x} cy={y} r={5} {...F} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
        <line x1={232} y1={16} x2={232} y2={40} {...S} strokeWidth={2} />
        <polygon points="232,16 250,22 232,28" {...F} className="aa-anim-breathe" />
        <Label x={150} y={86}>PATH → SKILL</Label>
      </>
    );
  } else if (lens === 'academy') {
    // The academy: a question card, choices, one glowing correct.
    body = (
      <>
        <rect x={82} y={14} width={92} height={22} rx={6} {...S} />
        <text x={128} y={29} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--color-text-info)' }}>?</text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={82} y={44 + i * 16} width={i === 1 ? 110 : 92} height={10} rx={5} {...(i === 1 ? F : S)} opacity={i === 1 ? 1 : 0.5} className={i === 1 ? 'aa-anim-breathe' : undefined} />
        ))}
        <circle cx={216} cy={49} r={9} {...F} className="aa-anim-breathe" />
        <Label x={216} y={53}>✓</Label>
        <Label x={150} y={86}>ANSWER → UNDERSTAND</Label>
      </>
    );
  } else {
    // The lab: a flask feeding the live engine's radar.
    body = (
      <>
        <path d="M 96 18 v 14 l -16 26 a 8 8 0 0 0 7 12 h 34 a 8 8 0 0 0 7 -12 l -16 -26 v -14 Z" {...S} strokeWidth={2} />
        {[[96, 52], [106, 58], [90, 60]].map(([x, y], i) => (
          <circle key={x * 100 + y} cx={x} cy={y} r={2.6} {...DOT} className="aa-anim-breathe" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
        <line x1={132} y1={44} x2={158} y2={44} {...S} strokeDasharray="4 6" className="aa-anim-dash" />
        {(() => {
          const pts = Array.from({ length: 5 }, (_, i) => {
            const a = ((Math.PI * 2) / 5) * i - Math.PI / 2;
            return `${(196 + 26 * Math.cos(a)).toFixed(1)},${(42 + 26 * Math.sin(a)).toFixed(1)}`;
          }).join(' ');
          return <polygon points={pts} {...F} className="aa-anim-breathe" />;
        })()}
        <Label x={150} y={86}>TRY IT ON THE REAL ENGINE</Label>
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
