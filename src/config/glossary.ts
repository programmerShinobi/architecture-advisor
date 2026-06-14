import type { Bilingual } from '../types';

// Plain-language definitions of the method terms the tool uses. Quality-attribute definitions
// come from config/qualityAttributes.ts; these are the surrounding concepts.

export interface GlossaryTerm {
  term: Bilingual;
  definition: Bilingual;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: { en: 'Quality attribute (QA)', id: 'Atribut kualitas (QA)' },
    definition: {
      en: 'A measurable property an architecture should optimize for (e.g. scalability, security), drawn from ISO/IEC 25010:2023.',
      id: 'Properti terukur yang harus dioptimalkan arsitektur (mis. skalabilitas, keamanan), mengacu ISO/IEC 25010:2023.',
    },
  },
  {
    term: { en: 'Utility tree', id: 'Pohon utilitas' },
    definition: {
      en: 'The set of weighted QA priorities derived from your factors — what the system must optimize for (an ATAM concept).',
      id: 'Kumpulan prioritas QA berbobot yang diturunkan dari faktor Anda — apa yang harus dioptimalkan sistem (konsep ATAM).',
    },
  },
  {
    term: { en: 'Composite score', id: 'Skor komposit' },
    definition: {
      en: 'How well an option fits the prioritized QAs: the weighted sum of its fit values (1–5). Shown 0–100 within a dimension.',
      id: 'Seberapa cocok sebuah opsi dengan QA yang diprioritaskan: jumlah tertimbang nilai kecocokannya (1–5). Ditampilkan 0–100 dalam satu dimensi.',
    },
  },
  {
    term: { en: 'Close call', id: 'Selisih tipis' },
    definition: {
      en: 'When the top two options are within 10% — no clear winner; apply team judgment.',
      id: 'Saat dua opsi teratas berselisih di bawah 10% — tak ada pemenang jelas; gunakan pertimbangan tim.',
    },
  },
  {
    term: { en: 'Sensitivity / robustness', id: 'Sensitivitas / ketangguhan' },
    definition: {
      en: 'Whether a single ±1 factor change would flip the top recommendation. If none does, the result is robust.',
      id: 'Apakah satu perubahan faktor ±1 membalik rekomendasi teratas. Jika tidak ada, hasilnya tangguh.',
    },
  },
  {
    term: { en: 'Anti-pattern', id: 'Anti-pattern' },
    definition: {
      en: 'A known-bad combination of choices (e.g. microservices sharing one database — a distributed monolith).',
      id: 'Kombinasi pilihan yang dikenal buruk (mis. microservices berbagi satu database — distributed monolith).',
    },
  },
  {
    term: { en: 'Fitness function', id: 'Fitness function' },
    definition: {
      en: 'A measurable, automatable check that validates an architectural quality over time (evolutionary architecture).',
      id: 'Pemeriksaan terukur dan dapat diotomasi yang memvalidasi kualitas arsitektur dari waktu ke waktu (evolutionary architecture).',
    },
  },
  {
    term: { en: 'qaFit', id: 'qaFit' },
    definition: {
      en: 'An option’s fit (1 = poor, 5 = excellent) for each quality attribute — the model’s core data.',
      id: 'Kecocokan sebuah opsi (1 = buruk, 5 = sangat baik) untuk tiap atribut kualitas — data inti model.',
    },
  },
];
