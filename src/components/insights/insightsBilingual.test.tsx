import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithI18n } from '../../test/render';
import LabView from './LabView';
import RoadmapView from './RoadmapView';
import AcademyView from './AcademyView';
import LearnView from './LearnView';

// Runtime proof that the EN/ID toggle reaches the DEEPEST Insights sub-levels — not just the type
// system. Each lens is rendered in Indonesian; we assert Indonesian dataset copy appears in the list
// view AND after drilling into a detail view (steps/watch/takeaway/choices). Guards the exact defect
// the user reported ("Insights doesn't go deep with Indonesian at the deepest sub-levels").

beforeEach(() => localStorage.clear());

describe('Insights renders Indonesian at the deepest sub-level (lang=id)', () => {
  it('Lab: list + experiment detail are in Indonesian', () => {
    renderWithI18n(<LabView onRun={vi.fn()} onOpenArch={vi.fn()} />, 'id');
    // List view shows each experiment's (translated) hypothesis.
    expect(screen.getByText(/lebih ditentukan oleh faktor tim\/organisasi/i)).toBeTruthy();
    // Drill into the first experiment → detail view.
    fireEvent.click(screen.getByText(/Kapan ukuran tim membalik D1\?/i));
    expect(screen.getByText(/Produk yang sudah terbukti dan sedang tumbuh/i)).toBeTruthy(); // brief
    expect(screen.getByText(/Peringkat D1 dan jarak antara modular monolith/i)).toBeTruthy(); // watch step
    expect(screen.getByText(/Bobot kemudahan rilis dan pemeliharaan mengikuti/i)).toBeTruthy(); // takeaway
  });

  it('Roadmap: list + path detail are in Indonesian', () => {
    renderWithI18n(<RoadmapView onOpenArch={vi.fn()} onOpenArticle={vi.fn()} onOpenAdvisor={vi.fn()} />, 'id');
    expect(screen.getByText(/Mulai dari nol: apa itu keputusan arsitektur/i)).toBeTruthy(); // description
    fireEvent.click(screen.getByText(/Dasar-dasar arsitektur/i));
    expect(screen.getByText(/Kamu bisa menjelaskan gaya deployment dasar/i)).toBeTruthy(); // outcome
    expect(screen.getByText(/Kenali titik awal klasik — lapisan/i)).toBeTruthy(); // step note (deepest)
  });

  it('Academy: list + question/choices/explanation are in Indonesian', () => {
    renderWithI18n(<AcademyView onOpenArch={vi.fn()} onOpenArticle={vi.fn()} />, 'id');
    expect(screen.getByText(/kapan masing-masing sepadan dengan biayanya/i)).toBeTruthy(); // module description
    fireEvent.click(screen.getByText(/Deployment & komposisi/i));
    // Question + choices are translated.
    expect(screen.getByText(/default yang didukung bukti adalah/i)).toBeTruthy(); // q
    const correct = screen.getByText(/Monolith \(atau modular monolith\)/i); // choice
    expect(correct).toBeTruthy();
    // Answering reveals the (translated) explanation — the deepest sub-level.
    fireEvent.click(correct);
    expect(screen.getByText(/menyarankan membuktikan produk dan batasnya/i)).toBeTruthy(); // explain
  });

  it('English still renders when lang=en (no accidental ID leak in the default)', () => {
    const { container } = renderWithI18n(<LabView onRun={vi.fn()} onOpenArch={vi.fn()} />, 'en');
    expect(within(container).getByText(/Deployment style \(D1\) is driven more by team/i)).toBeTruthy();
    expect(within(container).queryByText(/lebih ditentukan oleh faktor tim\/organisasi/i)).toBeNull();
  });
});

describe('LearnView lenses + article bodies render Indonesian (lang=id)', () => {
  const renderLearn = () => renderWithI18n(<LearnView onOpenAdvisor={vi.fn()} onLoadLab={vi.fn()} />, 'id');

  it('Playbook lens (insightPlaybooks) shows Indonesian goal + steps', () => {
    renderLearn();
    fireEvent.click(screen.getByRole('button', { name: /Playbook/ }));
    fireEvent.click(screen.getByRole('button', { name: /Serverless/ })); // English proper noun (model)
    expect(screen.getByText(/Fungsi yang dipicu event pada infrastruktur terkelola/i)).toBeTruthy(); // goal
    expect(screen.getByText(/Beban kerja yang berumur pendek, stateless/i)).toBeTruthy(); // prerequisite
  });

  it('Review lens (insightReviews) shows Indonesian verdict', () => {
    renderLearn();
    fireEvent.click(screen.getByRole('button', { name: /Review/ }));
    fireEvent.click(screen.getByRole('button', { name: /Event Sourcing/ }));
    expect(screen.getByText(/Alat andalan spesialis: transformatif di mana audit/i)).toBeTruthy(); // verdict
  });

  it('Library lens (insightLibrary) shows Indonesian definition + concepts', () => {
    renderLearn();
    fireEvent.click(screen.getByRole('button', { name: /Pustaka/ })); // "Library" section tab in ID
    fireEvent.click(screen.getByRole('button', { name: /Modular Monolith/ }));
    expect(screen.getByText(/Monolith yang kode internalnya dibagi menjadi modul/i)).toBeTruthy(); // definition
    expect(screen.getByText(/Batas logis \(modul\) dipisahkan dari batas fisik/i)).toBeTruthy(); // concept
  });

  it('Markdown article body renders the Indonesian side of the `<!-- lang:id -->` split', () => {
    renderLearn();
    fireEvent.click(screen.getByRole('button', { name: /Peta Belajar/ })); // "Roadmap" section tab in ID
    fireEvent.click(screen.getByRole('button', { name: /monolith ke microservices/i }));
    fireEvent.click(screen.getByRole('button', { name: /Strangler Fig/ }));
    // The Indonesian body (below the delimiter), NOT the English one.
    expect(screen.getByText(/Menulis ulang sistem besar sekaligus/i)).toBeTruthy();
    expect(screen.queryByText(/Rewriting a large system in one go/i)).toBeNull();
  });
});
