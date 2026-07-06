import { useState } from 'react';
import { IconArrowRight, IconCheck, IconChevronRight, IconRefresh, IconX } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { ACADEMY_QUIZZES, type QuizModule, type QuizRef } from '../config/academyQuizzes';
import type { DimensionId } from '../types';
import type { LensId } from '../config/insightRoadmaps';

// The Academy section: course modules with self-check quizzes, scored entirely client-side.
// A wrong answer is a teaching moment: the explanation plus a "review the topic" deep link into
// the Insights page that covers it.

interface Props {
  onOpenArch: (dim: DimensionId, optId: string, lens: LensId) => void;
  onOpenArticle: (slug: string) => void;
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

export default function AcademyView({ onOpenArch, onOpenArticle }: Props) {
  const { t } = useI18n();
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const mod: QuizModule | undefined = ACADEMY_QUIZZES.find((m) => m.id === moduleId);

  const openModule = (id: string) => {
    setModuleId(id);
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const review = (ref: QuizRef) => {
    if (ref.kind === 'article') onOpenArticle(ref.slug);
    else onOpenArch(ref.dim, ref.optionId, ref.lens);
  };

  if (mod && done) {
    return (
      <div style={{ maxWidth: '72ch' }}>
        <button type="button" onClick={() => setModuleId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', padding: 0 }}>
          {t('learn.ac.allModules')}
        </button>
        <h2 style={{ fontSize: 'var(--aa-fs-2xl)', fontWeight: 600, marginBottom: '10px' }}>{mod.title}</h2>
        <div style={{ background: 'var(--color-background-success)', border: '1px solid var(--color-text-success)', borderRadius: 'var(--border-radius-md)', padding: '14px 16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-success)', letterSpacing: '.04em', marginBottom: '4px' }}>{t('learn.ac.results')}</div>
          <p style={{ fontSize: '15px', fontWeight: 600 }}>
            {score} / {mod.questions.length}
          </p>
        </div>
        <button type="button" className="f-btn" onClick={() => openModule(mod.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <IconRefresh size={14} aria-hidden />
          {t('learn.ac.retry')}
        </button>
      </div>
    );
  }

  if (mod) {
    const q = mod.questions[qIndex];
    const answered = picked !== null;
    const correct = picked === q.answer;
    return (
      <div style={{ maxWidth: '72ch' }}>
        <button type="button" onClick={() => setModuleId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', padding: 0 }}>
          {t('learn.ac.allModules')}
        </button>
        <h2 style={{ fontSize: 'var(--aa-fs-2xl)', fontWeight: 600, marginBottom: '4px' }}>{mod.title}</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '14px' }}>
          {t('learn.ac.question')} {qIndex + 1} / {mod.questions.length}
        </p>
        <p style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5, marginBottom: '12px' }}>{q.q}</p>
        <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
          {q.choices.map((choice, i) => {
            const isAnswer = i === q.answer;
            const isPicked = i === picked;
            const style: React.CSSProperties = { ...cardBase, padding: '10px 13px', fontSize: '13px', lineHeight: 1.5 };
            if (answered && isAnswer) {
              style.borderColor = 'var(--color-text-success)';
              style.background = 'var(--color-background-success)';
            } else if (answered && isPicked && !isAnswer) {
              style.borderColor = 'var(--color-text-cost)';
              style.background = 'var(--color-background-error, var(--color-background-secondary))';
            }
            return (
              <button key={choice} type="button" disabled={answered} onClick={() => { setPicked(i); if (i === q.answer) setScore((s) => s + 1); }} style={style}>
                <span style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  {answered && isAnswer && <IconCheck size={15} aria-hidden style={{ color: 'var(--color-text-success)', flexShrink: 0, marginTop: '2px' }} />}
                  {answered && isPicked && !isAnswer && <IconX size={15} aria-hidden style={{ color: 'var(--color-text-cost)', flexShrink: 0, marginTop: '2px' }} />}
                  <span>{choice}</span>
                </span>
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.04em', marginBottom: '4px', color: correct ? 'var(--color-text-success)' : 'var(--color-text-cost)' }}>
              {correct ? t('learn.ac.correct') : t('learn.ac.incorrect')}
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{q.explain}</p>
            <button type="button" onClick={() => review(q.review)} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {t('learn.ac.review')}
              <IconArrowRight size={13} aria-hidden />
            </button>
          </div>
        )}
        {answered && (
          <button type="button" className="f-btn" onClick={() => { if (qIndex + 1 >= mod.questions.length) setDone(true); else { setQIndex(qIndex + 1); setPicked(null); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {qIndex + 1 >= mod.questions.length ? t('learn.ac.finish') : t('learn.ac.next')}
            <IconArrowRight size={14} aria-hidden />
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '11px' }}>
      {ACADEMY_QUIZZES.map((m) => (
        <button key={m.id} type="button" className="learn-card" style={cardBase} onClick={() => openModule(m.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.3 }}>{m.title}</span>
            <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: '3px' }} />
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{m.description}</div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-info)', marginTop: '8px', fontWeight: 500 }}>
            {m.questions.length} {t('learn.ac.questionsWord')}
          </div>
        </button>
      ))}
    </div>
  );
}
