import { useState } from 'react';
import { IconArrowRight, IconChevronRight, IconEye, IconFlask, IconBulb } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { LAB_EXPERIMENTS, type LabExperiment } from '../../config/labExperiments';
import { FACTORS } from '../../config/factors';
import { DIMENSIONS } from '../../config/dimensions';
import type { DimensionId, FactorId, Levels } from '../../types';

// The Lab section: interactive sandboxes on the real engine. Each experiment prepares a scenario
// (factor levels for the frozen model) and loads it into the Advisor, so the reader tests the
// hypothesis against the live calculation — no canned answers, no second engine. The experiment's
// `focus` chips deep-link to the architectures in play (holistic parity: all 21 across the Lab).

interface Props {
  onRun: (levels: Levels) => void;
  onOpenArch: (dim: DimensionId, optId: string) => void;
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

export default function LabView({ onRun, onOpenArch }: Props) {
  const { t, tr } = useI18n();
  const [expId, setExpId] = useState<string | null>(null);
  const exp: LabExperiment | undefined = LAB_EXPERIMENTS.find((e) => e.id === expId);

  if (exp) {
    return (
      <div style={{ maxWidth: '72ch' }}>
        <button type="button" onClick={() => setExpId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-info)', cursor: 'pointer', fontSize: '13px', marginBottom: '14px', padding: 0 }}>
          {t('learn.lab.allExperiments')}
        </button>
        <h2 style={{ fontSize: 'var(--aa-fs-2xl)', fontWeight: 600, marginBottom: '10px' }}>{tr(exp.title)}</h2>
        <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--color-text-secondary)', marginBottom: '14px' }}>{tr(exp.brief)}</p>
        <div style={{ background: 'var(--color-background-info)', border: '1px solid var(--color-border-info)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-info)', marginBottom: '4px', letterSpacing: '.04em' }}>
            <IconFlask size={14} aria-hidden />
            {t('learn.lab.hypothesis')}
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{tr(exp.hypothesis)}</p>
        </div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-text-info)', margin: '0 0 8px' }}>
          <IconEye size={15} aria-hidden />
          {t('learn.lab.watch')}
        </h3>
        <ol style={{ display: 'grid', gap: '6px', margin: '0 0 16px', paddingLeft: '22px', fontSize: '13px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
          {exp.watch.map((w) => (
            <li key={w.en}>{tr(w)}</li>
          ))}
        </ol>
        <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-text-tertiary)', margin: '0 0 8px' }}>{t('learn.lab.focus')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {exp.focus.map((key) => {
            const [dim, optId] = key.split(':') as [DimensionId, string];
            const opt = DIMENSIONS[dim]?.options.find((o) => o.id === optId);
            if (!opt) return null;
            return (
              <button key={key} type="button" className="f-chip" onClick={() => onOpenArch(dim, optId)} style={{ color: 'var(--color-text-info)' }}>
                {opt.name}
              </button>
            );
          })}
        </div>
        <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-text-tertiary)', margin: '0 0 8px' }}>{t('learn.lab.scenario')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(Object.entries(exp.levels) as [FactorId, number][]).map(([fid, lvl]) => {
            const f = FACTORS[fid];
            if (!f || f.levels[lvl] === undefined) return null;
            return (
              <span key={fid} className="f-chip" style={{ cursor: 'default', fontSize: '11px' }}>
                {tr(f.label)}: {tr(f.levels[lvl])}
              </span>
            );
          })}
        </div>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '12px 14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-success)', marginBottom: '4px', letterSpacing: '.04em' }}>
            <IconBulb size={14} aria-hidden />
            {t('learn.lab.takeaway')}
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{tr(exp.takeaway)}</p>
        </div>
        <button type="button" className="f-btn" onClick={() => onRun(exp.levels)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {t('learn.lab.run')}
          <IconArrowRight size={14} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '11px' }}>
      {LAB_EXPERIMENTS.map((e) => (
        <button key={e.id} type="button" className="learn-card" style={cardBase} onClick={() => setExpId(e.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 600, lineHeight: 1.3 }}>{tr(e.title)}</span>
            <IconChevronRight size={15} aria-hidden style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: '3px' }} />
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{tr(e.hypothesis)}</div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-info)', marginTop: '8px', fontWeight: 500 }}>{t('learn.lab.runShort')}</div>
        </button>
      ))}
    </div>
  );
}
