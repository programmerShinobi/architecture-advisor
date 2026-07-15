import type { Bilingual, DimensionId } from '../types';

// The "Roadmap" Insights section: guided learning paths (bilingual EN/ID, rendered via tr()).
// Every step points at something that already exists — an architecture page (dim + optionId + lens),
// a Markdown article (slug), or the Advisor itself — so the Roadmap can never drift from the model
// or the content index (a unit test resolves every target).

const b = (en: string, id: string): Bilingual => ({ en, id });

export type LensId = 'catalog' | 'playbook' | 'review' | 'library';

export type RoadmapStep =
  | { kind: 'arch'; dim: DimensionId; optionId: string; lens: LensId; note: Bilingual }
  | { kind: 'article'; slug: string; note: Bilingual }
  | { kind: 'advisor'; note: Bilingual };

export interface LearningPath {
  id: string;
  title: Bilingual;
  audience: 'newcomer' | 'practitioner' | 'architect';
  description: Bilingual;
  outcome: Bilingual;
  steps: RoadmapStep[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'architecture-fundamentals',
    title: b('Architecture fundamentals', 'Dasar-dasar arsitektur'),
    audience: 'newcomer',
    description: b(
      'Start from zero: what an architecture decision is, the simplest styles, and how to make your first informed choice.',
      'Mulai dari nol: apa itu keputusan arsitektur, gaya paling sederhana, dan cara membuat pilihan pertama yang terinformasi.',
    ),
    outcome: b(
      'You can explain the basic deployment styles and run the Advisor for a small project.',
      'Kamu bisa menjelaskan gaya deployment dasar dan menjalankan Advisor untuk proyek kecil.',
    ),
    steps: [
      { kind: 'arch', dim: 'D1', optionId: 'layered', lens: 'catalog', note: b('Meet the classic starting point — layers, and why they erode.', 'Kenali titik awal klasik — lapisan, dan mengapa ia terkikis.') },
      { kind: 'arch', dim: 'D1', optionId: 'monolith', lens: 'catalog', note: b('One deployable, one database — why "boring" is often right.', 'Satu deployable, satu basis data — mengapa "membosankan" sering kali benar.') },
      { kind: 'arch', dim: 'D1', optionId: 'modular-monolith', lens: 'catalog', note: b('Module boundaries without distribution — the pragmatic middle.', 'Batas modul tanpa distribusi — jalan tengah yang pragmatis.') },
      { kind: 'article', slug: 'monolith-microservices-decision-map', note: b('The whole D1 decision on one screen.', 'Seluruh keputusan D1 dalam satu layar.') },
      { kind: 'article', slug: 'writing-good-adrs', note: b('Record your decision so future-you knows why.', 'Catat keputusanmu agar dirimu di masa depan tahu alasannya.') },
      { kind: 'advisor', note: b('Run the Advisor with your own project factors and read the reasoning.', 'Jalankan Advisor dengan faktor proyekmu sendiri dan baca penalarannya.') },
    ],
  },
  {
    id: 'monolith-to-microservices',
    title: b('From monolith to microservices — safely', 'Dari monolith ke microservices — dengan aman'),
    audience: 'practitioner',
    description: b(
      'The migration journey: prove the boundaries first, extract only what needs independence, and avoid the classic failure modes.',
      'Perjalanan migrasi: buktikan batas dulu, ekstrak hanya yang butuh kemandirian, dan hindari mode kegagalan klasik.',
    ),
    outcome: b(
      'You can plan an incremental extraction and spot a distributed monolith before it ships.',
      'Kamu bisa merencanakan ekstraksi bertahap dan mengenali distributed monolith sebelum ia dirilis.',
    ),
    steps: [
      { kind: 'article', slug: 'when-to-use-microservices', note: b('Check the prerequisites before you commit.', 'Periksa prasyarat sebelum kamu berkomitmen.') },
      { kind: 'arch', dim: 'D1', optionId: 'modular-monolith', lens: 'playbook', note: b('Enforce module boundaries inside one process first.', 'Tegakkan batas modul di dalam satu proses lebih dulu.') },
      { kind: 'article', slug: 'strangler-fig-migration', note: b('Extract one capability at a time — never big-bang.', 'Ekstrak satu kapabilitas dalam satu waktu — jangan pernah big-bang.') },
      { kind: 'arch', dim: 'D1', optionId: 'microservices', lens: 'review', note: b('The honest evaluation: what you gain and what it costs.', 'Evaluasi jujur: apa yang kamu dapat dan apa biayanya.') },
      { kind: 'article', slug: 'detecting-distributed-monolith', note: b('The warning signs that the split went wrong.', 'Tanda-tanda peringatan bahwa pemecahan berjalan salah.') },
      { kind: 'article', slug: 'avoiding-premature-microservices', note: b('A checklist to keep you honest.', 'Checklist untuk menjagamu tetap jujur.') },
      { kind: 'advisor', note: b('Model your current system and compare D1 recommendations.', 'Modelkan sistemmu saat ini dan bandingkan rekomendasi D1.') },
    ],
  },
  {
    id: 'communication-styles',
    title: b('Going event-driven — sync, async, events, streams', 'Beralih ke event-driven — sync, async, event, stream'),
    audience: 'practitioner',
    description: b(
      'The whole D2 spectrum: when request–response is right, when messaging and events loosen the coupling, and when a durable stream is the backbone.',
      'Seluruh spektrum D2: kapan request–response tepat, kapan messaging dan event melonggarkan kopling, dan kapan stream yang tahan lama menjadi tulang punggung.',
    ),
    outcome: b(
      'You can choose a communication style deliberately, with its failure modes priced in.',
      'Kamu bisa memilih gaya komunikasi secara sengaja, dengan mode kegagalannya sudah diperhitungkan.',
    ),
    steps: [
      { kind: 'article', slug: 'choosing-communication-style', note: b('Sync vs async vs events — the core question.', 'Sync vs async vs event — pertanyaan intinya.') },
      { kind: 'arch', dim: 'D2', optionId: 'synchronous', lens: 'catalog', note: b('The baseline: request–response, and where its coupling strains.', 'Baseline: request–response, dan di mana koplingnya tertekan.') },
      { kind: 'arch', dim: 'D2', optionId: 'event-driven', lens: 'catalog', note: b('What event-driven really buys you.', 'Apa yang sebenarnya kamu dapat dari event-driven.') },
      { kind: 'arch', dim: 'D2', optionId: 'async-messaging', lens: 'playbook', note: b('Adopt messaging step by step (idempotency, DLQs, ordering).', 'Adopsi messaging langkah demi langkah (idempotensi, DLQ, pengurutan).') },
      { kind: 'arch', dim: 'D2', optionId: 'streaming', lens: 'review', note: b('The durable, replayable log — evaluated honestly.', 'Log yang tahan lama dan bisa diputar ulang — dievaluasi jujur.') },
      { kind: 'advisor', note: b('Raise the async and real-time factors and watch D2 reorder.', 'Naikkan faktor async dan real-time lalu lihat D2 berubah urutan.') },
    ],
  },
  {
    id: 'data-ownership',
    title: b('Data ownership, from one database to polyglot', 'Kepemilikan data, dari satu basis data ke polyglot'),
    audience: 'practitioner',
    description: b(
      'The hardest decision to reverse: who owns the data, how it stays consistent, and the patterns (sagas, outbox, CQRS, event sourcing) that keep a split correct.',
      'Keputusan yang paling sulit dibatalkan: siapa pemilik data, bagaimana ia tetap konsisten, dan pola (saga, outbox, CQRS, event sourcing) yang menjaga pemecahan tetap benar.',
    ),
    outcome: b(
      'You can decide when to split data — and keep a cross-service flow correct when you do.',
      'Kamu bisa memutuskan kapan memecah data — dan menjaga alur lintas-layanan tetap benar saat melakukannya.',
    ),
    steps: [
      { kind: 'article', slug: 'choosing-data-management', note: b('The D3 decision: from one DB to polyglot.', 'Keputusan D3: dari satu DB ke polyglot.') },
      { kind: 'arch', dim: 'D3', optionId: 'single-db', lens: 'catalog', note: b('Start here — and why staying is often right.', 'Mulai di sini — dan mengapa bertahan sering kali benar.') },
      { kind: 'arch', dim: 'D3', optionId: 'db-per-service', lens: 'playbook', note: b('Split ownership properly: sagas, the outbox, contracts.', 'Pecah kepemilikan dengan benar: saga, outbox, kontrak.') },
      { kind: 'arch', dim: 'D3', optionId: 'cqrs', lens: 'review', note: b('Separate read/write models — evaluated, including the over-use trap.', 'Pisahkan model baca/tulis — dievaluasi, termasuk jebakan penggunaan berlebihan.') },
      { kind: 'arch', dim: 'D3', optionId: 'event-sourcing', lens: 'review', note: b('The audit-trail heavyweight — evaluated honestly.', 'Kelas berat jejak audit — dievaluasi jujur.') },
      { kind: 'arch', dim: 'D3', optionId: 'polyglot', lens: 'library', note: b('The right store per job — concepts and terminology.', 'Penyimpanan yang tepat per tugas — konsep dan terminologi.') },
      { kind: 'article', slug: 'data-consistency-review', note: b('Sagas, the outbox, and eventual consistency — the review checklist.', 'Saga, outbox, dan konsistensi eventual — checklist tinjauan.') },
      { kind: 'advisor', note: b('Raise the consistency and data-volume factors and watch D3 shift.', 'Naikkan faktor konsistensi dan volume data lalu lihat D3 bergeser.') },
    ],
  },
  {
    id: 'clean-code-structure',
    title: b('Code structure that survives change', 'Struktur kode yang bertahan terhadap perubahan'),
    audience: 'practitioner',
    description: b(
      'Independent of how you deploy, the inside of the codebase decides the cost of change. Learn the structures that keep the core testable.',
      'Terlepas dari cara kamu men-deploy, bagian dalam basis kode menentukan biaya perubahan. Pelajari struktur yang menjaga inti tetap dapat diuji.',
    ),
    outcome: b(
      'You can pick between Hexagonal, Clean, Vertical Slice, and Layered for a given codebase.',
      'Kamu bisa memilih di antara Hexagonal, Clean, Vertical Slice, dan Layered untuk suatu basis kode.',
    ),
    steps: [
      { kind: 'article', slug: 'choosing-code-structure', note: b('The D4 decision in one guide.', 'Keputusan D4 dalam satu panduan.') },
      { kind: 'arch', dim: 'D4', optionId: 'layered', lens: 'review', note: b('The familiar baseline — honestly evaluated, erosion included.', 'Baseline yang familiar — dievaluasi jujur, termasuk erosinya.') },
      { kind: 'arch', dim: 'D4', optionId: 'hexagonal', lens: 'catalog', note: b('Ports & adapters — the core idea.', 'Port & adapter — ide intinya.') },
      { kind: 'arch', dim: 'D4', optionId: 'clean', lens: 'playbook', note: b('Adopt the dependency rule without the ceremony trap.', 'Adopsi aturan dependensi tanpa jebakan seremoni.') },
      { kind: 'arch', dim: 'D4', optionId: 'vertical-slice', lens: 'review', note: b('The feature-first alternative, evaluated.', 'Alternatif feature-first, dievaluasi.') },
      { kind: 'article', slug: 'genai-and-architecture', note: b('Why clear boundaries matter more in the AI-assisted era.', 'Mengapa batas yang jelas makin penting di era berbantuan AI.') },
      { kind: 'article', slug: 'architectural-technical-debt', note: b('Manage the structural compromises you do take on.', 'Kelola kompromi struktural yang memang kamu ambil.') },
    ],
  },
  {
    id: 'frontend-at-scale',
    title: b('Frontend architecture, from SPA to micro-frontends', 'Arsitektur frontend, dari SPA ke micro-frontend'),
    audience: 'practitioner',
    description: b(
      'First paint, SEO, interactivity, team autonomy — the D5 trade-off, plus the organisational law behind it.',
      'First paint, SEO, interaktivitas, otonomi tim — trade-off D5, plus hukum organisasional di baliknya.',
    ),
    outcome: b(
      'You can match a rendering strategy to a product and know when micro-frontends earn their cost.',
      'Kamu bisa mencocokkan strategi rendering dengan produk dan tahu kapan micro-frontend sepadan dengan biayanya.',
    ),
    steps: [
      { kind: 'article', slug: 'choosing-frontend-architecture', note: b('SPA vs SSR/SSG vs micro-frontends — the map.', 'SPA vs SSR/SSG vs micro-frontend — petanya.') },
      { kind: 'arch', dim: 'D5', optionId: 'spa', lens: 'catalog', note: b('The rich-client default and its blind spots.', 'Default rich-client dan titik butanya.') },
      { kind: 'arch', dim: 'D5', optionId: 'ssr', lens: 'review', note: b('Server rendering, evaluated: first paint and SEO.', 'Server rendering, dievaluasi: first paint dan SEO.') },
      { kind: 'arch', dim: 'D5', optionId: 'micro-frontends', lens: 'playbook', note: b('Adopt team-owned UI pieces without a consistency mess.', 'Adopsi potongan UI milik tim tanpa kekacauan konsistensi.') },
      { kind: 'article', slug: 'conways-law-team-topologies', note: b("Conway's Law: why the org chart shows up in the UI.", 'Hukum Conway: mengapa bagan organisasi muncul di UI.') },
      { kind: 'advisor', note: b('Vary team size and watch when micro-frontends start to win D5.', 'Variasikan ukuran tim dan lihat kapan micro-frontend mulai memenangkan D5.') },
    ],
  },
  {
    id: 'reviewing-architecture',
    title: b('Reviewing an architecture like an architect', 'Meninjau arsitektur seperti seorang arsitek'),
    audience: 'architect',
    description: b(
      'Structured evaluation: quality attributes, scenario-driven review, and automated guards that keep the decisions honest over time.',
      'Evaluasi terstruktur: quality attribute, tinjauan berbasis skenario, dan penjaga otomatis yang menjaga keputusan tetap jujur dari waktu ke waktu.',
    ),
    outcome: b(
      'You can run an ATAM-style review and turn its findings into CI-enforced fitness functions.',
      'Kamu bisa menjalankan tinjauan gaya ATAM dan mengubah temuannya menjadi fitness function yang ditegakkan CI.',
    ),
    steps: [
      { kind: 'article', slug: 'atam-review-checklist', note: b('The scenario-driven review method, step by step.', 'Metode tinjauan berbasis skenario, langkah demi langkah.') },
      { kind: 'arch', dim: 'D1', optionId: 'serverless', lens: 'review', note: b('Practice on a style with sharp trade-offs.', 'Berlatih pada gaya dengan trade-off yang tajam.') },
      { kind: 'article', slug: 'serverless-readiness-checklist', note: b('A readiness checklist you can reuse in reviews.', 'Checklist kesiapan yang bisa kamu pakai ulang dalam tinjauan.') },
      { kind: 'article', slug: 'fitness-functions-guarding', note: b('Turn review findings into failing tests.', 'Ubah temuan tinjauan menjadi tes yang gagal.') },
      { kind: 'article', slug: 'green-software-architecture', note: b('Add the sustainability lens — utilization as a review criterion.', 'Tambahkan lensa keberlanjutan — utilisasi sebagai kriteria tinjauan.') },
      { kind: 'advisor', note: b("Use the Advisor's radar and sensitivity cards as review input.", 'Gunakan radar dan kartu sensitivitas Advisor sebagai masukan tinjauan.') },
    ],
  },
];
