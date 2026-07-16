/**
 * The brand glyph v5 (Fase 2, DECISIONS.md): a minimal modern COMPASS — ring, needle, hub —
 * in a single color on a TRANSPARENT background. Drawn with `currentColor`, so it is black in
 * the light theme (the owner's elegant default) and automatically light in dark contexts.
 * Mirrors `public/favicon.svg` (the single source). Decorative: parents provide the
 * accessible name and the color context.
 */
export function BrandMark({ size = 34 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden focusable="false" style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="6" />
      {/* cardinal ticks */}
      <circle cx="50" cy="21" r="2.4" fill="currentColor" opacity="0.55" />
      <circle cx="79" cy="50" r="2.4" fill="currentColor" opacity="0.55" />
      <circle cx="50" cy="79" r="2.4" fill="currentColor" opacity="0.55" />
      <circle cx="21" cy="50" r="2.4" fill="currentColor" opacity="0.55" />
      {/* needle: solid north blade, outlined south blade (one color, two weights) */}
      <g transform="rotate(40 50 50)">
        <polygon points="50,19 58.5,50 41.5,50" fill="currentColor" />
        <polygon points="50,81 56.5,50 43.5,50" fill="none" stroke="currentColor" strokeWidth="4.6" strokeLinejoin="round" />
      </g>
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  );
}
