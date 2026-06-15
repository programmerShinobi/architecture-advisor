import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { generateAdr } from '../lib/adr';
import { generateReport } from '../lib/report';
import { generateScoresCsv, generateAssessmentJson } from '../lib/exportData';
import { buildShareUrl } from '../lib/urlState';
import { copyToClipboard, downloadText } from '../lib/download';
import type { ExportInput } from '../lib/snapshot';
import type { ScenarioState } from '../lib/scenarioIO';
import type { Weights } from '../types';

export interface ExportStatus {
  ok: boolean;
  msg: string;
}

// Centralizes the export/share actions + status so the Toolbar and the command palette share them.
export function useExportActions(exportInput: ExportInput, scenario: ScenarioState, weights: Weights) {
  const { t } = useI18n();
  const [status, setStatus] = useState<ExportStatus | null>(null);

  const run = {
    adr: () => {
      downloadText('architecture-adr.md', generateAdr(exportInput));
      setStatus({ ok: true, msg: t('status.adr') });
    },
    report: () => {
      downloadText('architecture-report.md', generateReport(exportInput));
      setStatus({ ok: true, msg: t('status.report') });
    },
    csv: () => {
      downloadText('scores.csv', generateScoresCsv(weights), 'text/csv');
      setStatus({ ok: true, msg: t('status.csv') });
    },
    json: () => {
      downloadText('assessment.json', generateAssessmentJson(exportInput), 'application/json');
      setStatus({ ok: true, msg: t('status.json') });
    },
    share: async () => {
      const done = await copyToClipboard(buildShareUrl(scenario));
      setStatus({ ok: done, msg: done ? t('status.shared') : t('status.shareErr') });
    },
  };

  return { status, setStatus, run };
}
