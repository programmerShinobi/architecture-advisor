import { useState } from 'react';
import {
  IconArrowRight,
  IconThumbUp,
  IconAlertTriangle,
  IconMicroscope,
  IconChevronRight,
  IconRocket,
  IconChecklist,
} from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { AVAILABLE_SECTIONS, sectionMeta } from '../config/sections';
import { contentBySection, contentBySlug, docTitle, docTldr } from '../lib/content';
import { renderMarkdown } from '../lib/markdown';
import { DIMENSIONS, DIMENSION_ORDER } from '../config/dimensions';
import { READER_SECTIONS, READER_CITATIONS } from '../config/readerContent';
import { PLAYBOOK_ANGLE, REVIEW_ANGLE } from '../config/readerAngles';
import { CredibilityBlock } from './CredibilityBlock';
import type { SectionId, ContentDoc } from '../config/contentSchema';
import type { DimensionId, Bilingual } from '../types';

// The "Learn" content area — a lazy-loaded island. Every architecture the Advisor evaluates (all
// D1–D5 options) appears across ALL THREE sections, data-driven from the model so coverage can never
// be partial or drift:
//   • Catalog  → what it is / when it fits / what it costs (explain it)
//   • Playbook → how to adopt it (+ decision guides in Markdown)
//   • Review   → what to check when evaluating it (+ review methods in Markdown)
// Guided/Expert (the app's mode, toggled once in the header) tailors the depth.

type Angle = 'catalog' | 'playbook' | 'review';

interface Props {
  onOpenAdvisor: () => void;
}

const totalArchitectures = READER_SECTIONS.reduce((n, s) => n + s.entries.length, 0);
const angleKey = (dim: DimensionId, optId: string) => `${dim}:${optId}`;

const cardBase: React.CSSProperties = {
  border: '0.5px solid var(--color-border-tertiary)',
  borderRadius: 'var(--border-radius-md)',
  padding: '15px 16px',
  background: 'var(--color-background-secondary)',
  textAlign: 'left',
  cursor: 'pointer',
  width: '100%',
};

