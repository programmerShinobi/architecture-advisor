import type { Bilingual, Lang } from '../types';

// Section headings and fixed phrases for the Markdown exports (ADR + report), in both languages.
const LABELS = {
  adrTitle: { en: 'Architecture Decision Record', id: 'Catatan Keputusan Arsitektur' },
  status: { en: 'Status', id: 'Status' },
  proposed: { en: 'Proposed', id: 'Diusulkan' },
  date: { en: 'Date', id: 'Tanggal' },
  context: { en: 'Context and Problem Statement', id: 'Konteks dan Pernyataan Masalah' },
  contextBody: {
    en: 'Given the project factors below, the tool derived weighted quality-attribute priorities and scored each architecture option against them.',
    id: 'Berdasarkan faktor proyek di bawah, alat menurunkan prioritas atribut kualitas berbobot dan menilai tiap opsi arsitektur terhadapnya.',
  },
  drivers: { en: 'Decision Drivers (top quality attributes)', id: 'Pendorong Keputusan (atribut kualitas teratas)' },
  consideredOptions: { en: 'Considered Options', id: 'Opsi yang Dipertimbangkan' },
  decisionOutcome: { en: 'Decision Outcome', id: 'Hasil Keputusan' },
  chosen: { en: 'Chosen combination', id: 'Kombinasi terpilih' },
  rationale: {
    en: 'Each option is the highest-scoring for the prioritized quality attributes; selections you changed manually are kept.',
    id: 'Tiap opsi adalah yang berskor tertinggi untuk atribut kualitas yang diprioritaskan; pilihan yang Anda ubah manual dipertahankan.',
  },
  consequences: { en: 'Consequences', id: 'Konsekuensi' },
  good: { en: 'Good', id: 'Positif' },
  goodBody: {
    en: 'The recommendation is aligned with the prioritized quality attributes and is reproducible from the factors.',
    id: 'Rekomendasi selaras dengan atribut kualitas yang diprioritaskan dan dapat direproduksi dari faktor.',
  },
  badRisks: { en: 'Bad / risks', id: 'Negatif / risiko' },
  noWarnings: { en: 'No anti-patterns detected in this combination.', id: 'Tidak ada anti-pattern terdeteksi pada kombinasi ini.' },
  links: { en: 'Links', id: 'Tautan' },

  reportTitle: { en: 'Architecture Recommendation Report', id: 'Laporan Rekomendasi Arsitektur' },
  execSummary: { en: 'Executive summary', id: 'Ringkasan eksekutif' },
  inPlainTerms: { en: 'In plain terms', id: 'Dalam bahasa sederhana' },
  factorInputs: { en: 'Project factors', id: 'Faktor proyek' },
  qaPriorities: { en: 'Quality-attribute priorities', id: 'Prioritas atribut kualitas' },
  recommendations: { en: 'Per-dimension recommendations', id: 'Rekomendasi per dimensi' },
  contribution: { en: 'QA contribution — top deployment option', id: 'Kontribusi QA — opsi deployment teratas' },
  risks: { en: 'Risk register', id: 'Daftar risiko' },
  antiPatterns: { en: 'Anti-pattern checks', id: 'Pemeriksaan anti-pattern' },
  fitness: { en: 'Suggested fitness functions', id: 'Saran fitness function' },
  references: { en: 'References (methods)', id: 'Referensi (metode)' },
  disclaimer: {
    en: 'Decision support, not an oracle. The encoded weights are defensible expert defaults, not validated facts. Apply team judgment.',
    id: 'Alat bantu keputusan, bukan ramalan. Bobot yang tertanam adalah default ahli yang dapat dipertanggungjawabkan, bukan fakta tervalidasi. Gunakan pertimbangan tim.',
  },

  weight: { en: 'Weight', id: 'Bobot' },
  fit: { en: 'Fit', id: 'Kecocokan' },
  points: { en: 'Points', id: 'Poin' },
  score: { en: 'Score', id: 'Skor' },
  option: { en: 'Option', id: 'Opsi' },
  level: { en: 'Level', id: 'Level' },
  likelihood: { en: 'Likelihood', id: 'Kemungkinan' },
  impact: { en: 'Impact', id: 'Dampak' },
  mitigation: { en: 'Mitigation', id: 'Mitigasi' },
  recommended: { en: 'recommended', id: 'rekomendasi' },
} satisfies Record<string, Bilingual>;

export type LabelKey = keyof typeof LABELS;
export const label = (lang: Lang, key: LabelKey): string => LABELS[key][lang];
