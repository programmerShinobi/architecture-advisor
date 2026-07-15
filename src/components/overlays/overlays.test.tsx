import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { ManualBook } from './ManualBook';
import { ScenarioCompare } from '../advisor/ScenarioCompare';
import { effectiveWeights } from '../../lib/scoring';
import { DEFAULT_LEVELS } from '../../config/defaults';
import { READER_SECTIONS, READER_CITATIONS } from '../../config/readerContent';
import { DIMENSIONS } from '../../config/dimensions';
import type { ScenarioState } from '../../lib/scenarioIO';
import type { Levels } from '../../types';
import { renderWithI18n } from '../../test/render';

// L2 — the modal overlays (manual book, A/B scenario compare): hidden when closed, a labelled
// dialog when open, and the close control fires onClose.
const weights = effectiveWeights(DEFAULT_LEVELS);
const scen = (levels: Levels): ScenarioState => ({ v: 1, mode: 'guided', lang: 'en', levels, selections: {}, overrides: {} });

describe('ManualBook overlay', () => {
  beforeEach(() => localStorage.clear());

  it('renders nothing when closed', () => {
    const { container } = renderWithI18n(<ManualBook open={false} onClose={vi.fn()} levels={DEFAULT_LEVELS} weights={weights} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens as a labelled dialog and closes', () => {
    const onClose = vi.fn();
    renderWithI18n(<ManualBook open onClose={onClose} levels={DEFAULT_LEVELS} weights={weights} />);
    expect(screen.getByRole('dialog', { name: /Manual/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('details every architecture option (parity with the model) with a cited bibliography', () => {
    renderWithI18n(<ManualBook open onClose={vi.fn()} levels={DEFAULT_LEVELS} weights={weights} />);
    // Every dimension option the Advisor scores has a Reader entry explained in the Manual.
    for (const section of READER_SECTIONS) {
      expect(section.entries.length).toBe(DIMENSIONS[section.dim].options.length);
      for (const option of DIMENSIONS[section.dim].options) {
        expect(section.entries.some((e) => e.optionId === option.id), `${section.dim}:${option.id}`).toBe(true);
      }
    }
    // A representative option and a real cited source are rendered.
    expect(screen.getAllByText('Microservices').length).toBeGreaterThan(0);
    const hrefs = new Set(screen.getAllByRole('link').map((a) => a.getAttribute('href')));
    for (const c of Object.values(READER_CITATIONS)) {
      if (c.url) expect(hrefs.has(c.url), `no link for ${c.key}`).toBe(true);
    }
  });
});

describe('ScenarioCompare (A/B) overlay', () => {
  beforeEach(() => localStorage.clear());

  it('renders nothing when closed', () => {
    const { container } = renderWithI18n(
      <ScenarioCompare open={false} onClose={vi.fn()} snapA={null} snapB={null} onPinA={vi.fn()} onPinB={vi.fn()} onClear={vi.fn()} onSwap={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the two pinned scenarios and a factor diff, and closes', () => {
    const onClose = vi.fn();
    const A = scen(DEFAULT_LEVELS);
    const B = scen({ ...DEFAULT_LEVELS, scale: 2, team: 2 });
    renderWithI18n(
      <ScenarioCompare open onClose={onClose} snapA={A} snapB={B} onPinA={vi.fn()} onPinB={vi.fn()} onClear={vi.fn()} onSwap={vi.fn()} />,
    );
    expect(screen.getByRole('dialog', { name: 'Compare scenarios' })).toBeInTheDocument();
    // the comparison body rendered for the two pinned scenarios (the diff legend is shown)
    expect(screen.getByText(/Highlighted rows/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