function Sources({ cites }: { cites: string[] }) {
  const { t } = useI18n();
  const items = cites.map((k) => READER_CITATIONS[k]).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: '18px', borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: '13px' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
        {t('learn.sources')} · {items.length}
      </div>
      <ul style={{ display: 'grid', gap: '7px', margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', lineHeight: 1.5 }}>
        {items.map((c) => (
          <li key={c.key} style={{ display: 'flex', gap: '7px' }}>
            <span style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>›</span>
            <span>
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer noopener" style={{ color: 'var(--color-text-info)', fontWeight: 500 }}>
                  {c.label}
                </a>
              ) : (
                <span style={{ fontWeight: 500 }}>{c.label}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoBlock({ icon, label, text, color }: { icon: React.ReactNode; label: string; text: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <span style={{ color, marginTop: '2px', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color, marginBottom: '1px' }}>{label}</div>
        <div style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{text}</div>
      </div>
    </div>
  );
}

/**
 * One architecture, seen through ONE lens — rendered from the model, with no content repeated
 * across sections: Catalog explains it (what/when-fits/what-costs/deeper); Playbook gives only the
 * "how to adopt" angle; Review gives only the "what to check" angle. Playbook/Review cross-link to
 * the Catalog for the full explanation instead of duplicating it.
 */
function ArchitectureArticle({
  dim,
  optId,
  angle,
  onOpenAdvisor,
  onOpenCatalog,
}: {
  dim: DimensionId;
  optId: string;
  angle: Angle;
  onOpenAdvisor: () => void;
  onOpenCatalog: () => void;
}) {
  const { t, tr } = useI18n();
  const section = READER_SECTIONS.find((s) => s.dim === dim);
  const entry = section?.entries.find((e) => e.optionId === optId);
  if (!section || !entry) return <p>{t('learn.empty')}</p>;
  const key = angleKey(dim, optId);

  const header = (
    <>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
        {dim} · <span className="guided-only">{tr(DIMENSIONS[dim].guidedLabel)}</span><span className="expert-only">{tr(DIMENSIONS[dim].name)}</span>
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '14px' }}>{entry.name}</h2>
    </>
  );

  const tryAdvisor = (
    <div style={{ marginTop: '18px' }}>
      <button type="button" onClick={onOpenAdvisor} className="f-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        {t('learn.tryAdvisor')}
        <IconArrowRight size={14} aria-hidden />
      </button>
    </div>
  );

  // Playbook / Review — only the lens content, plus a cross-link to the Catalog (no duplication).
  if (angle !== 'catalog') {
    const lens = angle === 'playbook' ? PLAYBOOK_ANGLE[key] : REVIEW_ANGLE[key];
    const label = angle === 'playbook' ? t('learn.howToAdopt') : t('learn.whatToReview');
    const Icon = angle === 'playbook' ? IconRocket : IconChecklist;
    return (
      <article className="learn-article">
        {header}
        <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-info)', marginBottom: '6px', letterSpacing: '.03em' }}>
            <Icon size={16} aria-hidden />
            {label}
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{lens ? tr(lens) : ''}</p>
        </div>
        <p style={{ marginTop: '12px' }}>
          <button type="button" onClick={onOpenCatalog} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-text-info)', fontSize: '12.5px', fontWeight: 500 }}>
            {t('learn.seeInCatalog')}
          </button>
        </p>
        {tryAdvisor}
        <Sources cites={entry.cites} />
      </article>
    );
  }

  // Catalog — the full explanation.
  return (
    <article className="learn-article">
      {header}
      <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-info)', marginBottom: '4px', letterSpacing: '.04em' }}>{t('learn.tldr')}</div>
        <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{tr(entry.what)}</p>
      </div>
      <div style={{ display: 'grid', gap: '14px' }}>
        <InfoBlock icon={<IconThumbUp size={18} aria-hidden />} label={t('learn.whenFits')} text={tr(entry.fits)} color="var(--color-text-success)" />
        <InfoBlock icon={<IconAlertTriangle size={18} aria-hidden />} label={t('learn.whatCosts')} text={tr(entry.cost)} color="var(--color-text-cost)" />
      </div>
      <div className="expert-only" style={{ marginTop: '14px', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '13px 15px' }}>
        <InfoBlock icon={<IconMicroscope size={18} aria-hidden />} label={t('reader.deeper')} text={tr(entry.deeper)} color="var(--color-text-info)" />
      </div>
      {tryAdvisor}
      <Sources cites={entry.cites} />
    </article>
  );
}

/** A hand-authored Markdown article (decision guides / review methods). */
function MarkdownArticle({ doc, onOpenAdvisor }: { doc: ContentDoc; onOpenAdvisor: () => void }) {
  const { t, lang } = useI18n();
  return (
    <article className="learn-article">
      <h2 style={{ fontSize: '21px', fontWeight: 600, marginBottom: '8px' }}>{docTitle(doc, lang)}</h2>
      <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-info)', marginBottom: '4px', letterSpacing: '.04em' }}>{t('learn.tldr')}</div>
        <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{docTldr(doc, lang)}</p>
      </div>
      <div className="learn-prose" style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
        {renderMarkdown(doc.body)}
      </div>
      <div style={{ marginTop: '18px' }}>
        <button type="button" onClick={onOpenAdvisor} className="f-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {t('learn.tryAdvisor')}
          <IconArrowRight size={14} aria-hidden />
        </button>
      </div>
      <CredibilityBlock doc={doc} />
    </article>
  );
}

