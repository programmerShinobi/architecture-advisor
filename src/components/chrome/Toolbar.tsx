import { useRef } from 'react';
import {
  IconCircleCheck,
  IconCode,
  IconFileSpreadsheet,
  IconFileText,
  IconHistory,
  IconPrinter,
  IconReportAnalytics,
  IconShare2,
  IconUpload,
} from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { parseScenario, type ScenarioState } from '../../lib/scenarioIO';
import type { ExportStatus } from '../../hooks/useExportActions';

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

export function Toolbar({ run, status, setStatus, mode, onImport }: Readonly<Props>) {
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
      {/* No internal heading — the StepSection card already shows "4 · Save & share".
          Fase 2g: professional uniform buttons; becomes a clean full-width list when wrapped. */}
      <div className="aa-export">
        <button type="button" className="aa-export-btn primary" onClick={run.adr}>
          <IconFileText size={16} aria-hidden />
          <span className="guided-only">{t('action.saveDoc.g')}</span>
          <span className="expert-only">{t('action.saveDoc.e')}</span>
          <span className="aa-kbd" style={{ marginLeft: 'auto' }}>⌘S</span>
        </button>

        <button type="button" className="aa-export-btn" onClick={run.report}>
          <IconReportAnalytics size={16} aria-hidden />
          {t('action.fullReport')}
        </button>

        <button type="button" className="aa-export-btn" onClick={() => window.print()}>
          <IconPrinter size={16} aria-hidden />
          {t('action.print')}
        </button>

        {mode === 'expert' && (
          <>
            <button type="button" className="aa-export-btn" onClick={run.csv}>
              <IconFileSpreadsheet size={16} aria-hidden />
              {t('action.csv')}
            </button>
            <button type="button" className="aa-export-btn" onClick={run.json}>
              <IconCode size={16} aria-hidden />
              {t('action.json')}
            </button>
          </>
        )}

        <button type="button" className="aa-export-btn" onClick={() => void run.share()}>
          <IconShare2 size={16} aria-hidden />
          <span className="guided-only">{t('action.share.g')}</span>
          <span className="expert-only">{t('action.share.e')}</span>
        </button>

        {mode === 'expert' && (
          <button type="button" className="aa-export-btn" onClick={() => fileRef.current?.click()}>
            <IconUpload size={16} aria-hidden />
            {t('action.importSetup')}
          </button>
        )}
        <input ref={fileRef} type="file" accept="application/json,.json" aria-label={t('action.importSetup')} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
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
