import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { RadarPanel } from './RadarPanel';
import { effectiveWeights } from '../lib/scoring';
import { DEFAULT_LEVELS } from '../config/defaults';
import { renderWithI18n } from '../test/render';

// AC-12 — the radar overlays options across the 12 QAs and supports toggling / comparing options
// and switching the dimension under comparison.
describe('RadarPanel (AC-12)', () => {
  beforeEach(() => localStorage.clear());
  const weights = effectiveWeights(DEFAULT_LEVELS);

  it('lists the five D1 options and marks exactly one top pick', () => {
    renderWithI18n(<RadarPanel weights={weights} mode="expert" />);
    for (const name of ['Layered / N-Tier', 'Monolith', 'Modular Monolith', 'Microservices', 'Serverless (FaaS)']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
    expect(screen.getAllByText('Top pick')).toHaveLength(1);
  });

  it('toggling an option chip flips its pressed (shown/hidden) state', () => {
    renderWithI18n(<RadarPanel weights={weights} mode="expert" />);
    const chip = screen.getByRole('button', { name: 'Microservices' });
    const before = chip.getAttribute('aria-pressed');
    fireEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).not.toBe(before);
  });

  it('switching the dimension shows that dimension’s options', () => {
    renderWithI18n(<RadarPanel weights={weights} mode="expert" />);
    expect(screen.queryByRole('button', { name: 'Streaming' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Communication Style/ }));
    expect(screen.getByRole('button', { name: 'Streaming' })).toBeInTheDocument();
    // the D1 options are gone once D2 is selected
    expect(screen.queryByRole('button', { name: 'Monolith' })).not.toBeInTheDocument();
  });
});
