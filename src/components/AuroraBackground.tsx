import { useEffect } from 'react';

/**
 * Aurora Slate signature background (ADR-009) — three blurred, drifting gradient blobs behind the
 * app frame. Purely decorative (`aria-hidden`), screen-only, and non-interactive. The drift is
 * transform-only and CSS disables it under `prefers-reduced-motion`; on low-core devices we add
 * `aurora-static` to freeze the drift (the blur stays) as a cheap INP/paint safeguard. Styling and
 * the guards live in `index.css` (`.aa-aurora`); the app content sits above it via `.aa-page`.
 */
export function AuroraBackground() {
  useEffect(() => {
    const cores = navigator.hardwareConcurrency;
    if (typeof cores === 'number' && cores <= 4) {
      document.documentElement.classList.add('aurora-static');
    }
  }, []);

  return (
    <div className="aa-aurora screen-only" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}
