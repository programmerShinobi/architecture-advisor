import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { CommandPalette, type Command } from './CommandPalette';
import { renderWithI18n } from '../test/render';

// L2 — the ⌘K command palette overlay: closed renders nothing; open lists commands, filters by
// query, and runs (then closes) on click or Enter.
describe('CommandPalette overlay', () => {
  beforeEach(() => localStorage.clear());
  const make = (): Command[] => [
    { label: 'Export ADR', run: vi.fn() },
    { label: 'Switch to Expert mode', run: vi.fn() },
    { label: 'Share link', run: vi.fn() },
  ];

  it('renders nothing when closed', () => {
    const { container } = renderWithI18n(<CommandPalette open={false} commands={make()} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('filters by query and runs the clicked command, then closes', () => {
    const cmds = make();
    const onClose = vi.fn();
    renderWithI18n(<CommandPalette open commands={cmds} onClose={onClose} />);

    expect(screen.getByRole('button', { name: 'Export ADR' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'expert' } });
    expect(screen.queryByRole('button', { name: 'Export ADR' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Switch to Expert mode' }));
    expect(cmds[1].run).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Enter runs the first matching command', () => {
    const cmds = make();
    renderWithI18n(<CommandPalette open commands={cmds} onClose={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(cmds[0].run).toHaveBeenCalledTimes(1);
  });
});
