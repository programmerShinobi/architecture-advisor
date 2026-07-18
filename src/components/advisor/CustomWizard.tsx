import { useState } from 'react';
import {
  IconTarget,
  IconBuilding,
  IconCoin,
  IconUsers,
  IconClock,
  IconAdjustments,
  IconTerminal2,
  IconX,
  IconArrowRight,
  type Icon,
} from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { WIZARD_QUESTIONS, type WizardGroup, type WizardQuestion } from '../../config/customWizard';
import { wizardToLevels, wizardHasSignal, type WizardSelections } from '../../lib/customWizard';
import type { DictKey } from '../../i18n/dict';
import type { Levels } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Applies the derived factor levels to the frozen engine (identical to applying a preset). */
  onApply: (levels: Levels) => void;
}

const ICONS: Record<string, Icon> = {
  target: IconTarget,
  building: IconBuilding,
  coin: IconCoin,
  users: IconUsers,
  clock: IconClock,
  adjustments: IconAdjustments,
};

const GROUP_ORDER: WizardGroup[] = ['goal', 'domain', 'constraints', 'nfr'];
const GROUP_LABEL: Record<WizardGroup, DictKey> = {
  goal: 'wizard.g.goal',
  domain: 'wizard.g.domain',
  constraints: 'wizard.g.constraints',
  nfr: 'wizard.g.nfr',
};

// The Custom Architecture Wizard (Master Blueprint Phase 1.2 + 1.3): a foolproof, terminal-styled
// guided builder. It captures the four universal variables and maps them onto the SAME frozen
// engine (via wizardToLevels) — one scoring model, no parallel logic. It can never produce an
// invalid scenario: unanswered questions fall back to a moderate baseline (Phase 3.2).
export function CustomWizard({ open, onClose, onApply }: Readonly<Props>) {
  const { t, tr } = useI18n();
  const [sel, setSel] = useState<WizardSelections>({});
  if (!open) return null;

  const pick = (q: WizardQuestion, optId: string) => {
    setSel((prev) => {
      if (q.multi) {
        const cur = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
        const next = cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId];
        return { ...prev, [q.id]: next };
      }
      return { ...prev, [q.id]: prev[q.id] === optId ? undefined : optId };
    });
  };
  const isOn = (q: WizardQuestion, optId: string) =>
    q.multi ? Array.isArray(sel[q.id]) && (sel[q.id] as string[]).includes(optId) : sel[q.id] === optId;

  const submit = () => {
    onApply(wizardToLevels(sel));
    onClose();
  };

  return (
    <div className="f-ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label={t('wizard.title')} className="aa-wizard">
        <div className="aa-wizard-head">
          <span className="aa-wizard-title">
            <IconTerminal2 size={17} aria-hidden style={{ color: 'var(--color-text-info)' }} />
            {t('wizard.title')}
          </span>
          <button type="button" className="aa-ctl-icon" onClick={onClose} aria-label={t('wizard.close')}>
            <IconX size={16} aria-hidden />
          </button>
        </div>
        <p className="aa-wizard-intro">{t('wizard.intro')}</p>

        <div className="aa-wizard-body">
          {GROUP_ORDER.map((group) => {
            const questions = WIZARD_QUESTIONS.filter((q) => q.group === group);
            return (
              <section key={group} className="aa-wizard-group">
                <h3 className="aa-wizard-group-title">
                  {t(GROUP_LABEL[group])}
                  {group === 'nfr' && <span className="aa-wizard-optional"> · {t('wizard.optional')}</span>}
                </h3>
                {questions.map((q) => {
                  const Ic = ICONS[q.icon] ?? IconTarget;
                  return (
                    <div key={q.id} className="aa-wizard-q">
                      <div className="aa-wizard-q-title">
                        <Ic size={14} aria-hidden style={{ color: 'var(--color-text-tertiary)' }} />
                        {tr(q.title)}
                      </div>
                      <div className="aa-wizard-opts">
                        {q.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            aria-pressed={isOn(q, o.id)}
                            className={'aa-wizard-opt' + (isOn(q, o.id) ? ' on' : '')}
                            onClick={() => pick(q, o.id)}
                            title={o.hint ? tr(o.hint) : undefined}
                          >
                            {tr(o.label)}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        <div className="aa-wizard-foot">
          {!wizardHasSignal(sel) && <span className="aa-wizard-hint">{t('wizard.baselineHint')}</span>}
          <div className="aa-wizard-actions">
            <button type="button" className="f-btn" onClick={() => setSel({})}>
              {t('wizard.clear')}
            </button>
            <button type="button" className="aa-export-btn primary" onClick={submit}>
              {t('wizard.submit')}
              <IconArrowRight size={15} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
