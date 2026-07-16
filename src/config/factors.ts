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
    question: { en: 'How big is your team?', id: 'Seberapa besar tim Anda?' },
    gloss: {
      en: "More people means you'll want pieces that can be worked on separately.",
      id: 'Makin banyak orang, makin perlu bagian yang bisa dikerjakan terpisah.',
    },
    primary: true,
    levels: [
      { en: 'Small (1–5)', id: 'Kecil (1–5)' },
      { en: 'Medium (6–20)', id: 'Sedang (6–20)' },
      { en: 'Large / multiple teams', id: 'Besar / banyak tim' },
    ],
    examples: [
      { en: 'e.g. a founding duo or one squad owning everything', id: 'mis. duo founder atau satu squad memegang semuanya' },
      { en: 'e.g. 2–3 squads sharing one codebase', id: 'mis. 2–3 squad berbagi satu codebase' },
      { en: 'e.g. several squads needing independent releases', id: 'mis. banyak squad yang butuh rilis independen' },
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
    question: { en: 'Where does your team work?', id: 'Dari mana tim Anda bekerja?' },
    gloss: {
      en: 'All in one office, or spread across places and time zones?',
      id: 'Satu kantor, atau tersebar di banyak tempat dan zona waktu?',
    },
    levels: [
      { en: 'Co-located', id: 'Satu lokasi' },
      { en: 'Partly remote', id: 'Sebagian remote' },
      { en: 'Fully distributed / global', id: 'Terdistribusi penuh / global' },
    ],
    examples: [
      { en: 'e.g. everyone in one office, same hours', id: 'mis. semua di satu kantor, jam kerja sama' },
      { en: 'e.g. hybrid — a core office plus remote engineers', id: 'mis. hibrida — kantor inti plus engineer remote' },
      { en: 'e.g. contributors across time zones, async-first', id: 'mis. kontributor lintas zona waktu, async-first' },
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
    question: { en: 'How soon must it launch?', id: 'Seberapa cepat harus diluncurkan?' },
    gloss: {
      en: "A relaxed timeline, or a hard deadline that can't slip?",
      id: 'Jadwal santai, atau tenggat ketat yang tak bisa mundur?',
    },
    levels: [
      { en: 'Relaxed', id: 'Santai' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Very urgent', id: 'Sangat mendesak' },
    ],
    examples: [
      { en: 'e.g. an internal replatform with no fixed date', id: 'mis. replatform internal tanpa tanggal pasti' },
      { en: 'e.g. a quarterly roadmap with a target release', id: 'mis. roadmap kuartalan dengan target rilis' },
      { en: 'e.g. a demo day, regulation deadline, or funding milestone', id: 'mis. demo day, tenggat regulasi, atau milestone pendanaan' },
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
    question: { en: 'How tight is the budget?', id: 'Seberapa ketat anggarannya?' },
    gloss: {
      en: 'A tight budget favors cheaper-to-run choices.',
      id: 'Anggaran ketat mengutamakan pilihan yang murah dijalankan.',
    },
    levels: [
      { en: 'Tight', id: 'Ketat' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Flexible', id: 'Longgar' },
    ],
    examples: [
      { en: 'e.g. bootstrap/pre-seed — every server counts', id: 'mis. bootstrap/pra-seed — tiap server berarti' },
      { en: 'e.g. a funded team with a monthly cloud cap', id: 'mis. tim didanai dengan plafon cloud bulanan' },
      { en: 'e.g. enterprise budget — spend to move faster', id: 'mis. anggaran enterprise — belanja demi kecepatan' },
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
    question: { en: 'How long will it live?', id: 'Berapa lama akan dipakai?' },
    gloss: {
      en: "A quick experiment, or a system you'll run for years?",
      id: 'Eksperimen singkat, atau sistem yang dipakai bertahun-tahun?',
    },
    levels: [
      { en: 'Throwaway / prototype', id: 'Sekali pakai / prototipe' },
      { en: 'Medium-term', id: 'Jangka menengah' },
      { en: 'Long-lived / strategic', id: 'Jangka panjang / strategis' },
    ],
    examples: [
      { en: 'e.g. a hackathon build or campaign microsite', id: 'mis. proyek hackathon atau microsite kampanye' },
      { en: 'e.g. a product for the next 1–3 years', id: 'mis. produk untuk 1–3 tahun ke depan' },
      { en: 'e.g. a core system you will run for 5–10+ years', id: 'mis. sistem inti yang dijalankan 5–10+ tahun' },
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
    question: { en: 'How many people will use it?', id: 'Berapa banyak orang akan memakainya?' },
    gloss: {
      en: 'An office tool is "low". A nationwide app during a sale is "high".',
      id: 'Alat kantor itu "rendah". Aplikasi nasional saat promo itu "tinggi".',
    },
    primary: true,
    levels: [
      { en: 'Low', id: 'Rendah' },
      { en: 'Medium', id: 'Sedang' },
      { en: 'High / extreme spikes', id: 'Tinggi / lonjakan ekstrem' },
    ],
    examples: [
      { en: 'e.g. hundreds of users, predictable load', id: 'mis. ratusan pengguna, beban bisa diprediksi' },
      { en: 'e.g. tens of thousands of users, business-hour peaks', id: 'mis. puluhan ribu pengguna, puncak jam kerja' },
      { en: 'e.g. millions of users or flash-sale spikes', id: 'mis. jutaan pengguna atau lonjakan flash sale' },
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
    question: { en: 'How much data will it hold?', id: 'Seberapa banyak data yang disimpan?' },
    gloss: {
      en: 'A little, or huge amounts that grow fast?',
      id: 'Sedikit, atau sangat banyak dan tumbuh cepat?',
    },
    levels: [
      { en: 'Low', id: 'Rendah' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Very large / big data', id: 'Sangat besar / big data' },
    ],
    examples: [
      { en: 'e.g. a few GB — one database handles it', id: 'mis. beberapa GB — satu basis data cukup' },
      { en: 'e.g. hundreds of GB, growing steadily', id: 'mis. ratusan GB, tumbuh stabil' },
      { en: 'e.g. TB+ event streams, logs, or telemetry', id: 'mis. TB+ aliran event, log, atau telemetri' },
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
    question: { en: 'How much happens in the background?', id: 'Seberapa banyak proses di latar belakang?' },
    gloss: {
      en: 'Mostly instant requests, or lots of jobs and events?',
      id: 'Kebanyakan permintaan instan, atau banyak job dan event?',
    },
    levels: [
      { en: 'Minimal', id: 'Minimal' },
      { en: 'Some', id: 'Sebagian' },
      { en: 'Heavy / many integrations', id: 'Berat / banyak integrasi' },
    ],
    examples: [
      { en: 'e.g. plain request → response CRUD', id: 'mis. CRUD request → response biasa' },
      { en: 'e.g. emails, exports, or payments in background jobs', id: 'mis. email, ekspor, atau pembayaran lewat job latar' },
      { en: 'e.g. many integrations reacting to each other\'s events', id: 'mis. banyak integrasi saling bereaksi lewat event' },
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
    question: { en: 'How fast must it react?', id: 'Seberapa cepat harus merespons?' },
    gloss: {
      en: 'Normal web speed, or split-second live updates?',
      id: 'Kecepatan web biasa, atau pembaruan langsung sepersekian detik?',
    },
    levels: [
      { en: 'Not important', id: 'Tidak penting' },
      { en: 'Somewhat', id: 'Cukup penting' },
      { en: 'Critical (sub-second)', id: 'Kritis (sub-detik)' },
    ],
    examples: [
      { en: 'e.g. dashboards can refresh on reload', id: 'mis. dasbor cukup segar saat dimuat ulang' },
      { en: 'e.g. near-live notifications and status updates', id: 'mis. notifikasi & status mendekati langsung' },
      { en: 'e.g. chat, trading, tracking, or multiplayer', id: 'mis. chat, trading, pelacakan, atau multiplayer' },
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
    question: { en: 'How complex are the business rules?', id: 'Seberapa rumit aturan bisnisnya?' },
    gloss: {
      en: 'Simple forms, or intricate logic with many cases?',
      id: 'Formulir sederhana, atau logika rumit dengan banyak kasus?',
    },
    levels: [
      { en: 'Simple', id: 'Sederhana' },
      { en: 'Moderate', id: 'Sedang' },
      { en: 'Complex', id: 'Kompleks' },
    ],
    examples: [
      { en: 'e.g. forms, lists, and simple workflows', id: 'mis. formulir, daftar, dan alur sederhana' },
      { en: 'e.g. some business rules and integrations', id: 'mis. ada aturan bisnis dan integrasi' },
      { en: 'e.g. pricing engines, logistics, clinical or tax rules', id: 'mis. mesin harga, logistik, aturan klinis atau pajak' },
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
    question: { en: 'Must the data always be exact?', id: 'Haruskah data selalu tepat?' },
    gloss: {
      en: 'Money must be exact instantly. A "likes" count can lag a second — fine.',
      id: 'Uang harus tepat seketika. Jumlah "suka" boleh telat sedetik — tak apa.',
    },
    primary: true,
    levels: [
      { en: 'Eventual is fine', id: 'Eventual cukup' },
      { en: 'Mixed', id: 'Campuran' },
      { en: 'Strong consistency required', id: 'Wajib konsistensi kuat' },
    ],
    examples: [
      { en: 'e.g. feeds and counters may lag a few seconds', id: 'mis. feed dan penghitung boleh telat beberapa detik' },
      { en: 'e.g. money strict, analytics relaxed', id: 'mis. uang ketat, analitik longgar' },
      { en: 'e.g. balances, inventory, bookings must never disagree', id: 'mis. saldo, stok, booking tak boleh berbeda' },
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
    question: { en: 'How sensitive is the data?', id: 'Seberapa sensitif datanya?' },
    gloss: {
      en: 'Ordinary data, or regulated info like health or finance?',
      id: 'Data biasa, atau info teregulasi seperti kesehatan atau keuangan?',
    },
    levels: [
      { en: 'Standard', id: 'Standar' },
      { en: 'Elevated', id: 'Lebih tinggi' },
      { en: 'Strict (regulated data)', id: 'Ketat (data teregulasi)' },
    ],
    examples: [
      { en: 'e.g. no sensitive data beyond user accounts', id: 'mis. tak ada data sensitif selain akun pengguna' },
      { en: 'e.g. personal data (PII), payments via a provider', id: 'mis. data pribadi (PII), pembayaran via penyedia' },
      { en: 'e.g. health/financial records, audits, compliance', id: 'mis. rekam kesehatan/keuangan, audit, kepatuhan' },
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
    question: { en: 'Any old systems to connect to?', id: 'Ada sistem lama yang harus dihubungkan?' },
    gloss: {
      en: 'Greenfield, or lots of legacy to integrate with?',
      id: 'Greenfield, atau banyak sistem lama yang harus diintegrasikan?',
    },
    levels: [
      { en: 'None / greenfield', id: 'Tidak ada / greenfield' },
      { en: 'Some', id: 'Sebagian' },
      { en: 'Heavy legacy coupling', id: 'Keterikatan legacy berat' },
    ],
    examples: [
      { en: 'e.g. brand-new build, no old systems to talk to', id: 'mis. proyek baru, tanpa sistem lama' },
      { en: 'e.g. a few integrations with an existing ERP/DB', id: 'mis. beberapa integrasi dengan ERP/DB lama' },
      { en: 'e.g. the old system is still the source of truth', id: 'mis. sistem lama masih jadi sumber kebenaran' },
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
    question: { en: 'How strong is your automation?', id: 'Seberapa kuat otomasi Anda?' },
    gloss: {
      en: 'Manual deploys, or mature CI/CD and monitoring?',
      id: 'Deploy manual, atau CI/CD dan pemantauan yang matang?',
    },
    levels: [
      { en: 'Low', id: 'Rendah' },
      { en: 'Medium', id: 'Sedang' },
      { en: 'Mature (CI/CD, monitoring)', id: 'Matang (CI/CD, pemantauan)' },
    ],
    examples: [
      { en: 'e.g. manual deploys, little monitoring', id: 'mis. deploy manual, monitoring minim' },
      { en: 'e.g. CI + basic pipelines, some on-call', id: 'mis. CI + pipeline dasar, ada on-call' },
      { en: 'e.g. automated deploys, observability, SRE practice', id: 'mis. deploy otomatis, observability, praktik SRE' },
    ],
    help: {
      en: "How strong the team's automation and operations are. Mature platforms can safely run more independently deployed parts (deployability, observability).",
      id: 'Seberapa kuat otomasi dan operasional tim. Platform yang matang dapat menjalankan lebih banyak bagian yang dirilis mandiri secara aman (kemudahan rilis, observabilitas).',
    },
    group: DOMAIN_RISK,
  },
};
