import { useI18n } from '../i18n/I18nContext';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../config/qualityAttributes';
import { GLOSSARY } from '../config/glossary';

// Collapsible reference: the 12 quality attributes (with ISO mapping) and key method terms.
export function Glossary() {
  const { t, tr } = useI18n();

  return (
    <section className="rounded-xl border border-line bg-surface">
      <details className="group">
        <summary className="cursor-pointer list-none p-4 text-base font-semibold">
          <span className="inline-block transition-transform group-open:rotate-90">▸</span>{' '}
          {t('glossary.heading')}
        </summary>
        <div className="space-y-4 px-4 pb-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {t('glossary.qa')}
            </h3>
            <dl className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {QA_ORDER.map((q) => {
                const qa = QUALITY_ATTRIBUTES[q];
                return (
                  <div key={q} className="text-sm">
                    <dt className="font-medium">
                      {tr(qa.name)}
                      {qa.economicFlag && (
                        <span className="ml-1 rounded bg-surface-2 px-1 text-[10px] uppercase tracking-wide text-ink-soft">
                          {t('priorities.economic')}
                        </span>
                      )}
                    </dt>
                    <dd className="text-xs text-ink-soft">{qa.isoMapping}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {t('glossary.terms')}
            </h3>
            <dl className="mt-2 space-y-1.5">
              {GLOSSARY.map((g) => (
                <div key={g.term.en} className="text-sm">
                  <dt className="font-medium">{tr(g.term)}</dt>
                  <dd className="text-xs text-ink-soft">{tr(g.definition)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </details>
    </section>
  );
}
