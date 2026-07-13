import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { LandingView } from './LandingView';
import { renderWithI18n } from '../test/render';

// The Home landing (Aurora Slate) — mirrors prototype-v2/preview-modern.html, but its CTAs drive the
// real app and its pattern cards deep-link into the Insights Catalog by the frozen model's ids.
describe('LandingView', () => {
  const render = () => {
    const onStart = vi.fn();
    const onOpenInsights = vi.fn();
    const onOpenArch = vi.fn();
    renderWithI18n(<LandingView onStart={onStart} onOpenInsights={onOpenInsights} onOpenArch={onOpenArch} />, 'en');
    return { onStart, onOpenInsights, onOpenArch };
  };

  it('renders the hero, the pattern bento, and the how-it-works steps', () => {
    render();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Choose your architecture/i);
    // Featured architectures come from the model (real names).
    expect(screen.getByText('Modular Monolith')).toBeInTheDocument();
    expect(screen.getByText('CQRS')).toBeInTheDocument();
    // How-it-works steps.
    expect(screen.getByText('Tell us about your project')).toBeInTheDocument();
    expect(screen.getByText('Get the recommendation + why')).toBeInTheDocument();
  });

  it('the primary CTA starts the Advisor', () => {
    const { onStart } = render();
    fireEvent.click(screen.getByRole('button', { name: /Start free analysis/ }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('“All architectures” opens Insights; a pattern card deep-links to its architecture', () => {
    const { onOpenInsights, onOpenArch } = render();
    fireEvent.click(screen.getByRole('button', { name: /All architectures/ }));
    expect(onOpenInsights).toHaveBeenCalledTimes(1);

    // The "Serverless" card deep-links to D1:serverless (the frozen-model id).
    fireEvent.click(screen.getByRole('button', { name: /Serverless/ }));
    expect(onOpenArch).toHaveBeenCalledWith('D1', 'serverless');
  });
});
