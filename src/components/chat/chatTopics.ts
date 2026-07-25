import {
  IconTargetArrow,
  IconBuildingArch,
  IconAlertTriangle,
  IconMathFunction,
  IconDeviceLaptop,
  type Icon,
} from '@tabler/icons-react';
import type { Bilingual } from '../../types';

/**
 * The Chat Advisor's browsable capability catalogue.
 *
 * WHY THIS EXISTS. The adapter routes ~27 intent families, but the panel used to advertise six flat
 * chips and one vague sentence, and the full `capabilities()` listing was reachable only by already
 * knowing to type "help" — the one thing a confused newcomer cannot know. Novices ran out of chips,
 * typed something unroutable, got a fallback, and concluded the thing was stupid; experts never
 * found sensitivity, migration paths, factor lookups or the quality-attribute glossary at all.
 *
 * The fix is progressive disclosure, not more coverage: five plain-language topics, each opening a
 * short list of REAL questions that can be sent with one tap. Novices browse and never have to
 * invent phrasing; experts see the depth immediately.
 *
 * THE HARD RULE FOR THIS FILE. Every `asks` entry must be a question the adapter genuinely answers.
 * A promise here that lands on the fallback is worse than no promise at all — it is the exact
 * "confidently wrong" failure the whole product exists to argue against. `chatTopics.test.ts` sends
 * every entry through `answerText` in BOTH languages and fails if any is unroutable, so this rule is
 * machine-enforced rather than left to good intentions.
 */
export interface ChatTopic {
  id: string;
  icon: Icon;
  label: Bilingual;
  hint: Bilingual;
  asks: Bilingual[];
}

export const CHAT_TOPICS: readonly ChatTopic[] = [
  {
    id: 'yours',
    icon: IconTargetArrow,
    label: { en: 'Your recommendation', id: 'Rekomendasi Anda' },
    hint: { en: 'What the engine picked for your scenario, and how firm it is', id: 'Yang dipilih mesin untuk skenario Anda, dan seberapa kokoh' },
    asks: [
      { en: 'What do you recommend?', id: 'Apa rekomendasinya?' },
      { en: 'Why this recommendation?', id: 'Kenapa rekomendasi ini?' },
      { en: 'How close is this call?', id: 'Seberapa tipis selisihnya?' },
      { en: 'What are my current answers?', id: 'Apa saja jawaban saya sekarang?' },
    ],
  },
  {
    id: 'architectures',
    icon: IconBuildingArch,
    label: { en: 'Understand an architecture', id: 'Pahami sebuah arsitektur' },
    hint: { en: 'Plain explanations, head-to-head comparisons, and who each one suits', id: 'Penjelasan sederhana, perbandingan langsung, dan cocok untuk siapa' },
    asks: [
      { en: 'What is microservices?', id: 'Apa itu microservices?' },
      { en: 'Monolith vs microservices', id: 'Monolith vs microservices' },
      { en: 'When does serverless fit?', id: 'Kapan serverless cocok?' },
      { en: 'Why not serverless?', id: 'Kenapa bukan serverless?' },
    ],
  },
  {
    id: 'risk',
    icon: IconAlertTriangle,
    label: { en: 'Risks, cost & migration', id: 'Risiko, biaya & migrasi' },
    hint: { en: 'What could bite you, what it costs to run, and how to move later', id: 'Apa yang bisa menggigit, biaya menjalankannya, dan cara pindah nanti' },
    asks: [
      { en: 'Any risks with this combination?', id: 'Ada risiko pada kombinasi ini?' },
      { en: "What's the operational cost?", id: 'Berapa biaya operasionalnya?' },
      { en: 'List all anti-patterns', id: 'Daftar semua anti-pattern' },
      { en: 'How do I migrate to microservices?', id: 'Bagaimana migrasi ke microservices?' },
    ],
  },
  {
    id: 'model',
    icon: IconMathFunction,
    label: { en: 'The model behind it', id: 'Model di baliknya' },
    hint: { en: 'The 5 dimensions, the 14 questions, the 12 quality attributes, the maths', id: '5 dimensi, 14 pertanyaan, 12 atribut mutu, perhitungannya' },
    asks: [
      { en: 'What is Deployment Granularity?', id: 'Apa itu Deployment Granularity?' },
      { en: 'What is scalability?', id: 'Apa itu skalabilitas?' },
      { en: 'How does the scoring work?', id: 'Bagaimana cara kerja skoringnya?' },
    ],
  },
  {
    id: 'app',
    icon: IconDeviceLaptop,
    label: { en: 'Using this app', id: 'Memakai aplikasi ini' },
    hint: { en: 'Privacy, export, shortcuts, install, themes and accessibility', id: 'Privasi, ekspor, pintasan, pemasangan, tema dan aksesibilitas' },
    asks: [
      { en: 'Is my data private?', id: 'Apakah data saya privat?' },
      { en: 'How do I export or share?', id: 'Bagaimana cara ekspor atau berbagi?' },
      { en: 'What are the keyboard shortcuts?', id: 'Apa saja pintasan keyboard?' },
      { en: 'Can I install this app?', id: 'Bisakah aplikasi ini dipasang?' },
    ],
  },
] as const;
