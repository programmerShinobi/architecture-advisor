import { useState } from 'react';
import { IconArrowRight, IconChevronRight, IconTargetArrow } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { LEARNING_PATHS, type LearningPath, type RoadmapStep, type LensId } from '../config/insightRoadmaps';
import { DIMENSIONS } from '../config/dimensions';
import { contentBySlug, docTitle } from '../lib/content';
import type { DimensionId } from '../types';

// The Roadmap section: guided learning paths. Every step deep-links into content that already
// exists (an architecture lens page, a Markdown article, or the Advisor) — the Roadmap curates
// the journey, it never duplicates the content.

interface Props {
  onOpenArch: (dim: DimensionId, optId: string, lens: LensId) => void;
  onOpenArticle: (slug: string) => void;
  onOpenAdvisor: () => void;
}

const cardBase: React.CSSProperties = {
  border: '0.5px solid var(--color-border-tertiary)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--aa-card-pad)',
  background: 'var(--color-background-secondary)',
  textAlign: 'left',
  cursor: 'pointer',
  width: '100%',
};

function stepTitle(step: RoadmapStep, lang: 'en' | 'id'): string {
  if (step.kind === 'advisor') return 'Architecture Advisor';
  if (step.kind === 'article') {
    const doc = contentBySlug(step.slug);
    return doc ? docTitle(doc, lang) : step.slug;
  }
  const entry = DIMENSIONS[step.dim].options.find((o) => o.id === step.optionId);
  return entry ? entry.name : step.optionId;
}

function stepKindLabel(step: RoadmapStep, t: ReturnType<typeof useI18n>['t']): string {
  if (step.kind === 'advisor') return t('learn.road.kindAdvisor');
  if (step.kind === 'article') return t('learn.road.kindArticle');
  return t(`section.${step.lens}`);
}

export default function RoadmapView({ onOpenArch, onOpenArticle, onOpenAdvisor }: Props) {
  const { t, lang } = useI18n();
  const [pathId, setPathId] = useState<string | null>(null);
  const path: LearningPath | undefined = LEARNING_PATHS.find((p) => p.id === pathId);

  const open = (step: RoadmapStep) => {
    if (step.kind === 'advisor') onOpenAdvisor();
    else if (step.kind === 'article') onOpenArticle(step.slug);
    else onOpenArch(step.dim, step.optionId, step.lens);
  };

  if (path) {
    return (
      <div>
        <button type="button" onClick={() => setPathId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', padding: 0 }}>
          {t('learn.road.allPaths')}
        </button>
        <h2 style={{ fontSize: 'var(--aa-fs-2xl)', fontWeight: 600, marginBottom: '6px' }}>{path.title}</h2>
        <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)', maxWidth: '72ch', marginBottom: '12px' }}>{path.description}</p>
        <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '18px', maxWidth: '72ch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-info)', marginBottom: '4px', letterSpacing: '.04em' }}>
            <IconTargetArrow size={14} aria-hidden />
            {t('learn.road.outcome')}
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>{path.outcome}</p>
        </div>
        <ol style={{ display: 'grid', gap: '10px', margin: 0, padding: 0, listStyle: 'none', maxWidth: '72ch' }}>
          {path.steps.map((step, i) => (
            <li key={`${path.id}-${i}`}>
              <button type="button" className="learn-card" style={{ ...cardBase, display: 'flex', gap: '12px', alignItems: 'flex-start' }} onClick={() => open(step)}>
                <span aria-hidden style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-background-info)', color: 'var(--color-text-info)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                  {i + 1}
                </span>
                <span style={{ flexGrow: 1 }}>
                  <span style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, marginBottom: '2px' }}>
                    {stepTitle(step, lang)}
                    <span style={{ fontWeight: 500, fontSize: '10.5px', color: 'var(--color-text-info)', marginLeft: '8px', textTransform: 'uppercase', letterSpacing: '.04em' }}>{stepKindLabel(step, t)}</span>
                  </span>
                  <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{step.note}</span>
                </span>
                <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: '4px' }} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '11px' }}>
      {LEARNING_PATHS.map((p) => (
        <button key={p.id} type="button" className="learn-card" style={cardBase} onClick={() => setPathId(p.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.3 }}>{p.title}</span>
            <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: '3px' }} />
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{p.description}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', color: 'var(--color-text-info)', marginTop: '8px', fontWeight: 500 }}>
            {t(`learn.road.${p.audience}`)} · {p.steps.length} {t('learn.road.stepsWord')}
            <IconArrowRight size={12} aria-hidden />
          </div>
        </button>
      ))}
    </div>
  );
}
