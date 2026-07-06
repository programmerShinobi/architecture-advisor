import { useState } from 'react';
import {
  IconArrowRight,
  IconThumbUp,
  IconAlertTriangle,
  IconMicroscope,
  IconChevronRight,
  IconChecklist,
  IconListNumbers,
  IconShieldCheck,
  IconBook2,
  IconPuzzle,
  IconAbc,
  IconTargetArrow,
  IconGauge,
  IconUsers,
  IconScale,
} from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { AVAILABLE_SECTIONS, sectionMeta } from '../config/sections';
import { contentBySection, contentBySlug, docTitle, docTldr } from '../lib/content';
import { renderMarkdown } from '../lib/markdown';
import { DIMENSIONS, DIMENSION_ORDER } from '../config/dimensions';
import { READER_SECTIONS, READER_CITATIONS } from '../config/readerContent';
import { INSIGHT_PLAYBOOKS } from '../config/insightPlaybooks';
import { INSIGHT_REVIEWS } from '../config/insightReviews';
import { INSIGHT_LIBRARY } from '../config/insightLibrary';
import { CredibilityBlock } from './CredibilityBlock';
import RoadmapView from './RoadmapView';
import AcademyView from './AcademyView';
import LabView from './LabView';
import { LEARNING_PATHS } from '../config/insightRoadmaps';
import { ACADEMY_QUIZZES } from '../config/academyQuizzes';
import { LAB_EXPERIMENTS } from '../config/labExperiments';
import type { SectionId, ContentDoc } from '../config/contentSchema';
import type { DimensionId, Levels } from '../types';

// The "Insights" content area — a lazy-loaded island implementing HOLISTIC ARCHITECTURE COVERAGE:
// every architecture the Advisor evaluates (all 21 D1–D5 options) appears in ALL FOUR lens
// sections, data-driven from the model so coverage can never be partial or drift. Each section is
// a distinct reading experience (no duplicated content — deep links cross-reference instead):
//   • Catalog  → discover: what it is / when it fits / what it costs
//   • Playbook → implement: goal, prerequisites, steps, best practices, pitfalls
//   • Review   → evaluate: pros/cons, performance, scalability, DX, use cases, verdict
//   • Library  → reference: definition, concepts, patterns, terminology
// Wave C adds three sections ON TOP of the lenses (they curate/exercise, never duplicate):
//   • Roadmap  → follow: guided learning paths whose steps deep-link into the lenses & articles
//   • Academy  → test: quiz modules scored client-side, wrong answers link back to the teaching page
//   • Lab      → experiment: hypothesis + prepared factor levels loaded into the live Advisor engine
// Content is English (product decision); UI chrome stays bilingual via the dict.

type Angle = 'catalog' | 'playbook' | 'review' | 'library';
const LENSES: Angle[] = ['catalog', 'playbook', 'review', 'library'];

interface Props {
  onOpenAdvisor: () => void;
  /** Load a Lab experiment's factor levels into the Advisor (and switch to it). */
  onLoadLab: (levels: Levels) => void;
}

const totalArchitectures = READER_SECTIONS.reduce((n, s) => n + s.entries.length, 0);
const angleKey = (dim: DimensionId, optId: string) => `${dim}:${optId}`;

const cardBase: React.CSSProperties = {
  border: '0.5px solid var(--color-border-tertiary)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--aa-card-pad)',
  background: 'var(--color-background-secondary)',
  textAlign: 'left',
  cursor: 'pointer',
  width: '100%',
};

const sectionHeading: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.04em',
  margin: '18px 0 8px',
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

