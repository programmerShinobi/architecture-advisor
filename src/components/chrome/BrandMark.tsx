/**
 * The brand glyph (Fase 1): a 5-dimension radar pentagon with one lit decision apex —
 * "five dimensions, one recommendation". Geometry mirrors `public/favicon.svg` (the single
 * source, minus the gradient tile: in-app the glyph sits on the existing gradient chip).
 * Decorative: parents provide the accessible name.
 */
export function BrandMark({ size = 21 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden focusable="false">
      <g stroke="#05060f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <polygon fill="none" points="50,22 78.5,42.7 67.6,76.3 32.4,76.3 21.5,42.7" />
        <polygon fill="#05060f" fillOpacity="0.3" points="50,22 65.7,46.9 63.2,70.2 39.4,66.6 27.2,44.6" />
      </g>
      <circle cx="50" cy="22" r="9" fill="#05060f" />
      <circle cx="50" cy="22" r="3.6" fill="#ffffff" />
    </svg>
  );
}
