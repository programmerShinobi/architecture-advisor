import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { QaOverridePanel } from './QaOverridePanel';
import { effectiveWeights } from '../lib/scoring';
import { DEFAULT_LEVELS } from '../config/defaults';
import { renderWithI18n } from '../test/render';

// L2 — the expert weight-override panel: editing a QA locks it; unlocking / clearing removes it.
// (The proportional redistribution of the remainder is the engine's job, unit-tested in
// scoring.test; here we test the panel's wiring, and App.test covers the end-to-end redistribution.)
describe('QaOverridePanel — expert weight override + lock', () => {
  beforeEach(() => localStorage.clear());
  const weights = effectiveWeights(DEFAULT_LEVELS);

  it('editing a QA input locks that QA via onChange', () => {
    const onChange = vi.fn();
    renderWithI18n(<QaOverridePanel weights={weights} overrides={{}} onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Scalability' }), { target: { value: '40' } });
    expect(onChange).toHaveBeenCalledWith({ scalability: 40 });
  });

  it('clamps an over-range entry to 0–100', () => {
    const onChange = vi.fn();
    renderWithI18n(<QaOverridePanel weights={weights} overrides={{}} onChange={onChange} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Security' }), { target: { value: '250' } });
    expect(onChange).toHaveBeenCalledWith({ security: 100 });
  });

  it('a locked QA shows Unlock; clicking it removes the lock', () => {
    const onChange = vi.fn();
    renderWithI18n(<QaOverridePanel weights={weights} overrides={{ scalability: 40 }} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Unlock' }));
    expect(onChange).toHaveBeenCalledWith({});
  });

  it('Clear-all clears every override (and is absent when there are none)', () => {
    const onChange = vi.fn();
    const { unmount } = renderWithI18n(<QaOverridePanel weights={weights} overrides={{}} onChange={onChange} />);
    expect(screen.queryByRole('button', { name: 'Clear all overrides' })).not.toBeInTheDocument();
    unmount();

    renderWithI18n(<QaOverridePanel weights={weights} overrides={{ scalability: 40, security: 20 }} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear all overrides' }));
    expect(onChange).toHaveBeenCalledWith({});
  });
});
