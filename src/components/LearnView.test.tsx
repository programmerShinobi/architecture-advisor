import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import LearnView from './LearnView';
import { renderWithI18n } from '../test/render';
import { AVAILABLE_SECTIONS } from '../config/sections';
import { READER_SECTIONS } from '../config/readerContent';
import { INSIGHT_PLAYBOOKS } from '../config/insightPlaybooks';
import { INSIGHT_REVIEWS } from '../config/insightReviews';
import { INSIGHT_LIBRARY } from '../config/insightLibrary';
import { DIMENSIONS, DIMENSION_ORDER } from '../config/dimensions';

// Insights covers EVERY architecture the Advisor evaluates across ALL FOUR sections (Catalog,
// Playbook, Review, Library), data-driven from the frozen model — holistic coverage by design.
describe('LearnView', () => {
  const render = () => {
    const onOpenAdvisor = vi.fn();
    renderWithI18n(<LearnView onOpenAdvisor={onOpenAdvisor} />, 'en');
    return { onOpenAdvisor };
  };

  it('every architecture has a Catalog, Playbook, Review, and Library entry (parity with the model)', () => {
    for (const dim of DIMENSION_ORDER) {
      for (const opt of DIMENSIONS[dim].options) {
        const key = `${dim}:${opt.id}`;
        const entry = READER_SECTIONS.find((s) => s.dim === dim)?.entries.find((e) => e.optionId === opt.id);
        expect(entry, `catalog ${key}`).toBeDefined();
        expect(INSIGHT_PLAYBOOKS[key], `playbook ${key}`).toBeDefined();
        expect(INSIGHT_REVIEWS[key], `review ${key}`).toBeDefined();
        expect(INSIGHT_LIBRARY[key], `library ${key}`).toBeDefined();
      }
    }
  });

  it('the Playbook section opens an architecture as a step-by-step implementation guide', () => {
    render();
    expect(AVAILABLE_SECTIONS.map((s) => s.id)).toEqual(['catalog', 'playbook', 'review', 'library']);
    fireEvent.click(screen.getByRole('button', { name: /Playbook/ }));
    // Data-driven "by architecture" grid — a representative option (name doesn't collide with guides).
    fireEvent.click(screen.getByRole('button', { name: /Serverless/ }));
    expect(screen.getByRole('heading', { name: 'Prerequisites' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Steps' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Best practices' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pitfalls to avoid' })).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0); // trusted cited sources
  });

  it('the Review section opens an architecture as a structured evaluation with a verdict', () => {
    const { onOpenAdvisor } = render();
    fireEvent.click(screen.getByRole('button', { name: /Review/ }));
    fireEvent.click(screen.getByRole('button', { name: /Event Sourcing/ }));
    expect(screen.getByRole('heading', { name: 'Pros' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cons' })).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Scalability')).toBeInTheDocument();
    expect(screen.getByText('Final verdict')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Try this in the Advisor/ }));
    expect(onOpenAdvisor).toHaveBeenCalledTimes(1);
  });

  it('the Library section covers every architecture as reference AND lists evergreen articles', () => {
    render();
    fireEvent.click(screen.getByRole('button', { name: /Library/ }));
    // Wave B evergreen articles are listed as further reading…
    expect(screen.getByRole('button', { name: /GenAI/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Conway/ })).toBeInTheDocument();
    // …and the 21-architecture reference grid is here too (holistic coverage).
    fireEvent.click(screen.getByRole('button', { name: /Modular Monolith/ }));
    expect(screen.getByRole('heading', { name: 'Key concepts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Terminology' })).toBeInTheDocument();
  });

  it('the lens nav walks one architecture through the whole knowledge journey', () => {
    render();
    fireEvent.click(screen.getByRole('button', { name: /Catalog/ }));
    fireEvent.click(screen.getByRole('button', { name: /Hexagonal/ }));
    const lensNav = () => within(screen.getByRole('navigation', { name: /Explore this architecture/ }));
    // Catalog lens → discover.
    expect(screen.getByText('When it fits')).toBeInTheDocument();
    // Switch to the Playbook lens on the same page → implement.
    fireEvent.click(lensNav().getByRole('button', { name: 'Playbook' }));
    expect(screen.getByRole('heading', { name: 'Steps' })).toBeInTheDocument();
    // Switch to the Review lens → evaluate.
    fireEvent.click(lensNav().getByRole('button', { name: 'Review' }));
    expect(screen.getByText('Final verdict')).toBeInTheDocument();
    // Switch to the Library lens → reference.
    fireEvent.click(lensNav().getByRole('button', { name: 'Library' }));
    expect(screen.getByRole('heading', { name: 'Terminology' })).toBeInTheDocument();
  });
});
