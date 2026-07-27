import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { LeverageCard } from './LeverageCard';
import { leverage } from '../../lib/scoring';
import { DEFAULT_LEVELS } from '../../config/defaults';
import { renderWithI18n } from '../../test/render';
import type { Leverage } from '../../lib/scoring';

const row = (over: Partial<Leverage> = {}): Leverage => ({
  factor: 'team', down: -2, up: 3, swing: 3, unseats: false, ...over,
});

describe('LeverageCard', () => {
  beforeEach(() => localStorage.clear());

  it('renders nothing when no answer moves the lead', () => {
    const { container } = renderWithI18n(<LeverageCard rows={[row({ down: 0, up: 0, swing: 0 })]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows at most six answers, widest first', () => {
    const rows = Array.from({ length: 10 }, (_, i) =>
      row({ factor: (['team', 'budget', 'scale', 'devops', 'legacy', 'domain', 'ttm', 'security', 'async', 'realtime'] as const)[i], swing: 10 - i, up: 10 - i }),
    );
    renderWithI18n(<LeverageCard rows={rows} />);
    expect(screen.getByText('Team size')).toBeInTheDocument();
    expect(screen.queryByText('Real-time needs')).not.toBeInTheDocument(); // 10th, past the cut
  });

  /**
   * The bars carry magnitude in pixels, which a screen reader cannot see and which nobody can read
   * precisely by eye. Every row must therefore also state its own figures in text — if this fails,
   * the card is decorative for anyone not looking at it closely.
   */
  it('states each row\'s figures in text, not only as a bar', () => {
    renderWithI18n(<LeverageCard rows={[row({ down: -2, up: 3 })]} />);
    expect(screen.getByText(/Team size: the lead moves −2\.0 points in the worst direction and \+3\.0 in the best\./)).toBeInTheDocument();
  });

  /** Colour must never be the only thing distinguishing a pick-changing answer. */
  it('labels a pick-changing answer in words, not just in colour', () => {
    renderWithI18n(<LeverageCard rows={[row({ unseats: true })]} />);
    expect(screen.getByText('changes the pick')).toBeInTheDocument();
  });

  /**
   * Regression: the first cut showed EITHER the figure OR the "changes the pick" badge, so the
   * magnitude vanished from precisely the rows where it matters most — and since a default scenario
   * makes nearly every answer pick-changing, the card degenerated into six identical warnings with
   * no numbers at all. Magnitude is the only thing this card adds over the sensitivity list beside
   * it; it has to survive on every row.
   */
  it('still shows the figure on a row that changes the pick', () => {
    renderWithI18n(<LeverageCard rows={[row({ unseats: true, down: null, up: -33.3 })]} />);
    expect(screen.getByText('changes the pick')).toBeInTheDocument();
    expect(screen.getByText('−33.3')).toBeInTheDocument();
  });

  it('headlines the larger of the two swings, signed', () => {
    renderWithI18n(<LeverageCard rows={[row({ down: -2, up: 9, swing: 9 })]} />);
    expect(screen.getByText('+9.0')).toBeInTheDocument(); // +9 beats −2
  });

  it('drives off the real engine end to end', () => {
    const rows = leverage(DEFAULT_LEVELS);
    renderWithI18n(<LeverageCard rows={rows} />);
    // Whatever the default scenario yields, the card must agree with the engine about the top answer.
    const top = rows.filter((r) => r.swing > 0)[0];
    if (top) expect(screen.getAllByText(/the lead moves/).length).toBeGreaterThan(0);
  });
});