export default function LearnView({ onOpenAdvisor }: Props) {
  const { t, tr, lang } = useI18n();
  const [section, setSection] = useState<SectionId | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [arch, setArch] = useState<{ dim: DimensionId; optId: string; angle: Angle } | null>(null);

  const backLink = (label: string, onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', padding: 0 }}>
      {label}
    </button>
  );

  const shortAngle = (dim: DimensionId, optId: string, angle: Angle, entryWhat: Bilingual): string => {
    const key = angleKey(dim, optId);
    if (angle === 'playbook' && PLAYBOOK_ANGLE[key]) return tr(PLAYBOOK_ANGLE[key]);
    if (angle === 'review' && REVIEW_ANGLE[key]) return tr(REVIEW_ANGLE[key]);
    return tr(entryWhat);
  };

  // A dimension-grouped grid of every architecture, for a given lens.
  const architectureGrid = (angle: Angle) => (
    <>
      {DIMENSION_ORDER.map((dim) => (
        <section key={dim} style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>
            {dim} · <span className="guided-only">{tr(DIMENSIONS[dim].guidedLabel)}</span><span className="expert-only">{tr(DIMENSIONS[dim].name)}</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '10px', maxWidth: '68ch' }}>
            {tr(READER_SECTIONS.find((s) => s.dim === dim)?.intro ?? { en: '', id: '' })}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '11px' }}>
            {DIMENSIONS[dim].options.map((opt) => {
              const entry = READER_SECTIONS.find((s) => s.dim === dim)?.entries.find((e) => e.optionId === opt.id);
              return (
                <button key={opt.id} type="button" className="learn-card" style={cardBase} onClick={() => setArch({ dim, optId: opt.id, angle })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{opt.name}</span>
                    <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
                  </div>
                  {entry && <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>{shortAngle(dim, opt.id, angle, entry.what)}</div>}
                  <div style={{ fontSize: '10.5px', color: 'var(--color-text-info)', marginTop: '8px', fontWeight: 500 }}>{entry?.cites.length ?? 0} {t('learn.refs')}</div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );

  // ---- Architecture page (any lens) ----
  if (arch) {
    return (
      <div style={{ padding: '18px 20px' }}>
        {backLink(t('learn.back'), () => setArch(null))}
        <ArchitectureArticle
          dim={arch.dim}
          optId={arch.optId}
          angle={arch.angle}
          onOpenAdvisor={onOpenAdvisor}
          onOpenCatalog={() => setArch({ dim: arch.dim, optId: arch.optId, angle: 'catalog' })}
        />
      </div>
    );
  }

  // ---- Markdown article page ----
  if (slug) {
    const doc = contentBySlug(slug);
    return (
      <div style={{ padding: '18px 20px' }}>
        {backLink(t('learn.backToList'), () => setSlug(null))}
        {doc ? <MarkdownArticle doc={doc} onOpenAdvisor={onOpenAdvisor} /> : <p>{t('learn.empty')}</p>}
      </div>
    );
  }

  // ---- Section view ----
  if (section) {
    const meta = sectionMeta(section);
    const angle: Angle = section === 'playbook' ? 'playbook' : section === 'review' ? 'review' : 'catalog';
    const intro = section === 'catalog' ? t('learn.catalogIntro') : section === 'playbook' ? t('learn.playbookIntro') : t('learn.reviewIntro');
    const guides = section === 'catalog' ? [] : contentBySection(section);

    return (
      <div style={{ padding: '18px 20px' }}>
        {backLink(t('learn.back'), () => setSection(null))}
        <h1 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{meta ? t(meta.label) : section}</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '18px', maxWidth: '72ch' }}>
          {totalArchitectures} {t('learn.architectures')} · {intro}
        </p>

        {/* By architecture — all D1–D5 options, through this section's lens */}
        {section !== 'catalog' && (
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--color-text-tertiary)', margin: '4px 0 12px' }}>{t('learn.byArchitecture')}</h2>
        )}
        {architectureGrid(angle)}

        {/* Cross-cutting guides / methods (Markdown) */}
        {guides.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div className="f-div" style={{ margin: '4px 0 16px' }} />
            <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>{t('learn.guides')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '11px' }}>
              {guides.map((d) => (
                <button key={d.slug} type="button" className="learn-card" style={cardBase} onClick={() => setSlug(d.slug)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.3 }}>{docTitle(d, lang)}</span>
                    <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: '3px' }} />
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{docTldr(d, lang)}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--color-text-info)', marginTop: '8px', fontWeight: 500 }}>{d.sources.length} {t('learn.refs')}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- Sections landing ----
  return (
    <div style={{ padding: '18px 20px' }}>
      <h1 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '6px' }}>{t('learn.title')}</h1>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '6px', maxWidth: '72ch' }}>{t('learn.intro')}</p>
      <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '18px' }}>{t('learn.readingHint')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '14px' }}>
        {AVAILABLE_SECTIONS.map((s) => {
          const Icon = s.icon;
          const guides = s.id === 'catalog' ? 0 : contentBySection(s.id).length;
          return (
            <button key={s.id} type="button" className="learn-card" style={{ ...cardBase, padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => setSection(s.id)}>
              <span className="learn-chip">
                <Icon size={19} aria-hidden />
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>{t(s.label)}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5, flexGrow: 1 }}>{t(s.desc)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-info)', fontWeight: 600, flexWrap: 'wrap' }}>
                {totalArchitectures} {t('learn.architectures')}
                {guides > 0 && <span style={{ color: 'var(--color-text-tertiary)' }}>· {guides} {t('learn.guidesWord')}</span>}
                <IconArrowRight size={13} aria-hidden />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
