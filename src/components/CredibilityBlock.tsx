import { IconCalendarClock, IconAlertTriangle } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import type { DictKey } from '../i18n/dict';
import { isReviewDue } from '../lib/content';
import type { ContentDoc, EvidenceStrength } from '../config/contentSchema';

// The trust footer for an article: evidence-strength badge, cited primary sources, last-reviewed
// date, and a "needs review" flag once the 12-month window lapses. Keeps content honest and
// auditable — the same value the Advisor upholds for its scores.

const EVIDENCE_KEY: Record<EvidenceStrength, DictKey> = {
  strong: 'learn.evidence.strong',
  moderate: 'learn.evidence.moderate',
  emerging: 'learn.evidence.emerging',
};
const EVIDENCE_COLOR: Record<EvidenceStrength, string> = {
  strong: 'var(--color-text-success)',
  moderate: 'var(--color-text-info)',
  emerging: 'var(--color-text-cost)',
};

export function CredibilityBlock({ doc }: { doc: ContentDoc }) {
  const { t } = useI18n();
  const due = isReviewDue(doc);

  return (
    <aside
      aria-label={t('learn.sources')}
      style={{
        marginTop: '22px',
        borderTop: '0.5px solid var(--color-border-tertiary)',
        paddingTop: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: EVIDENCE_COLOR[doc.evidence_strength],
            border: `1px solid ${EVIDENCE_COLOR[doc.evidence_strength]}`,
            borderRadius: '99px',
            padding: '2px 10px',
          }}
        >
          {t(EVIDENCE_KEY[doc.evidence_strength])}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          <IconCalendarClock size={14} aria-hidden />
          {t('learn.lastReviewed')}: {doc.last_reviewed}
        </span>
        {due && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-cost)', fontWeight: 600 }}>
            <IconAlertTriangle size={14} aria-hidden />
            {t('learn.reviewDue')}
          </span>
        )}
      </div>

      <div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>
          {t('learn.sources')}
        </div>
        <ul style={{ display: 'grid', gap: '5px', margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', lineHeight: 1.5 }}>
          {doc.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer noopener" style={{ color: 'var(--color-text-info)', fontWeight: 500 }}>
                {s.label}
              </a>
              <span style={{ color: 'var(--color-text-tertiary)' }}> — {s.venue}, {s.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
