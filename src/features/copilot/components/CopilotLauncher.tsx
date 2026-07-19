import { IconRoute } from '@tabler/icons-react';
import { useI18n } from '../../../i18n/I18nContext';

// Small launcher for the guided tour — bottom-LEFT (opposite the chat FAB), shown on the Advisor.
interface Props {
  onStart: () => void;
}

export function CopilotLauncher({ onStart }: Readonly<Props>) {
  const { t } = useI18n();
  return (
    <button type="button" className="aa-cop-launch" onClick={onStart} title={t('copilot.startHint')}>
      <IconRoute size={17} aria-hidden />
      {t('copilot.start')}
    </button>
  );
}
