import type { ReactNode } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import type { DictKey } from '../../i18n/dict';

interface Props {
  /** Anchor id (`aa-sec-N`) — the sticky StepTracker scrolls here and spies on it. */
  id: string;
  n: string;
  titleG: DictKey;
  titleE: DictKey;
  children: ReactNode;
}

// One numbered Advisor section as a modern collapsible card (Fase 2d, owner request):
// coin + title + chevron on a native <details> (keyboard/screen-reader friendly), open by
// default so the guided flow still reads top-to-bottom.
export function StepSection({ id, n, titleG, titleE, children }: Readonly<Props>) {
  const { t } = useI18n();
  return (
    <details id={id} className="aa-sec" open>
      <summary className="aa-sec-head">
        <span className="f-num">{n}</span>
        <span className="aa-sec-title">
          <span className="guided-only">{t(titleG)}</span>
          <span className="expert-only">{t(titleE)}</span>
        </span>
        <IconChevronDown size={16} className="aa-sec-chev" aria-hidden />
      </summary>
      <div className="aa-sec-body">{children}</div>
    </details>
  );
}
