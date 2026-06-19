import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { SensitivityCard } from './SensitivityCard';
import type { Flip } from '../lib/scoring';
import { DEFAULT_LEVELS } from '../config/defaults';
import { renderWithI18n } from '../test/render';

// AC-11 — the sensitivity card names a flipping factor OR correctly says "robust".
describe('SensitivityCard (AC-11)', () => {
  beforeEach(() => localStorage.clear());

  it('shows only the robust line when nothing would flip the pick', () => {
    renderWithI18n(<SensitivityCard flips={[]} levels={DEFAULT_LEVELS} />);
    expect(screen.getByText('Otherwise the pick is robust.')).toBeInTheDocument();
    expect(screen.queryByText(/would win/)).not.toBeInTheDocument();
  });

  it('names the flipping factor, its target level, and the new winner', () => {
    const flips: Flip[] = [{ factor: 'team', to: 2, newWinner: 'Microservices' }];
    renderWithI18n(<SensitivityCard flips={flips} levels={DEFAULT_LEVELS} />);
    // sens.flip = "If {factor} were {level} → {winner} would win."
    expect(
      screen.getByText('If Team size were Large / multiple teams → Microservices would win.'),
    ).toBeInTheDocument();
    // the robust fallback line is always present too
    expect(screen.getByText('Otherwise the pick is robust.')).toBeInTheDocument();
  });

  it('shows at most the first three flips', () => {
    const flips: Flip[] = [
      { factor: 'team', to: 2, newWinner: 'A' },
      { factor: 'scale', to: 2, newWinner: 'B' },
      { factor: 'devops', to: 2, newWinner: 'C' },
      { factor: 'budget', to: 0, newWinner: 'D' },
    ];
    renderWithI18n(<SensitivityCard flips={flips} levels={DEFAULT_LEVELS} />);
    expect(screen.getAllByText(/would win\.$/)).toHaveLength(3);
  });
});
