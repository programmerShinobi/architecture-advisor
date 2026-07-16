import { useState } from 'react';
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
  IconShoppingCart,
  IconTool,
  type Icon,
} from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { PRESETS } from '../../config/presets';
import type { Levels } from '../../types';

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

// Scenario presets + reset (with confirm + undo) — matches the prototype's Step-1 header block.
export function PresetBar({ activeId, onApply, onReset, onUndo }: Props) {
  const { t, tr } = useI18n();
  const [reset, setReset] = useState<ResetState>('idle');

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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {PRESETS.map((p) => {
          const Ic = ICONS[p.id] ?? IconTool;
          return (
            <button
              key={p.id}
              type="button"
              className={'f-chip' + (activeId === p.id ? ' on' : '')}
              title={tr(p.description)}
              onClick={() => {
                onApply(p.levels);
                setReset('idle');
              }}
            >
              <Ic size={14} aria-hidden />
              {tr(p.label)}
            </button>
          );
        })}
      </div>

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
