import { useI18n } from '../i18n/I18nContext';
import { METHOD_REFERENCES } from '../config/references';

// "How it works" — the methods the tool operationalizes, with public sources (credibility).
export function MethodologyPanel({ bare = false }: { bare?: boolean }) {
  const { t, tr } = useI18n();

  const body = (
    <>
      <p className={bare ? 'text-sm leading-relaxed text-ink-soft' : 'mt-2 text-sm leading-relaxed text-ink-soft'}>
        {t('methodology.intro')}
      </p>

      <ul className="mt-3 space-y-1.5 text-sm">
        {METHOD_REFERENCES.map((ref) => (
          <li key={ref.label} className="leading-snug">
            <a
              href={ref.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand hover:underline"
            >
              {ref.label}
            </a>
            <span className="text-ink-soft"> — {tr(ref.note)}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (bare) return body;
  return (
    <section aria-labelledby="methodology-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="methodology-heading" className="text-base font-semibold">
        {t('methodology.heading')}
      </h3>
      {body}
    </section>
  );
}