function Bullets({ items, marker = '›', color = 'var(--color-text-tertiary)' }: { items: string[]; marker?: string; color?: string }) {
  return (
    <ul style={{ display: 'grid', gap: '6px', margin: 0, padding: 0, listStyle: 'none', fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
      {items.map((it) => (
        <li key={it} style={{ display: 'flex', gap: '8px' }}>
          <span style={{ color, flexShrink: 0 }}>{marker}</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function LensHeading({ icon, label, color = 'var(--color-text-info)' }: { icon: React.ReactNode; label: string; color?: string }) {
  return (
    <h3 style={{ ...sectionHeading, color }}>
      {icon}
      {label}
    </h3>
  );
}

/** The lens-switcher shown on every architecture page: jump between the four perspectives. */
function LensNav({ current, onSelect }: { current: Angle; onSelect: (a: Angle) => void }) {
  const { t } = useI18n();
  const label: Record<Angle, string> = {
    catalog: t('section.catalog'),
    playbook: t('section.playbook'),
    review: t('section.review'),
    library: t('section.library'),
  };
  return (
    <nav aria-label={t('learn.lensNav')} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '2px 0 16px' }}>
      {LENSES.map((a) => (
        <button
          key={a}
          type="button"
          aria-current={a === current ? 'page' : undefined}
          onClick={() => onSelect(a)}
          className="f-chip"
          style={a === current ? { color: 'var(--color-text-info)', background: 'var(--color-background-info)', borderColor: 'var(--color-border-info)' } : undefined}
        >
          {label[a]}
        </button>
      ))}
    </nav>
  );
}

/**
 * One architecture through ONE lens — all four lenses are data-driven from the model, each a
 * distinct reading experience (discover / implement / evaluate / reference). The LensNav lets the
 * reader walk the whole knowledge journey without leaving the page.
 */
function ArchitectureArticle({
  dim,
  optId,
  angle,
  onOpenAdvisor,
  onSelectLens,
}: {
  dim: DimensionId;
  optId: string;
  angle: Angle;
  onOpenAdvisor: () => void;
  onSelectLens: (a: Angle) => void;
}) {
  const { t, tr } = useI18n();
  const section = READER_SECTIONS.find((s) => s.dim === dim);
  const entry = section?.entries.find((e) => e.optionId === optId);
  if (!section || !entry) return <p>{t('learn.empty')}</p>;
  const key = angleKey(dim, optId);
  const playbook = INSIGHT_PLAYBOOKS[key];
  const review = INSIGHT_REVIEWS[key];
  const libraryRef = INSIGHT_LIBRARY[key];

  const header = (
    <>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
        {dim} · <span className="guided-only">{tr(DIMENSIONS[dim].guidedLabel)}</span><span className="expert-only">{tr(DIMENSIONS[dim].name)}</span>
      </div>
      <h2 style={{ fontSize: 'var(--aa-fs-2xl)', fontWeight: 600, marginBottom: '10px' }}>{entry.name}</h2>
      <LensNav current={angle} onSelect={onSelectLens} />
    </>
  );

  const lead = (text: string, label: string) => (
    <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '14px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-info)', marginBottom: '4px', letterSpacing: '.04em' }}>{label}</div>
      <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{text}</p>
    </div>
  );

  const tryAdvisor = (
    <div style={{ marginTop: '18px' }}>
      <button type="button" onClick={onOpenAdvisor} className="f-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        {t('learn.tryAdvisor')}
        <IconArrowRight size={14} aria-hidden />
      </button>
    </div>
  );

  // ---- Playbook lens: implement it, step by step ----
  if (angle === 'playbook' && playbook) {
    return (
      <article className="learn-article">
        {header}
        {lead(playbook.goal, t('learn.pb.goal'))}
        <LensHeading icon={<IconChecklist size={15} aria-hidden />} label={t('learn.pb.prereqs')} />
        <Bullets items={playbook.prerequisites} />
        <LensHeading icon={<IconListNumbers size={15} aria-hidden />} label={t('learn.pb.steps')} />
        <ol style={{ display: 'grid', gap: '7px', margin: 0, paddingLeft: '22px', fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
          {playbook.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <LensHeading icon={<IconShieldCheck size={15} aria-hidden />} label={t('learn.pb.practices')} color="var(--color-text-success)" />
        <Bullets items={playbook.practices} marker="✓" color="var(--color-text-success)" />
        <LensHeading icon={<IconAlertTriangle size={15} aria-hidden />} label={t('learn.pb.pitfalls')} color="var(--color-text-cost)" />
        <Bullets items={playbook.pitfalls} marker="!" color="var(--color-text-cost)" />
        {tryAdvisor}
        <Sources cites={entry.cites} />
      </article>
    );
  }

  // ---- Review lens: evaluate it objectively ----
  if (angle === 'review' && review) {
    const metric = (label: string, icon: React.ReactNode, text: string) => (
      <div style={{ ...cardBase, cursor: 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '5px' }}>
          {icon}
          {label}
        </div>
        <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>{text}</div>
      </div>
    );
    return (
      <article className="learn-article">
        {header}
        {lead(review.overview, t('learn.rv.overview'))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', marginBottom: '4px' }}>
          <div>
            <LensHeading icon={<IconThumbUp size={15} aria-hidden />} label={t('learn.rv.pros')} color="var(--color-text-success)" />
            <Bullets items={review.pros} marker="+" color="var(--color-text-success)" />
          </div>
          <div>
            <LensHeading icon={<IconAlertTriangle size={15} aria-hidden />} label={t('learn.rv.cons')} color="var(--color-text-cost)" />
            <Bullets items={review.cons} marker="−" color="var(--color-text-cost)" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '10px', margin: '14px 0' }}>
          {metric(t('learn.rv.performance'), <IconGauge size={13} aria-hidden />, review.performance)}
          {metric(t('learn.rv.scalability'), <IconTargetArrow size={13} aria-hidden />, review.scalability)}
          {metric(t('learn.rv.dx'), <IconUsers size={13} aria-hidden />, review.dx)}
        </div>
        <LensHeading icon={<IconChecklist size={15} aria-hidden />} label={t('learn.rv.useCases')} />
        <Bullets items={review.useCases} />
        <div style={{ marginTop: '16px', background: 'var(--color-background-success)', border: '1px solid var(--color-text-success)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-success)', marginBottom: '4px', letterSpacing: '.04em' }}>
            <IconScale size={14} aria-hidden />
            {t('learn.rv.verdict')}
          </div>
          <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{review.verdict}</p>
        </div>
        {tryAdvisor}
        <Sources cites={entry.cites} />
      </article>
    );
  }

  // ---- Library lens: the reference card ----
  if (angle === 'library' && libraryRef) {
    return (
      <article className="learn-article">
        {header}
        {lead(libraryRef.definition, t('learn.lb.definition'))}
        <LensHeading icon={<IconBook2 size={15} aria-hidden />} label={t('learn.lb.concepts')} />
        <Bullets items={libraryRef.concepts} />
        <LensHeading icon={<IconPuzzle size={15} aria-hidden />} label={t('learn.lb.patterns')} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {libraryRef.patterns.map((p) => (
            <span key={p} className="f-chip" style={{ cursor: 'default' }}>
              {p}
            </span>
          ))}
        </div>
        <LensHeading icon={<IconAbc size={15} aria-hidden />} label={t('learn.lb.terms')} />
        <dl style={{ display: 'grid', gap: '8px', margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
          {libraryRef.terms.map(({ term, def }) => (
            <div key={term}>
              <dt style={{ display: 'inline', fontWeight: 600, color: 'var(--color-text-primary)' }}>{term}</dt>
              <dd style={{ display: 'inline', margin: 0, color: 'var(--color-text-secondary)' }}> — {def}</dd>
            </div>
          ))}
        </dl>
        {tryAdvisor}
        <Sources cites={entry.cites} />
      </article>
    );
  }

  // ---- Catalog lens (default): discover it ----
  return (
    <article className="learn-article">
      {header}
      {lead(tr(entry.what), t('learn.tldr'))}
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

/** A hand-authored Markdown article (cross-cutting guides / methods / further reading). */
function MarkdownArticle({ doc, onOpenAdvisor }: { doc: ContentDoc; onOpenAdvisor: () => void }) {
  const { t, lang } = useI18n();
  return (
    <article className="learn-article">
      <h2 style={{ fontSize: 'var(--aa-fs-2xl)', fontWeight: 600, marginBottom: '8px' }}>{docTitle(doc, lang)}</h2>
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

export default function LearnView({ onOpenAdvisor, onLoadLab }: Props) {
  const { t, tr, lang } = useI18n();
  const [section, setSection] = useState<SectionId | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [arch, setArch] = useState<{ dim: DimensionId; optId: string; angle: Angle } | null>(null);

  const backLink = (label: string, onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', padding: 0 }}>
      {label}
    </button>
  );

  // The one-line card blurb differs per lens so each section reads distinctly.
  const cardBlurb = (dim: DimensionId, optId: string, angle: Angle): string => {
    const key = angleKey(dim, optId);
    if (angle === 'playbook') return INSIGHT_PLAYBOOKS[key]?.goal ?? '';
    if (angle === 'review') return INSIGHT_REVIEWS[key]?.overview ?? '';
    if (angle === 'library') return INSIGHT_LIBRARY[key]?.definition ?? '';
    const entry = READER_SECTIONS.find((s) => s.dim === dim)?.entries.find((e) => e.optionId === optId);
    return entry ? tr(entry.what) : '';
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
              const blurb = cardBlurb(dim, opt.id, angle);
              return (
                <button key={opt.id} type="button" className="learn-card" style={cardBase} onClick={() => setArch({ dim, optId: opt.id, angle })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{opt.name}</span>
                    <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
                  </div>
                  {blurb && <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>{blurb}</div>}
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
      <div className="aa-panel">
        {backLink(t('learn.back'), () => setArch(null))}
        <ArchitectureArticle
          dim={arch.dim}
          optId={arch.optId}
          angle={arch.angle}
          onOpenAdvisor={onOpenAdvisor}
          onSelectLens={(a) => setArch({ dim: arch.dim, optId: arch.optId, angle: a })}
        />
      </div>
    );
  }

  // ---- Markdown article page ----
  if (slug) {
    const doc = contentBySlug(slug);
    return (
      <div className="aa-panel">
        {backLink(t('learn.backToList'), () => setSlug(null))}
        {doc ? <MarkdownArticle doc={doc} onOpenAdvisor={onOpenAdvisor} /> : <p>{t('learn.empty')}</p>}
      </div>
    );
  }

  // ---- Section view (all four sections carry the per-architecture grid) ----
  if (section) {
    const meta = sectionMeta(section);
    const isLens = (LENSES as string[]).includes(section);
    const angle = (isLens ? section : 'catalog') as Angle;
    const intro =
      section === 'catalog' ? t('learn.catalogIntro')
      : section === 'playbook' ? t('learn.playbookIntro')
      : section === 'review' ? t('learn.reviewIntro')
      : section === 'library' ? t('learn.libraryIntro')
      : section === 'roadmap' ? t('learn.roadmapIntro')
      : section === 'academy' ? t('learn.academyIntro')
      : section === 'lab' ? t('learn.labIntro')
      : meta ? t(meta.desc) : '';
    const guides = section === 'catalog' ? [] : contentBySection(section);
    const countLine =
      section === 'roadmap' ? `${LEARNING_PATHS.length} ${t('learn.paths')} · `
      : section === 'academy' ? `${ACADEMY_QUIZZES.length} ${t('learn.modules')} · `
      : section === 'lab' ? `${LAB_EXPERIMENTS.length} ${t('learn.experiments')} · `
      : isLens ? `${totalArchitectures} ${t('learn.architectures')} · `
      : `${guides.length} ${t('learn.articles')} · `;

    return (
      <div className="aa-panel">
        {backLink(t('learn.back'), () => setSection(null))}
        <h1 style={{ fontSize: 'var(--aa-fs-xl)', fontWeight: 600, marginBottom: '4px' }}>{meta ? t(meta.label) : section}</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '18px', maxWidth: '72ch' }}>
          {countLine}{intro}
        </p>

        {/* Wave C sections: curated journeys, quizzes, and live-engine experiments. */}
        {section === 'roadmap' && (
          <RoadmapView
            onOpenArch={(dim, optId, lens) => setArch({ dim, optId, angle: lens })}
            onOpenArticle={setSlug}
            onOpenAdvisor={onOpenAdvisor}
          />
        )}
        {section === 'academy' && (
          <AcademyView onOpenArch={(dim, optId, lens) => setArch({ dim, optId, angle: lens })} onOpenArticle={setSlug} />
        )}
        {section === 'lab' && <LabView onRun={onLoadLab} />}

        {/* By architecture — all D1–D5 options, through this section's lens */}
        {isLens && section !== 'catalog' && (
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--color-text-tertiary)', margin: '4px 0 12px' }}>{t('learn.byArchitecture')}</h2>
        )}
        {isLens && architectureGrid(angle)}

        {/* Cross-cutting Markdown pieces: guides/methods under Playbook & Review, further reading under Library. */}
        {guides.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {isLens && <div className="f-div" style={{ margin: '4px 0 16px' }} />}
            {isLens && (
              <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
                {section === 'library' ? t('learn.furtherReading') : t('learn.guides')}
              </h2>
            )}
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
    <div className="aa-panel">
      <h1 style={{ fontSize: 'var(--aa-fs-xl)', fontWeight: 600, marginBottom: '6px' }}>{t('learn.title')}</h1>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '6px', maxWidth: '72ch' }}>{t('learn.intro')}</p>
      <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '18px' }}>{t('learn.readingHint')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '14px' }}>
        {AVAILABLE_SECTIONS.map((s) => {
          const Icon = s.icon;
          const isLens = (LENSES as string[]).includes(s.id);
          const guides = s.id === 'catalog' ? 0 : contentBySection(s.id).length;
          return (
            <button key={s.id} type="button" className="learn-card" style={{ ...cardBase, padding: 'var(--aa-panel-pad)', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => setSection(s.id)}>
              <span className="learn-chip">
                <Icon size={19} aria-hidden />
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>{t(s.label)}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5, flexGrow: 1 }}>{t(s.desc)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-info)', fontWeight: 600, flexWrap: 'wrap' }}>
                {isLens ? (
                  <>
                    {totalArchitectures} {t('learn.architectures')}
                    {guides > 0 && <span style={{ color: 'var(--color-text-tertiary)' }}>· {guides} {t('learn.guidesWord')}</span>}
                  </>
                ) : s.id === 'roadmap' ? (
                  <>{LEARNING_PATHS.length} {t('learn.paths')}</>
                ) : s.id === 'academy' ? (
                  <>{ACADEMY_QUIZZES.length} {t('learn.modules')}</>
                ) : s.id === 'lab' ? (
                  <>{LAB_EXPERIMENTS.length} {t('learn.experiments')}</>
                ) : (
                  <>{guides} {t('learn.articles')}</>
                )}
                <IconArrowRight size={13} aria-hidden />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
