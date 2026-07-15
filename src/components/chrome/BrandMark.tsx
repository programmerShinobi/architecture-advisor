/**
 * The brand glyph v4 (Fase 1): the "neural radar" — a luminous decision core linked to five
 * glowing dimension nodes (5 dimensions → 1 recommendation), thin neon lines with real glow.
 * Mirrors `public/favicon.svg` (the single source); self-contained (renders its own tile),
 * so it works on any header background in both themes. Decorative: parents provide the
 * accessible name.
 */
export function BrandMark({ size = 34 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden focusable="false" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="aa-bm-ln" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b7cff" />
          <stop offset="0.55" stopColor="#38e1ff" />
          <stop offset="1" stopColor="#7cf5c8" />
        </linearGradient>
        <radialGradient id="aa-bm-tile" cx="0.5" cy="0.32" r="0.9">
          <stop offset="0" stopColor="#151a33" />
          <stop offset="1" stopColor="#05060f" />
        </radialGradient>
        <radialGradient id="aa-bm-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#c9d4ff" />
          <stop offset="1" stopColor="#8b7cff" />
        </radialGradient>
        <filter id="aa-bm-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" rx="23" fill="url(#aa-bm-tile)" />
      <g filter="url(#aa-bm-glow)">
        <polygon points="50,20 81.4,42.8 69.4,79.7 30.6,79.7 18.6,42.8" fill="none" stroke="url(#aa-bm-ln)" strokeWidth="1.6" strokeLinejoin="round" opacity="0.5" />
        <g stroke="url(#aa-bm-ln)" strokeWidth="2" strokeLinecap="round" opacity="0.9">
          <line x1="50" y1="53" x2="50" y2="20" />
          <line x1="50" y1="53" x2="81.4" y2="42.8" />
          <line x1="50" y1="53" x2="69.4" y2="79.7" />
          <line x1="50" y1="53" x2="30.6" y2="79.7" />
          <line x1="50" y1="53" x2="18.6" y2="42.8" />
        </g>
        <circle cx="50" cy="20" r="4.2" fill="#38e1ff" />
        <circle cx="81.4" cy="42.8" r="3.4" fill="#7cf5c8" />
        <circle cx="69.4" cy="79.7" r="3.4" fill="#8b7cff" />
        <circle cx="30.6" cy="79.7" r="3.4" fill="#ff7ac3" />
        <circle cx="18.6" cy="42.8" r="3.4" fill="#a99bff" />
        <circle cx="50" cy="53" r="9" fill="url(#aa-bm-core)" />
      </g>
    </svg>
  );
}
