import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import App from './App';
import { renderWithI18n } from './test/render';

// The radar verdict ("X leads at N%…" / "Close call: … are within N points") is the single
// element that names the top option and its score, so its text changing proves the whole
// pipeline (factors → weights → rankings → analysis) recomputed.
const VERDICT = /leads at \d+%|within \d+ points/;

describe('App integration', () => {
  beforeEach(() => localStorage.clear());

  it('AC-2: applying a preset instantly recomputes the recommendation', () => {
    renderWithI18n(<App />, 'en');
    const before = screen.getByText(VERDICT).textContent;
    fireEvent.click(screen.getByRole('button', { name: 'Busy online shop' }));
    expect(screen.getByText(VERDICT).textContent).not.toBe(before);
  });

  it('AC-2: changing a single factor instantly recomputes the recommendation', () => {
    renderWithI18n(<App />, 'en');
    const before = screen.getByText(VERDICT).textContent;
    fireEvent.click(screen.getByRole('radio', { name: 'High / extreme spikes' }));
    expect(screen.getByText(VERDICT).textContent).not.toBe(before);
  });

  it('AC-13: the language toggle switches the UI strings', () => {
    renderWithI18n(<App />, 'id');
    expect(screen.getByText('Rekomendasi di 5 dimensi')).toBeInTheDocument();
    expect(screen.queryByText('Recommendation across 5 dimensions')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    expect(screen.getByText('Recommendation across 5 dimensions')).toBeInTheDocument();
    expect(screen.queryByText('Rekomendasi di 5 dimensi')).not.toBeInTheDocument();
  });
});
