import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import LearnView from './LearnView';
import { renderWithI18n } from '../test/render';
import { AVAILABLE_SECTIONS } from '../config/sections';
import { READER_SECTIONS } from '../config/readerContent';
import { PLAYBOOK_ANGLE, REVIEW_ANGLE } from '../config/readerAngles';
import { DIMENSIONS, DIMENSION_ORDER } from '../config/dimensions';

// Learn covers EVERY architecture the Advisor evaluates across all three sections (Catalog,
// Playbook, Review), data-driven from the frozen model.
describe('LearnView', () => {
  const render = () => {
    const onOpenAdvisor = vi.fn();
    renderWithI18n(<LearnView onOpenAdvisor={onOpenAdvisor} />, 'en');
    return { onOpenAdvisor };
  };

  it('every architecture has a Catalog, Playbook, and Review angle (parity with the model)', () => {
    for (const dim of DIMENSION_ORDER) {
      for (const opt of DIMENSIONS[dim].options) {
        const key = `${dim}:${opt.id}`;
        const entry = READER_SECTIONS.find((s) => s.dim === dim)?.entries.find((e) => e.optionId === opt.id);
        expect(entry, `catalog ${key}`).toBeDefined();
        expect(PLAYBOOK_ANGLE[key], `playbook ${key}`).toBeDefined();
        expect(REVIEW_ANGLE[key], `review ${key}`).toBeDefined();
      }
    }
  });

  it('the Playbook section lists every architecture and opens one with cited sources', () => {
    render();
    expect(AVAILABLE_SECTIONS.map((s) => s.id)).toContain('playbook');
    fireEvent.click(screen.getByRole('button', { name: /Playbook/ }));
    // Data-driven "by architecture" grid — a representative option (name doesn't collide with guides).
    fireEvent.click(screen.getByRole('button', { name: /Serverless/ }));
    expect(screen.getByText('How to adopt it')).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0); // trusted cited sources
  });

  it('the Library section lists its articles WITHOUT repeating the architecture grid', () => {
    render();
    fireEvent.click(screen.getByRole('button', { name: /Library/ }));
    // Wave B articles are listed…
    expect(screen.getByRole('button', { name: /GenAI/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Conway/ })).toBeInTheDocument();
    // …and the 21-architecture grid is NOT duplicated here (no redundancy).
    expect(screen.queryByRole('button', { name: 'Modular Monolith' })).not.toBeInTheDocument();
  });

  it('the Review section shows every architecture through a review lens', () => {
    const { onOpenAdvisor } = render();
    fireEvent.click(screen.getByRole('button', { name: /Review/ }));
    fireEvent.click(screen.getByRole('button', { name: /Event Sourcing/ }));
    expect(screen.getByText('What to check when reviewing')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Try this in the Advisor/ }));
    expect(onOpenAdvisor).toHaveBeenCalledTimes(1);
  });
});
