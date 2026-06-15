import { useRef } from 'react';
import {
  IconCircleCheck,
  IconCode,
  IconFileSpreadsheet,
  IconFileText,
  IconHistory,
  IconReportAnalytics,
  IconShare2,
  IconUpload,
} from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { parseScenario, type ScenarioState } from '../lib/scenarioIO';
import type { ExportStatus } from '../hooks/useExportActions';

interface Props {
  run: {
    adr: () => void;
    report: () => void;
    csv: () => void;
    json: () => void;
    share: () => void | Promise<void>;
  };
  status: ExportStatus | null;
  setStatus: (s: ExportStatus | null) => void;
  mode: 'guided' | 'expert';
  onImport: (state: ScenarioState) => void;
}

const secondary: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '12px',
  color: 'var(--color-text-secondary)',
  border: '0.5px solid var(--color-border-secondary)',
  borderRadius: 'var(--border-radius-md)',
  padding: '10px 15px',
  cursor: 'pointer',
  background: 'transparent',
};

export function Toolbar({ run, status, setStatus, mode, onImport }: Props) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const st = parseScenario(await file.text());
    if (st) {
      onImport(st);
      setStatus({ ok: true, msg: t('status.json') });
    } else setStatus({ ok: false, msg: t('action.importError') });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '11px' }}>
        <span className="f-num">4</span>
        <span style={{ fontSize: '15px', fontWeight: 500 }}>
          <span className="guided-only">{t('export.title.g')}</span>
          <span className="expert-only">{t('step4.e')}</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
        <button
          type="button"
          onClick={run.adr}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--color-background-primary)', background: 'var(--color-text-info)', borderRadius: 'var(--border-radius-md)', padding: '10px 16px', cursor: 'pointer', fontWeight: 500, border: 'none' }}
        >
          <IconFileText size={16} aria-hidden />
          <span className="guided-only">{t('action.saveDoc.g')}</span>
          <span className="expert-only">{t('action.saveDoc.e')}</span>
          <span className="kbd" style={{ marginLeft: '2px' }}>⌘S</span>
        </button>

        <button type="button" style={secondary} onClick={run.report}>
          <IconReportAnalytics size={16} aria-hidden />
          {t('action.fullReport')}
        </button>

        {mode === 'expert' && (
          <>
            <button type="button" style={secondary} onClick={run.csv}>
              <IconFileSpreadsheet size={16} aria-hidden />
              {t('action.csv')}
            </button>
            <button type="button" style={secondary} onClick={run.json}>
              <IconCode size={16} aria-hidden />
              {t('action.json')}
            </button>
          </>
        )}

        <button type="button" style={secondary} onClick={() => void run.share()}>
          <IconShare2 size={16} aria-hidden />
          <span className="guided-only">{t('action.share.g')}</span>
          <span className="expert-only">{t('action.share.e')}</span>
        </button>

        {mode === 'expert' && (
          <button type="button" style={secondary} onClick={() => fileRef.current?.click()}>
            <IconUpload size={16} aria-hidden />
            {t('action.importSetup')}
          </button>
        )}
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      {status && (
        <div style={{ marginTop: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: status.ok ? 'var(--color-background-secondary)' : 'var(--color-background-danger)', borderRadius: 'var(--border-radius-md)', padding: '9px 12px' }}>
            <IconCircleCheck size={15} style={{ color: status.ok ? 'var(--color-text-success)' : 'var(--color-text-danger)' }} aria-hidden />
            <span style={{ fontSize: '12px', color: status.ok ? 'var(--color-text-secondary)' : 'var(--color-text-danger)' }}>{status.msg}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '12px', fontSize: '11px', color: 'var(--color-text-tertiary)', flexWrap: 'wrap' }}>
        <IconHistory size={13} aria-hidden />
        <span className="guided-only">{t('audit.g')}</span>
        <span className="expert-only">{t('audit.e')}</span>
      </div>
    </div>
  );
}
