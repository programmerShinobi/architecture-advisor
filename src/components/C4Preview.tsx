import { useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  code: string;
}

// Renders the C4-style Mermaid stub. mermaid is imported dynamically inside the effect, so it
// only loads when this component mounts (kept off the first-paint path, ADR-008).
export function C4Preview({ code }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    let cancelled = false;
    setError(false);
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        });
        const { svg } = await mermaid.render(`c4-${rawId}`, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, rawId]);

  return (
    <section aria-labelledby="c4-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="c4-heading" className="text-base font-semibold">
        {t('c4.heading')}
      </h3>
      {error ? (
        <p className="mt-2 text-sm text-ink-soft">{t('c4.error')}</p>
      ) : (
        <div ref={ref} className="mt-3 overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full" />
      )}
    </section>
  );
}
