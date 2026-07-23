import { FEATURES } from '../../config/features';
import type { CopilotStep, CopilotTour } from './types';

// The guided tutorial, as DATA (Copilot Phase 1.1 — pluggable). Adding/curating steps is a config
// edit; the engine + overlay never change. Each step targets a whitelisted `data-tour-id` and
// declares the view it lives on, so the copilot navigates there (or skips silently if unmounted).

const STEPS: CopilotStep[] = [
    {
      id: 'gallery',
      view: 'advisor',
      target: 'scenario-gallery',
      placement: 'bottom',
      title: { en: '1 · Pick a starting scenario', id: '1 · Pilih skenario awal' },
      body: {
        en: 'Start from a preset card, or build your own with the dashed “Custom system” card. Either way it fills the 14 project factors — the same frozen engine scores it.',
        id: 'Mulai dari kartu preset, atau bangun sendiri lewat kartu “Sistem kustom” bergaris putus. Keduanya mengisi 14 faktor proyek — dinilai oleh mesin beku yang sama.',
      },
      dos: [
        { en: 'Search or filter by tag to find a close match', id: 'Cari atau filter berdasarkan tag untuk yang mirip' },
        { en: 'Use the Custom Wizard when nothing fits', id: 'Gunakan Wizard Kustom bila tak ada yang cocok' },
      ],
      donts: [{ en: 'Don’t hunt for a “perfect” preset — you’ll tune the factors next', id: 'Jangan cari preset “sempurna” — faktornya akan Anda setel berikutnya' }],
    },
    {
      id: 'factors',
      view: 'advisor',
      target: 'project-factors',
      placement: 'right',
      title: { en: '1 · Tune the project factors', id: '1 · Setel faktor proyek' },
      body: {
        en: 'These 14 drivers describe your project. Every edit recomputes the recommendation instantly — there’s no wrong answer, only your context.',
        id: '14 pendorong ini menggambarkan proyek Anda. Tiap perubahan menghitung ulang rekomendasi secara langsung — tak ada jawaban salah, hanya konteks Anda.',
      },
      dos: [{ en: 'Answer honestly — the model reflects your real constraints', id: 'Jawab jujur — model mencerminkan batasan nyata Anda' }],
      donts: [{ en: 'Don’t optimize answers to force a favorite architecture', id: 'Jangan mengarang jawaban demi arsitektur favorit' }],
    },
    {
      id: 'priorities',
      view: 'advisor',
      target: 'quality-priorities',
      placement: 'left',
      title: { en: '2 · See what matters most', id: '2 · Lihat yang paling penting' },
      body: {
        en: 'Your factors derive weighted ISO/IEC 25010 quality priorities. In Expert mode you can pin any weight and the rest re-balance around it.',
        id: 'Faktor Anda menurunkan prioritas kualitas ISO/IEC 25010 berbobot. Di mode Ahli Anda bisa mengunci bobot mana pun, sisanya menyeimbang di sekitarnya.',
      },
      dos: [{ en: 'Pin a weight only when you truly know the priority', id: 'Kunci bobot hanya bila Anda benar-benar tahu prioritasnya' }],
      donts: [{ en: 'Don’t force weights to 100% — you lose the trade-off view', id: 'Jangan paksa bobot ke 100% — Anda kehilangan gambaran trade-off' }],
    },
    {
      id: 'recommendation',
      view: 'advisor',
      target: 'recommendation',
      placement: 'top',
      title: { en: '3 · The recommendation (the engine)', id: '3 · Rekomendasi (mesinnya)' },
      body: {
        en: 'The frozen engine scores all 21 architectures across five dimensions and explains the trade-offs, sensitivity, and anti-patterns — with the full, auditable calculation.',
        id: 'Mesin beku menilai 21 arsitektur di lima dimensi dan menjelaskan trade-off, sensitivitas, dan anti-pattern — dengan perhitungan lengkap yang dapat diaudit.',
      },
      dos: [{ en: 'Read “why not the runner-up” to understand close calls', id: 'Baca “kenapa bukan peringkat-2” untuk memahami selisih tipis' }],
      donts: [{ en: 'Don’t treat scores as facts — they’re tunable heuristics', id: 'Jangan anggap skor sebagai fakta — itu heuristik yang bisa disetel' }],
    },
    {
      id: 'output',
      view: 'advisor',
      target: 'strategic-output',
      placement: 'top',
      title: { en: '4 · Save & share', id: '4 · Simpan & bagikan' },
      body: {
        en: 'Export an ADR (MADR), a full report, CSV/JSON, or a share link that reproduces your exact scenario on any device.',
        id: 'Ekspor ADR (MADR), laporan lengkap, CSV/JSON, atau tautan berbagi yang mereproduksi skenario Anda persis di perangkat mana pun.',
      },
      dos: [{ en: 'Export an ADR to record the decision + its reasoning', id: 'Ekspor ADR untuk mencatat keputusan + alasannya' }],
    },
    {
      id: 'chat',
      view: 'advisor',
      target: 'chat-advisor',
      placement: 'left',
      title: { en: 'Ask the Chat Advisor', id: 'Tanya Chat Advisor' },
      body: {
        en: 'Any time, ask the Chat Advisor about your recommendation, an architecture, or a trade-off — grounded in your scenario, computed from the model.',
        id: 'Kapan saja, tanya Chat Advisor soal rekomendasi Anda, sebuah arsitektur, atau trade-off — berdasar skenario Anda, dihitung dari model.',
      },
    },
];

// Drop the chat step when the Chat Advisor is gated off, so the tour never points at a control
// that isn't on screen. Flip FEATURES.chat back on and the step (and its target) return untouched.
export const MAIN_TOUR: CopilotTour = {
  id: 'advisor-walkthrough',
  steps: STEPS.filter((s) => FEATURES.chat || s.target !== 'chat-advisor'),
};
