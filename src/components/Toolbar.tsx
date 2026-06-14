import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { generateAdr } from '../lib/adr';
import { generateReport } from '../lib/report';
import { buildShareUrl } from '../lib/urlState';
import { serializeScenario, parseScenario, type ScenarioState } from '../lib/scenarioIO';
import { copyToClipboard, downloadText } from '../lib/download';
import type { ExportInput } from '../lib/snapshot';

interface Props {
  exportInput: ExportInput;
  scenario: ScenarioState;
  onImport: (state: ScenarioState) => void;
}

const btn =
  'rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface-2';

// Outputs & sharing: ADR + report export, shareable link, and setup JSON import/export.
export function Toolbar({ exportInput, scenario, onImport }: Props) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [shared, setShared] = useState(false);
  const [importError, setImportError] = useState(false);

  const onShare = async () => {
    const ok = await copyToClipboard(buildShareUrl(scenario));
    if (ok) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const onFile = async (file: File | undefined) => {
    setImportError(false);
    if (!file) return;
    const state = parseScenario(await file.text());
    if (state) onImport(state);
    else setImportError(true);
  };

  return (
    <section aria-labelledby="outputs-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="outputs-heading" className="text-base font-semibold">
        {t('outputs.heading')}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t('outputs.intro')}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => downloadText('architecture-adr.md', generateAdr(exportInput))}
        >
          {t('action.exportAdr')}
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => downloadText('architecture-report.md', generateReport(exportInput))}
        >
          {t('action.exportReport')}
        </button>
        <button type="button" className={btn} onClick={onShare}>
          {shared ? t('action.shared') : t('action.share')}
        </button>
        <button
          type="button"
          className={btn}
          onClick={() =>
            downloadText('architecture-setup.json', serializeScenario(scenario), 'application/json')
          }
        >
          {t('action.exportSetup')}
        </button>
        <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
          {t('action.importSetup')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      {importError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{t('action.importError')}</p>}
    </section>
  );
}
