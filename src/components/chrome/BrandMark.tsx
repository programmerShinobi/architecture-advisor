/**
 * The brand glyph v2 (Fase 1): dark tile + aurora-gradient radar pentagon with one lit decision
 * apex — "five dimensions, one recommendation". Mirrors `public/favicon.svg` (the single source);
 * self-contained (renders its own tile), so it works on any header background in both themes.
 * Decorative: parents provide the accessible name.
 */
export function BrandMark({ size = 34 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden focusable="false" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="aa-bm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b7cff" />
          <stop offset="0.55" stopColor="#38e1ff" />
          <stop offset="1" stopColor="#7cf5c8" />
        </linearGradient>
        <radialGradient id="aa-bm-halo" cx="0.5" cy="0.26" r="0.55">
          <stop offset="0" stopColor="#8b7cff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8b7cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="23" fill="#0a0c1a" />
      <rect width="100" height="100" rx="23" fill="url(#aa-bm-halo)" />
      <polygon points="50,25 76.6,44.3 66.4,75.6 33.6,75.6 23.4,44.3" fill="none" stroke="url(#aa-bm-g)" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="76.6" cy="44.3" r="3.4" fill="#38e1ff" />
      <circle cx="66.4" cy="75.6" r="3.4" fill="#7cf5c8" />
      <circle cx="33.6" cy="75.6" r="3.4" fill="#38e1ff" />
      <circle cx="23.4" cy="44.3" r="3.4" fill="#8b7cff" />
      <circle cx="50" cy="25" r="9.5" fill="#0a0c1a" />
      <circle cx="50" cy="25" r="7" fill="url(#aa-bm-g)" />
      <circle cx="50" cy="25" r="2.8" fill="#ffffff" />
    </svg>
  );
}
