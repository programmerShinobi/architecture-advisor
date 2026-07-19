import { IconCheck, IconX } from '@tabler/icons-react';

// Structured, semantic Dos/Don'ts (Copilot Phase 2.2). WCAG: each list is a labelled group with an
// icon that is decorative (aria-hidden) — the label carries the meaning for screen readers, so a
// reader announces e.g. "Do, list, 2 items: …" rather than an ambiguous checkmark.
interface Props {
  kind: 'do' | 'dont';
  label: string;
  items: string[];
}

export function DosDontsCard({ kind, label, items }: Readonly<Props>) {
  if (items.length === 0) return null;
  const Icon = kind === 'do' ? IconCheck : IconX;
  return (
    <section className={`aa-cop-rules ${kind}`} aria-label={label}>
      <h4 className="aa-cop-rules-h">
        <Icon size={13} aria-hidden />
        {label}
      </h4>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </section>
  );
}
