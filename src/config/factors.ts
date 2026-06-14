import type { Factor, FactorId } from '../types';

// 14 project factors (drivers & constraints) — the user-facing inputs.
// Bilingual copy is verbatim from docs/03-blueprint/model-data-sheet.md Section 2.1
// (English level labels are locked to Build Spec Section 4; ID copy is interim-reviewed).
// Defaults: every factor starts at level 0 EXCEPT ttm=1 and budget=2 (see config/defaults via engine).

const TEAM_DELIVERY = { en: 'Team & delivery', id: 'Tim & pengiriman' };
const SCALE_PERF = { en: 'Scale & performance', id: 'Skala & performa' };
const DOMAIN_RISK = { en: 'Domain, data & risk', id: 'Domain, data & risiko' };

export const FACTOR_ORDER: FactorId[] = [
  'team',
  'distribution',
  'ttm',
  'budget',
  'lifespan',
  'scale',
  'dataVolume',
  'async',
  'realtime',
  'domain',
  'consistency',
  'security',
  'legacy',
  'devops',
];

export const FACTORS: Record<FactorId, Factor> = {
  team: {
    id: 'team',
    label: { en: 'Team size', id: 'Ukuran tim' },
    levels: [
      { en: 'Small (1–5)', id: 'Kecil (1–5)' },
      { en: 'Medium (6–20)', id: 'Sedang (6–20)' },
      { en: 'Large / multiple teams', id: 'Besar / banyak tim' },
    ],
    help: {
      en: 'How many people build and maintain the system. Larger or multiple teams make independent releases and clear module boundaries more valuable (deployability, maintainability).',
      id: 'Berapa banyak orang yang membangun dan merawat sistem. Tim besar atau banyak tim membuat rilis mandiri dan batas modul yang jelas semakin penting (kemudahan rilis, kemudahan pemeliharaan).',
    },
    group: TEAM_DELIVERY,
  },
  distribution: {
    id: 'distribution',
    label: { en: 'Team distribution', id: 'Sebaran tim' },
    levels: [
      { en: 'Co-located', id: 'Satu lokasi' },
      { en: 'Partly remote', id: 'Sebagian remote' },
      { en: 'Fully distributed / global', id: 'Terdistribusi penuh / global' },
    ],
    help: {
      en: 'Where the team works from. Distributed teams coordinate less easily, so architectures that let each group ship independently matter more (deployability, maintainability).',
      id: 'Dari mana tim bekerja. Tim terdistribusi lebih sulit berkoordinasi, sehingga arsitektur yang memungkinkan tiap kelompok rilis secara mandiri menjadi lebih penting (kemudahan rilis, kemudahan pemeliharaan).',
    },
    group: TEAM_DELIVERY,
  },
  ttm: {
    id: 'ttm',
    label: { en: 'Time-to-market pressure', id: 'Tekanan waktu rilis' },
    levels: [
      { en: 'Relaxed', id: 'Santai' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Very urgent', id: 'Sangat mendesak' },
    ],
    help: {
      en: 'How urgently the first version must ship. High pressure favors simple options that deliver fast (time-to-market), at a small cost to long-term structure (maintainability).',
      id: 'Seberapa mendesak versi pertama harus dirilis. Tekanan tinggi mengutamakan opsi sederhana yang cepat jadi (waktu rilis), dengan sedikit mengorbankan struktur jangka panjang (kemudahan pemeliharaan).',
    },
    group: TEAM_DELIVERY,
  },
  budget: {
    id: 'budget',
    label: { en: 'Budget / cost flexibility', id: 'Fleksibilitas anggaran' },
    levels: [
      { en: 'Tight', id: 'Ketat' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Flexible', id: 'Longgar' },
    ],
    help: {
      en: 'How much money is available to run the system. A tight budget raises the weight of cost efficiency — this factor is inverted: level 0 (Tight) is the strongest signal.',
      id: 'Seberapa besar dana untuk menjalankan sistem. Anggaran ketat menaikkan bobot efisiensi biaya — faktor ini terbalik: level 0 (Ketat) adalah sinyal terkuat.',
    },
    group: TEAM_DELIVERY,
    inverted: true,
  },
  lifespan: {
    id: 'lifespan',
    label: { en: 'Expected system lifespan', id: 'Perkiraan umur sistem' },
    levels: [
      { en: 'Throwaway / prototype', id: 'Sekali pakai / prototipe' },
      { en: 'Medium-term', id: 'Jangka menengah' },
      { en: 'Long-lived / strategic', id: 'Jangka panjang / strategis' },
    ],
    help: {
      en: 'How long the system is expected to live. Long-lived systems repay investment in clean structure, tests, and monitoring (maintainability, testability, observability).',
      id: 'Berapa lama sistem diperkirakan dipakai. Sistem berumur panjang layak diberi investasi struktur yang rapi, pengujian, dan pemantauan (kemudahan pemeliharaan, kemudahan pengujian, observabilitas).',
    },
    group: TEAM_DELIVERY,
  },
  scale: {
    id: 'scale',
    label: { en: 'Expected scale / traffic', id: 'Perkiraan skala / trafik' },
    levels: [
      { en: 'Low', id: 'Rendah' },
      { en: 'Medium', id: 'Sedang' },
      { en: 'High / extreme spikes', id: 'Tinggi / lonjakan ekstrem' },
    ],
    help: {
      en: 'How much traffic the system must handle. High scale raises scalability, performance, and availability — and cost efficiency, because waste multiplies at scale.',
      id: 'Seberapa besar trafik yang harus ditangani. Skala tinggi menaikkan bobot skalabilitas, performa, dan ketersediaan — juga efisiensi biaya, karena pemborosan ikut berlipat pada skala besar.',
    },
    group: SCALE_PERF,
  },
  dataVolume: {
    id: 'dataVolume',
    label: { en: 'Data volume', id: 'Volume data' },
    levels: [
      { en: 'Low', id: 'Rendah' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Very large / big data', id: 'Sangat besar / big data' },
    ],
    help: {
      en: 'How much data is stored and processed. Very large data raises scalability and performance needs, and storage cost matters more (cost efficiency).',
      id: 'Seberapa banyak data yang disimpan dan diolah. Data sangat besar menaikkan kebutuhan skalabilitas dan performa, dan biaya penyimpanan semakin berpengaruh (efisiensi biaya).',
    },
    group: SCALE_PERF,
  },
  async: {
    id: 'async',
    label: { en: 'Async / event-driven workload', id: 'Beban asinkron / berbasis event' },
    levels: [
      { en: 'Minimal', id: 'Minimal' },
      { en: 'Some', id: 'Sebagian' },
      { en: 'Heavy / many integrations', id: 'Berat / banyak integrasi' },
    ],
    help: {
      en: 'How much work happens in the background or reacts to events. Heavy async workloads favor architectures that absorb bursts and keep running when one part is busy (scalability, availability, performance).',
      id: 'Seberapa banyak pekerjaan berjalan di latar belakang atau bereaksi terhadap event. Beban asinkron yang berat cocok dengan arsitektur yang mampu menyerap lonjakan dan tetap berjalan saat satu bagian sibuk (skalabilitas, ketersediaan, performa).',
    },
    group: SCALE_PERF,
  },
  realtime: {
    id: 'realtime',
    label: { en: 'Real-time / low-latency need', id: 'Kebutuhan real-time / latensi rendah' },
    levels: [
      { en: 'Not important', id: 'Tidak penting' },
      { en: 'Somewhat', id: 'Cukup penting' },
      { en: 'Critical (sub-second)', id: 'Kritis (sub-detik)' },
    ],
    help: {
      en: 'How fast responses must be. Sub-second requirements push performance to the top, with availability close behind.',
      id: 'Seberapa cepat respons harus diberikan. Kebutuhan sub-detik menempatkan performa di prioritas teratas, disusul ketersediaan.',
    },
    group: SCALE_PERF,
  },
  domain: {
    id: 'domain',
    label: { en: 'Business domain complexity', id: 'Kompleksitas domain bisnis' },
    levels: [
      { en: 'Simple', id: 'Sederhana' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Complex', id: 'Kompleks' },
    ],
    help: {
      en: 'How intricate the business rules are. Complex domains repay structures that isolate and test business logic (maintainability, testability).',
      id: 'Seberapa rumit aturan bisnisnya. Domain yang kompleks layak diberi struktur yang memisahkan dan menguji logika bisnis (kemudahan pemeliharaan, kemudahan pengujian).',
    },
    group: DOMAIN_RISK,
  },
  consistency: {
    id: 'consistency',
    label: { en: 'Data consistency need', id: 'Kebutuhan konsistensi data' },
    levels: [
      { en: 'Eventual is fine', id: 'Eventual cukup' },
      { en: 'Mixed', id: 'Campuran' },
      { en: 'Strong consistency required', id: 'Wajib konsistensi kuat' },
    ],
    help: {
      en: 'How strictly data must agree at all times. A strong-consistency requirement dominates the data-management choice (data consistency).',
      id: 'Seberapa ketat data harus selalu sinkron. Kebutuhan konsistensi kuat sangat menentukan pilihan pengelolaan data (konsistensi data).',
    },
    group: DOMAIN_RISK,
  },
  security: {
    id: 'security',
    label: { en: 'Security / compliance need', id: 'Kebutuhan keamanan / kepatuhan' },
    levels: [
      { en: 'Standard', id: 'Standar' },
      { en: 'Elevated', id: 'Lebih tinggi' },
      { en: 'Strict (regulated data)', id: 'Ketat (data teregulasi)' },
    ],
    help: {
      en: 'How sensitive the data and rules are. Regulated data (finance, health) raises the security weight sharply.',
      id: 'Seberapa sensitif data dan aturannya. Data teregulasi (keuangan, kesehatan) menaikkan bobot keamanan secara tajam.',
    },
    group: DOMAIN_RISK,
  },
  legacy: {
    id: 'legacy',
    label: { en: 'Legacy integration burden', id: 'Beban integrasi sistem lama' },
    levels: [
      { en: 'None / greenfield', id: 'Tidak ada / greenfield' },
      { en: 'Some', id: 'Sebagian' },
      { en: 'Heavy legacy coupling', id: 'Keterikatan legacy berat' },
    ],
    help: {
      en: 'How much the system must connect to older systems. Heavy legacy coupling raises interoperability and rewards architectures with clean integration seams (maintainability).',
      id: 'Seberapa besar sistem harus terhubung ke sistem lama. Keterikatan legacy yang berat menaikkan bobot interoperabilitas dan menghargai arsitektur dengan titik integrasi yang rapi (kemudahan pemeliharaan).',
    },
    group: DOMAIN_RISK,
  },
  devops: {
    id: 'devops',
    label: { en: 'DevOps / platform maturity', id: 'Kematangan DevOps / platform' },
    levels: [
      { en: 'Low', id: 'Rendah' },
      { en: 'Medium', id: 'Sedang' },
      { en: 'Mature (CI/CD, monitoring)', id: 'Matang (CI/CD, pemantauan)' },
    ],
    help: {
      en: "How strong the team's automation and operations are. Mature platforms can safely run more independently deployed parts (deployability, observability).",
      id: 'Seberapa kuat otomasi dan operasional tim. Platform yang matang dapat menjalankan lebih banyak bagian yang dirilis mandiri secara aman (kemudahan rilis, observabilitas).',
    },
    group: DOMAIN_RISK,
  },
};
