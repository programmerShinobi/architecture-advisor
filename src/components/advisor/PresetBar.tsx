import { lazy, Suspense, useMemo, useState } from 'react';
import {
  IconBuildingBank,
  IconChartDots,
  IconCircleCheck,
  IconCloudComputing,
  IconCpu,
  IconDeviceMobile,
  IconMessages,
  IconRefreshAlert,
  IconRocket,
  IconRotate,
  IconSearch,
  IconShoppingCart,
  IconTerminal2,
  IconTool,
  type Icon,
} from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { PRESETS } from '../../config/presets';
import { PRESET_TAGS, PRESET_FILTERS } from '../../config/presetTags';
import type { Levels } from '../../types';

// The wizard (modal, its config + mapping) loads only when the user opens it — keeps it out of the
// initial Advisor bundle (Blueprint Phase 3: future-proof, lean first load).
const CustomWizard = lazy(() => import('./CustomWizard').then((m) => ({ default: m.CustomWizard })));

const ICONS: Record<string, Icon> = {
  'startup-mvp': IconRocket,
  regulated: IconBuildingBank,
  'high-traffic-ecommerce': IconShoppingCart,
  'iot-streaming': IconCpu,
  'internal-tool': IconTool,
  'saas-b2b': IconCloudComputing,
  'mobile-consumer': IconDeviceMobile,
  'data-platform': IconChartDots,
  'legacy-modernization': IconRefreshAlert,
  'realtime-collab': IconMessages,
};

interface Props {
  activeId: string | null;
  onApply: (levels: Levels) => void;
  onReset: () => void;
  onUndo: () => void;
}

type ResetState = 'idle' | 'confirming' | 'done';

// Scenario Card Gallery + reset + Custom Architecture Wizard (Master Blueprint Phase 1.2/1.3).
// Presets are searchable/filterable cards; the dominant dashed "Build custom system" card opens
// the guided builder, which maps its four variables onto the SAME frozen engine (one model).
export function PresetBar({ activeId, onApply, onReset, onUndo }: Readonly<Props>) {
  const { t, tr } = useI18n();
  const [reset, setReset] = useState<ResetState>('idle');
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      PRESETS.filter((p) => {
        const tagOk = !tag || (PRESET_TAGS[p.id] ?? []).includes(tag);
        const textOk = !q || `${tr(p.label)} ${tr(p.description)}`.toLowerCase().includes(q);
        return tagOk && textOk;
      }),
    [q, tag, tr],
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 500 }}>{t('presets.start')}</span>
        <button type="button" className="f-btn" onClick={() => setReset('confirming')}>
          <IconRotate size={13} aria-hidden />
          {t('action.resetAnswers')}
        </button>
      </div>
      <div className="f-gloss" style={{ marginBottom: '11px' }}>
        {t('presets.fill')}
      </div>

      {/* Search + tag filters. */}
      <div className="aa-gallery-tools">
        <label className="aa-gallery-search">
          <IconSearch size={14} aria-hidden style={{ color: 'var(--color-text-tertiary)', flex: 'none' }} />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('gallery.search')} aria-label={t('gallery.search')} />
        </label>
        <div className="aa-gallery-tags">
          {PRESET_FILTERS.map((f) => (
            <button key={f.id} type="button" className={'f-chip' + (tag === f.id ? ' on' : '')} aria-pressed={tag === f.id} onClick={() => setTag(tag === f.id ? null : f.id)}>
              {tr(f.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Card gallery — dominant custom card first, then matching presets */}
      <div className="aa-gallery-grid">
        {/* Dominant "start here" card — also the compact Copilot anchor for the "pick a scenario"
            step (a tight target that fits the spotlight band on small screens). */}
        <button type="button" className="aa-scard aa-scard-custom" data-tour-id="scenario-gallery" onClick={() => setWizardOpen(true)}>
          <span className="aa-scard-head">
            <IconTerminal2 size={16} aria-hidden />
            {t('wizard.open')}
          </span>
          <span className="aa-scard-desc">{t('wizard.openHint')}</span>
          <span className="aa-scard-tags">
            <span className="aa-scard-tag">$ custom</span>
          </span>
        </button>

        {shown.map((p) => {
          const Ic = ICONS[p.id] ?? IconTool;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={activeId === p.id}
              className={'aa-scard' + (activeId === p.id ? ' on' : '')}
              onClick={() => {
                onApply(p.levels);
                setReset('idle');
              }}
            >
              <span className="aa-scard-head">
                <Ic size={16} aria-hidden />
                {tr(p.label)}
              </span>
              <span className="aa-scard-desc">{tr(p.description)}</span>
              <span className="aa-scard-tags">
                {(PRESET_TAGS[p.id] ?? []).map((tg) => (
                  <span key={tg} className="aa-scard-tag">
                    {tg}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
        {shown.length === 0 && (
          <div className="f-gloss" style={{ gridColumn: '1 / -1', padding: '10px 2px' }}>
            {t('gallery.empty')}
          </div>
        )}
      </div>

      {wizardOpen && (
        <Suspense fallback={null}>
          <CustomWizard
            open
            onClose={() => setWizardOpen(false)}
            onApply={(levels) => {
              onApply(levels);
              setReset('idle');
            }}
          />
        </Suspense>
      )}

      {reset === 'confirming' && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'var(--color-background-warning)', borderRadius: 'var(--border-radius-md)', padding: '9px 12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-warning)' }}>{t('reset.confirm')}</span>
            <button
              type="button"
              onClick={() => {
                onReset();
                setReset('done');
              }}
              style={{ fontSize: '11px', fontWeight: 500, background: 'var(--color-text-warning)', color: 'var(--color-background-primary)', borderRadius: '99px', padding: '4px 12px', cursor: 'pointer', border: 'none' }}
            >
              {t('reset.yes')}
            </button>
            <button type="button" onClick={() => setReset('idle')} style={{ fontSize: '11px', color: 'var(--color-text-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}>
              {t('reset.cancel')}
            </button>
          </div>
        </div>
      )}
      {reset === 'done' && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '9px 12px' }}>
            <IconCircleCheck size={15} style={{ color: 'var(--color-text-success)' }} aria-hidden />
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t('reset.done')}</span>
            <button
              type="button"
              onClick={() => {
                onUndo();
                setReset('idle');
              }}
              style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-info)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {t('reset.undo')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
