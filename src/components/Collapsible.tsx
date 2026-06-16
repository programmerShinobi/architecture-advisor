import type { ReactNode } from 'react';
import { IconChevronRight } from '@tabler/icons-react';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

// A disclosure dropdown styled by the #f-app details/summary CSS. Used to keep the expert
// "Professional analysis" panels tidy — open one at a time on demand.
export function Collapsible({ title, defaultOpen = false, children }: Props) {
  return (
    <details className="group" open={defaultOpen}>
      <summary>
        <IconChevronRight size={14} className="transition-transform group-open:rotate-90" aria-hidden />
        {title}
      </summary>
      <div style={{ padding: '0 14px 14px' }}>{children}</div>
    </details>
  );
}
