import type { Bilingual } from '../types';

// The methods this tool operationalizes, with public sources (Build Spec Section 16 /
// charter Section 13). Surfaced in the "How it works" methodology panel for credibility.

export interface MethodReference {
  label: string;
  note: Bilingual;
  url: string;
}

export const METHOD_REFERENCES: MethodReference[] = [
  {
    label: 'ISO/IEC 25010:2023',
    note: {
      en: 'The product-quality model — the 12-quality-attribute spine.',
      id: 'Model kualitas produk — tulang punggung 12 atribut kualitas.',
    },
    url: 'https://www.iso.org/standard/78176.html',
  },
  {
    label: 'ATAM (SEI)',
    note: {
      en: 'Architecture Tradeoff Analysis Method — the utility tree and stakeholder prioritization.',
      id: 'Architecture Tradeoff Analysis Method — pohon utilitas dan prioritisasi pemangku kepentingan.',
    },
    url: 'https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/',
  },
  {
    label: 'Attribute-Driven Design (SEI)',
    note: {
      en: 'Quality-attribute-driven selection of architecture options.',
      id: 'Pemilihan opsi arsitektur yang digerakkan atribut kualitas.',
    },
    url: 'https://insights.sei.cmu.edu/library/attribute-driven-design-add-version-20/',
  },
  {
    label: 'Building Evolutionary Architectures',
    note: {
      en: 'Ford, Parsons & Kua — fitness functions to validate architecture over time.',
      id: 'Ford, Parsons & Kua — fitness function untuk memvalidasi arsitektur dari waktu ke waktu.',
    },
    url: 'https://evolutionaryarchitecture.com/',
  },
  {
    label: 'Multi-Attribute Value Theory',
    note: {
      en: 'Keeney & Raiffa — the additive weighted-value model behind the scoring.',
      id: 'Keeney & Raiffa — model nilai-tertimbang aditif di balik penilaian.',
    },
    url: 'https://doi.org/10.1017/CBO9781139174084',
  },
  {
    label: 'MADR',
    note: {
      en: 'Markdown Architectural Decision Records — the ADR export format.',
      id: 'Markdown Architectural Decision Records — format ekspor ADR.',
    },
    url: 'https://adr.github.io/madr/',
  },
];
