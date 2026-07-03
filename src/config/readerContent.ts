import type { Bilingual, DimensionId } from '../types';

// In-app content for the architecture explanations in the Manual / Guide (Section 5) — a
// plain-language, evidence-grounded companion to the Advisor. This is a CONCISE bilingual mirror of
// the canonical scholarly document (docs/03-blueprint/architecture-reader.md), which carries the full
// prose and the primary sources. Written for two audiences at once: `what`/`fits`/`cost` read for
// newcomers, `deeper` adds mechanism + evidence for experts. Citation keys map into READER_CITATIONS.
//
// Grounding, not dogma: these are defensible, well-supported explanations — context decides. All
// citations are to recognised standards, seminal books, and peer-reviewed / widely-cited works
// (no fabricated sources). Keep in sync with the doc via the model guards.

export interface ReaderCitation {
  /** Stable key used by entries (e.g. 'newman'). */
  key: string;
  label: string;
  note: Bilingual;
  /** Public link where a stable one exists (books cited by author/edition without a URL). */
  url?: string;
}

export interface ReaderEntry {
  /** Matches the option id in dimensions.ts. */
  optionId: string;
  name: string;
  what: Bilingual;
  fits: Bilingual;
  cost: Bilingual;
  deeper: Bilingual;
  cites: string[];
}

export interface ReaderSection {
  dim: DimensionId;
  intro: Bilingual;
  entries: ReaderEntry[];
}

export interface ReaderMethodPoint {
  title: Bilingual;
  body: Bilingual;
  cites: string[];
}

export const READER_INTRO: Bilingual = {
  en: 'A plain-language, evidence-grounded companion to the Advisor. It explains what each architecture is, when it fits, and what it costs — for newcomers and experts alike — drawing on recognised standards and the software-architecture literature. These are defensible, well-supported explanations, not universal laws: context decides.',
  id: 'Pendamping berbahasa sederhana dan berbasis bukti untuk Advisor. Menjelaskan apa itu tiap arsitektur, kapan cocok, dan apa biayanya — untuk pemula maupun ahli — bersumber pada standar yang diakui dan literatur arsitektur perangkat lunak. Ini penjelasan yang dapat dipertanggungjawabkan, bukan hukum mutlak: konteks yang menentukan.',
};

export const READER_METHOD_TITLE: Bilingual = {
  en: 'Why quality attributes — the method',
  id: 'Mengapa atribut kualitas — metodenya',
};

export const READER_METHOD: ReaderMethodPoint[] = [
  {
    title: { en: 'Quality vocabulary (ISO/IEC 25010:2023)', id: 'Kosakata kualitas (ISO/IEC 25010:2023)' },
    body: {
      en: 'The Advisor scores decisions against quality attributes — the "-ilities" — using the ISO product-quality model as its spine, with delivery goals (cost, time-to-market) shown honestly outside it.',
      id: 'Advisor menilai keputusan terhadap atribut kualitas — para "-ilitas" — dengan model kualitas produk ISO sebagai tulang punggung, sementara tujuan pengiriman (biaya, waktu-ke-pasar) ditampilkan jujur di luarnya.',
    },
    cites: ['iso25010'],
  },
  {
    title: { en: 'Trade-off analysis (ATAM & ADD)', id: 'Analisis trade-off (ATAM & ADD)' },
    body: {
      en: 'A decision that helps one quality usually costs another. ATAM turns stakeholder concerns into weighted, testable priorities; Attribute-Driven Design chooses structures because they serve those priorities.',
      id: 'Keputusan yang membantu satu kualitas biasanya mengorbankan yang lain. ATAM mengubah kepentingan pemangku menjadi prioritas berbobot yang dapat diuji; Attribute-Driven Design memilih struktur karena melayani prioritas itu.',
    },
    cites: ['atam', 'add'],
  },
  {
    title: { en: 'Transparent scoring (MAVT)', id: 'Penilaian transparan (MAVT)' },
    body: {
      en: 'The score is an additive weighted value (Σ weight × fit) from Multi-Attribute Value Theory — auditable, not a black box. That is why the tool surfaces close calls and sensitivity instead of claiming one "correct" answer.',
      id: 'Skor adalah nilai tertimbang aditif (Σ bobot × kecocokan) dari Multi-Attribute Value Theory — dapat diaudit, bukan kotak hitam. Itulah mengapa alat ini menampilkan keputusan tipis dan sensitivitas alih-alih mengklaim satu jawaban "benar".',
    },
    cites: ['mavt'],
  },
  {
    title: { en: 'Guarding it over time (fitness functions)', id: 'Menjaganya dari waktu ke waktu (fitness function)' },
    body: {
      en: 'Evolutionary architecture makes the chosen qualities measurable, so the architecture can be protected as it changes.',
      id: 'Arsitektur evolusioner membuat kualitas yang dipilih dapat diukur, sehingga arsitektur dapat dijaga saat berubah.',
    },
    cites: ['evoarch'],
  },
];

export const READER_SECTIONS: ReaderSection[] = [
  {
    dim: 'D1',
    intro: {
      en: 'How the system is split into deployables — the most consequential structural choice, trading team autonomy and independent scaling against operational complexity.',
      id: 'Bagaimana sistem dipecah menjadi unit deploy — pilihan struktural paling berdampak, menukar otonomi tim dan penskalaan independen dengan kompleksitas operasional.',
    },
    entries: [
      {
        optionId: 'layered',
        name: 'Layered / N-Tier',
        what: { en: 'One deployable in horizontal layers: presentation → business → data.', id: 'Satu unit deploy dalam lapisan horizontal: presentasi → bisnis → data.' },
        fits: { en: 'Small teams, well-understood domains, and a fast start — the "boring" default that is often right.', id: 'Tim kecil, domain yang sudah dipahami, dan mulai cepat — pilihan "membosankan" yang sering kali tepat.' },
        cost: { en: 'As the domain grows, layers can erode into a tangle because they enforce roles, not domain boundaries.', id: 'Saat domain tumbuh, lapisan bisa berubah menjadi kusut karena menegakkan peran, bukan batas domain.' },
        deeper: { en: 'Layering is a technical partitioning, so one feature change often touches every layer — poor change locality.', id: 'Pelapisan adalah partisi teknis, sehingga satu perubahan fitur kerap menyentuh semua lapisan — lokalitas perubahan buruk.' },
        cites: ['fundamentals', 'peaa', 'bass'],
      },
      {
        optionId: 'monolith',
        name: 'Monolith',
        what: { en: 'A single deployable containing the whole application.', id: 'Satu unit deploy yang memuat seluruh aplikasi.' },
        fits: { en: 'Early products and small teams — deployment, testing, and refactoring are simplest, and strong consistency is trivial.', id: 'Produk awal dan tim kecil — deploy, pengujian, dan refactor paling sederhana, dan konsistensi kuat itu mudah.' },
        cost: { en: 'One shared failure domain and one release cadence; scaling means scaling the whole app.', id: 'Satu domain kegagalan bersama dan satu irama rilis; menskalakan berarti menskalakan seluruh aplikasi.' },
        deeper: { en: '"Monolith First": most systems should start monolithic and extract services only once boundaries are proven — premature distribution is a costly, common mistake.', id: '"Monolith First": kebanyakan sistem sebaiknya mulai monolitik dan mengekstrak layanan hanya setelah batas terbukti — distribusi dini adalah kesalahan umum yang mahal.' },
        cites: ['fowlerMonolithFirst', 'newman', 'fritzschMigration'],
      },
      {
        optionId: 'modular-monolith',
        name: 'Modular Monolith',
        what: { en: 'A single deployable with enforced internal module boundaries.', id: 'Satu unit deploy dengan batas modul internal yang ditegakkan.' },
        fits: { en: 'You want clean boundaries and independent team workstreams without distributed-systems overhead — often the pragmatic sweet spot.', id: 'Anda ingin batas rapi dan alur kerja tim independen tanpa beban sistem terdistribusi — kerap titik ideal yang pragmatis.' },
        cost: { en: 'Boundaries can still erode without discipline (enforce them in CI); still one deploy and one failure domain.', id: 'Batas tetap bisa terkikis tanpa disiplin (tegakkan di CI); tetap satu deploy dan satu domain kegagalan.' },
        deeper: { en: 'Modules aligned to bounded contexts give most of microservices’ modularity and a clean Strangler-Fig path to extraction later — split out a service only when it truly needs independent scale or deploy.', id: 'Modul yang selaras dengan bounded context memberi sebagian besar modularitas microservices dan jalur Strangler-Fig yang rapi untuk ekstraksi kelak — pisahkan layanan hanya saat benar-benar butuh skala atau deploy mandiri.' },
        cites: ['hardparts', 'ddd', 'strangler', 'newman', 'conwayTeams'],
      },
      {
        optionId: 'microservices',
        name: 'Microservices',
        what: { en: 'Many independently deployable services, each owning its data, talking over the network.', id: 'Banyak layanan yang dapat dideploy mandiri, masing-masing memiliki datanya, berkomunikasi lewat jaringan.' },
        fits: { en: 'Large, distributed organisations and parts with genuinely different scaling needs, backed by mature DevOps.', id: 'Organisasi besar dan terdistribusi serta bagian dengan kebutuhan penskalaan yang benar-benar berbeda, didukung DevOps matang.' },
        cost: { en: 'Distributed-systems complexity: network failure, eventual consistency, tracing, and heavy operational overhead — repeatedly the top reported pain.', id: 'Kompleksitas sistem terdistribusi: kegagalan jaringan, konsistensi eventual, penelusuran, dan beban operasional berat — berulang kali jadi keluhan teratas.' },
        deeper: { en: 'Benefits are real but conditional on organisational maturity. The classic failure is the "distributed monolith" — services that must deploy together, paying distribution’s cost for none of its benefit.', id: 'Manfaatnya nyata tetapi bergantung pada kematangan organisasi. Kegagalan klasiknya adalah "monolit terdistribusi" — layanan yang harus dideploy bersama, membayar biaya distribusi tanpa manfaatnya.' },
        cites: ['fowlerMicro', 'newman', 'dragoni', 'soldani', 'taibi', 'bognerQuality', 'taibiSmells'],
      },
      {
        optionId: 'serverless',
        name: 'Serverless (FaaS)',
        what: { en: 'Functions run on demand on managed infrastructure — scale-to-zero, pay-per-use.', id: 'Fungsi berjalan sesuai permintaan di infrastruktur terkelola — skala-ke-nol, bayar-per-pakai.' },
        fits: { en: 'Spiky or unpredictable load, event-driven glue, and small teams that would rather not run servers.', id: 'Beban bergelombang atau tak terduga, perekat berbasis peristiwa, dan tim kecil yang enggan mengelola server.' },
        cost: { en: 'Cold-start latency, execution limits, harder local testing/observability, and vendor lock-in; cost can invert at sustained high volume.', id: 'Latensi cold-start, batas eksekusi, pengujian/observabilitas lokal lebih sulit, dan keterikatan vendor; biaya bisa berbalik pada volume tinggi berkelanjutan.' },
        deeper: { en: 'Excellent for bursty, stateless work; a poor fit for long-running, latency-critical, or stateful workloads — state, latency, and portability are the open problems.', id: 'Sangat baik untuk kerja meledak-ledak tanpa keadaan; buruk untuk beban berjalan-lama, kritis-latensi, atau berkeadaan — keadaan, latensi, dan portabilitas adalah masalah terbukanya.' },
        cites: ['berkeleyServerless', 'baldini', 'castroServerless'],
      },
    ],
  },
  {
    dim: 'D2',
    intro: {
      en: 'How the parts talk. Synchronous styles trade simplicity for temporal coupling; asynchronous styles trade complexity for resilience and scale.',
      id: 'Bagaimana bagian-bagian berbicara. Gaya sinkron menukar kesederhanaan dengan kopling waktu; gaya asinkron menukar kompleksitas dengan ketahanan dan skala.',
    },
    entries: [
      {
        optionId: 'synchronous',
        name: 'Synchronous (request/response)',
        what: { en: 'The caller sends a request and waits for the reply.', id: 'Pemanggil mengirim permintaan dan menunggu balasan.' },
        fits: { en: 'When you truly need an immediate answer; simplest to reason about.', id: 'Saat Anda benar-benar butuh jawaban seketika; paling mudah dipahami.' },
        cost: { en: 'Strong temporal coupling — the caller shares the callee’s fate and latency.', id: 'Kopling waktu kuat — pemanggil ikut menanggung nasib dan latensi yang dipanggil.' },
        deeper: { en: 'Cascading failures and latency add up across a synchronous call chain; add timeouts, retries, and circuit breakers.', id: 'Kegagalan berantai dan latensi menumpuk sepanjang rantai panggilan sinkron; tambahkan timeout, coba-ulang, dan circuit breaker.' },
        cites: ['fundamentals', 'newman', 'eip'],
      },
      {
        optionId: 'async-messaging',
        name: 'Async messaging',
        what: { en: 'Producers and consumers exchange messages via a queue or broker.', id: 'Produsen dan konsumen bertukar pesan lewat antrean atau broker.' },
        fits: { en: 'Decoupling work in time, buffering load spikes, and improving resilience.', id: 'Melepas kopling kerja dalam waktu, menyangga lonjakan beban, dan meningkatkan ketahanan.' },
        cost: { en: 'Harder end-to-end reasoning and delivery semantics (at-least-once, idempotency).', id: 'Penalaran ujung-ke-ujung dan semantik pengiriman lebih sulit (setidaknya-sekali, idempotensi).' },
        deeper: { en: 'Enterprise Integration Patterns is the canonical catalogue for the routing, transformation, and guarantee patterns here.', id: 'Enterprise Integration Patterns adalah katalog kanonik untuk pola perutean, transformasi, dan jaminan di sini.' },
        cites: ['eip', 'ddia', 'richardson'],
      },
      {
        optionId: 'event-driven',
        name: 'Event-driven (pub/sub)',
        what: { en: 'Components publish facts; interested components react.', id: 'Komponen menerbitkan fakta; komponen yang berkepentingan bereaksi.' },
        fits: { en: 'High decoupling and extensibility — add a new reactor without touching producers.', id: 'Kopling rendah dan mudah diperluas — tambah reaktor baru tanpa menyentuh produsen.' },
        cost: { en: 'Weaker global ordering and consistency — you design for eventual consistency.', id: 'Pengurutan dan konsistensi global lebih lemah — Anda merancang untuk konsistensi eventual.' },
        deeper: { en: 'Great for extensibility, but debugging emergent flows across many reactors is hard; invest in tracing and event schemas.', id: 'Bagus untuk perluasan, tetapi men-debug alur yang muncul di banyak reaktor itu sulit; investasikan pada penelusuran dan skema peristiwa.' },
        cites: ['ddia', 'hardparts', 'eip'],
      },
      {
        optionId: 'streaming',
        name: 'Streaming',
        what: { en: 'Continuous, ordered flows of events (logs, telemetry, clickstreams).', id: 'Aliran peristiwa berkelanjutan dan terurut (log, telemetri, aliran-klik).' },
        fits: { en: 'High-throughput, real-time processing and replayable history.', id: 'Pemrosesan waktu-nyata bervolume tinggi dan riwayat yang dapat diputar ulang.' },
        cost: { en: 'Real operational weight: partitioning, backpressure, and reprocessing.', id: 'Beban operasional nyata: partisi, tekanan-balik, dan pemrosesan-ulang.' },
        deeper: { en: 'A log-centric backbone unifies messaging and stored history, but demands careful partitioning and consumer-offset management.', id: 'Tulang punggung berpusat-log menyatukan pesan dan riwayat tersimpan, tetapi menuntut partisi dan manajemen offset konsumen yang cermat.' },
        cites: ['ddia', 'akidauDataflow', 'eip'],
      },
    ],
  },
  {
    dim: 'D3',
    intro: {
      en: 'Where data lives and how it stays correct — the hardest decisions to reverse. Distribution multiplies the difficulty of consistency.',
      id: 'Di mana data tinggal dan bagaimana tetap benar — keputusan yang paling sulit dibalik. Distribusi melipatgandakan sulitnya konsistensi.',
    },
    entries: [
      {
        optionId: 'single-db',
        name: 'Single shared database',
        what: { en: 'One database that every part reads and writes.', id: 'Satu basis data yang dibaca dan ditulis semua bagian.' },
        fits: { en: 'Simplest operations and strong consistency via transactions.', id: 'Operasi paling sederhana dan konsistensi kuat lewat transaksi.' },
        cost: { en: 'Couples every writer and blocks independent scaling — an anti-pattern under microservices.', id: 'Mengopling semua penulis dan menghambat penskalaan independen — anti-pola di bawah microservices.' },
        deeper: { en: 'A shared database is the usual hidden cause of a "distributed monolith": it silently re-couples services you meant to separate.', id: 'Basis data bersama adalah penyebab tersembunyi lazim dari "monolit terdistribusi": diam-diam mengopling ulang layanan yang ingin Anda pisahkan.' },
        cites: ['newman', 'taibi', 'taibiSmells'],
      },
      {
        optionId: 'db-per-service',
        name: 'Database-per-service',
        what: { en: 'Each service owns its own store; no shared tables.', id: 'Tiap layanan memiliki penyimpanannya sendiri; tanpa tabel bersama.' },
        fits: { en: 'Independent deploy and scale, and true encapsulation of each service’s data.', id: 'Deploy dan skala independen, serta enkapsulasi sejati atas data tiap layanan.' },
        cost: { en: 'Cross-service consistency becomes an application concern (sagas, outbox), not a transaction.', id: 'Konsistensi lintas-layanan jadi urusan aplikasi (saga, outbox), bukan transaksi.' },
        deeper: { en: 'Replace distributed transactions with sagas and the transactional-outbox pattern; embrace eventual consistency deliberately.', id: 'Ganti transaksi terdistribusi dengan saga dan pola transactional-outbox; rangkul konsistensi eventual secara sengaja.' },
        cites: ['newman', 'ddia', 'richardson', 'laignerData', 'richardsonSaga'],
      },
      {
        optionId: 'cqrs',
        name: 'CQRS',
        what: { en: 'Separate models for writing (commands) and reading (queries).', id: 'Model terpisah untuk menulis (perintah) dan membaca (kueri).' },
        fits: { en: 'Read and write loads that differ sharply and need to scale or evolve independently.', id: 'Beban baca dan tulis yang berbeda tajam dan perlu diskalakan atau berkembang mandiri.' },
        cost: { en: 'More moving parts and (often) eventual consistency between the two models — use it selectively.', id: 'Lebih banyak bagian bergerak dan (kerap) konsistensi eventual antar kedua model — pakai secukupnya.' },
        deeper: { en: 'CQRS is frequently over-applied; add it to the specific slice that needs it, not the whole system.', id: 'CQRS kerap diterapkan berlebihan; tambahkan pada irisan spesifik yang membutuhkannya, bukan seluruh sistem.' },
        cites: ['cqrs', 'hardparts', 'richardson'],
      },
      {
        optionId: 'event-sourcing',
        name: 'Event Sourcing',
        what: { en: 'Store state as an append-only log of events, not as current rows.', id: 'Simpan keadaan sebagai log peristiwa hanya-tambah, bukan baris terkini.' },
        fits: { en: 'A full audit trail, temporal queries, and rebuilding state at any past point.', id: 'Jejak audit lengkap, kueri temporal, dan membangun ulang keadaan pada titik masa lalu mana pun.' },
        cost: { en: 'Complexity: event versioning, replay, and snapshotting; easy to over-apply.', id: 'Kompleksitas: versi peristiwa, pemutaran-ulang, dan snapshot; mudah diterapkan berlebihan.' },
        deeper: { en: 'Powerful where history is the domain (finance, audit); the schema-evolution and replay costs are underestimated far too often.', id: 'Ampuh di mana riwayat adalah domainnya (keuangan, audit); biaya evolusi skema dan pemutaran-ulang terlalu sering diremehkan.' },
        cites: ['eventsourcing', 'ddia', 'overeemES'],
      },
      {
        optionId: 'polyglot',
        name: 'Polyglot persistence',
        what: { en: 'Use the right store per job — relational, document, graph, search.', id: 'Pakai penyimpanan yang tepat per tugas — relasional, dokumen, graf, pencarian.' },
        fits: { en: 'Workloads with genuinely different access patterns under one system.', id: 'Beban kerja dengan pola akses yang benar-benar berbeda dalam satu sistem.' },
        cost: { en: 'More operational surfaces to run, secure, and understand.', id: 'Lebih banyak permukaan operasional untuk dijalankan, diamankan, dan dipahami.' },
        deeper: { en: 'Each data model has a sweet spot; the tax is the operational and cognitive load of running several stores well.', id: 'Tiap model data punya titik idealnya; pajaknya adalah beban operasional dan kognitif menjalankan beberapa penyimpanan dengan baik.' },
        cites: ['ddia', 'newman', 'laignerData'],
      },
    ],
  },
  {
    dim: 'D4',
    intro: {
      en: 'How each deployable is organised inside — independent of deployment, this governs testability and change cost.',
      id: 'Bagaimana tiap unit deploy tertata di dalam — terlepas dari cara deploy, ini menentukan keterujian dan biaya perubahan.',
    },
    entries: [
      {
        optionId: 'hexagonal',
        name: 'Hexagonal (Ports & Adapters)',
        what: { en: 'Isolate domain logic behind ports; adapters handle IO and frameworks.', id: 'Isolasi logika domain di balik port; adapter menangani IO dan framework.' },
        fits: { en: 'A highly testable, framework-agnostic core you can drive from tests or any UI.', id: 'Inti yang sangat teruji dan bebas-framework yang bisa dijalankan dari tes atau UI apa pun.' },
        cost: { en: 'More indirection and boilerplate up front.', id: 'Lebih banyak tak-langsung dan boilerplate di awal.' },
        deeper: { en: 'Business rules never depend on IO or frameworks, which is exactly what keeps the core durable and unit-testable.', id: 'Aturan bisnis tak pernah bergantung pada IO atau framework, yang justru menjaga inti tetap awet dan dapat diuji-unit.' },
        cites: ['hexagonal', 'clean', 'ddd'],
      },
      {
        optionId: 'clean',
        name: 'Clean Architecture',
        what: { en: 'Concentric layers with the dependency rule pointing inward to the domain.', id: 'Lapisan konsentris dengan aturan dependensi mengarah ke dalam menuju domain.' },
        fits: { en: 'Long-lived systems that must stay independent of frameworks and delivery mechanisms.', id: 'Sistem berumur panjang yang harus tetap independen dari framework dan mekanisme pengiriman.' },
        cost: { en: 'The most prescriptive of the structures — ceremony can outweigh benefit on small apps.', id: 'Struktur paling preskriptif — seremoninya bisa melebihi manfaat pada aplikasi kecil.' },
        deeper: { en: 'Same intent as hexagonal, more prescriptive; DDD supplies the bounded contexts these inner layers protect.', id: 'Niat sama dengan hexagonal, lebih preskriptif; DDD menyediakan bounded context yang dilindungi lapisan-dalam ini.' },
        cites: ['clean', 'ddd', 'implddd', 'hexagonal'],
      },
      {
        optionId: 'vertical-slice',
        name: 'Vertical Slice',
        what: { en: 'Organise by feature rather than by technical layer.', id: 'Tata berdasarkan fitur, bukan lapisan teknis.' },
        fits: { en: 'High change locality — a feature lives in one place, cutting cross-layer coupling.', id: 'Lokalitas perubahan tinggi — satu fitur di satu tempat, memangkas kopling lintas-lapisan.' },
        cost: { en: 'Less shared structure; needs conventions to avoid duplication drifting apart.', id: 'Struktur bersama lebih sedikit; butuh konvensi agar duplikasi tak menyimpang.' },
        deeper: { en: 'Optimises for the way software actually changes (by feature), the mirror image of layered’s weakness.', id: 'Mengoptimalkan cara perangkat lunak benar-benar berubah (per fitur), kebalikan dari kelemahan berlapis.' },
        cites: ['fundamentals', 'bogardVSlice', 'hardparts'],
      },
      {
        optionId: 'layered',
        name: 'Layered',
        what: { en: 'Classic top-to-bottom technical layers.', id: 'Lapisan teknis atas-ke-bawah yang klasik.' },
        fits: { en: 'Quick, familiar, and fine for smaller or stable domains.', id: 'Cepat, akrab, dan memadai untuk domain kecil atau stabil.' },
        cost: { en: 'Can tangle as the domain grows (see Deployment · Layered).', id: 'Bisa kusut saat domain tumbuh (lihat Deploy · Berlapis).' },
        deeper: { en: 'Familiar and low-friction, but a feature change tends to ripple across every layer.', id: 'Akrab dan minim-friksi, tetapi perubahan fitur cenderung merambat ke semua lapisan.' },
        cites: ['peaa', 'fundamentals', 'bass'],
      },
    ],
  },
  {
    dim: 'D5',
    intro: {
      en: 'How the UI is built and delivered — trading first-paint and SEO against interactivity and team autonomy.',
      id: 'Bagaimana UI dibangun dan disajikan — menukar render-pertama dan SEO dengan interaktivitas dan otonomi tim.',
    },
    entries: [
      {
        optionId: 'micro-frontends',
        name: 'Micro-frontends',
        what: { en: 'Independently deployable UI pieces owned by different teams.', id: 'Potongan UI yang dapat dideploy mandiri, dimiliki tim berbeda.' },
        fits: { en: 'Large organisations that need UI team autonomy across one product.', id: 'Organisasi besar yang butuh otonomi tim UI di satu produk.' },
        cost: { en: 'Browser weight and real effort to keep look, feel, and shared state consistent.', id: 'Bobot peramban dan usaha nyata menjaga tampilan, rasa, dan keadaan bersama tetap konsisten.' },
        deeper: { en: 'Buys team independence you only need past a certain organisational size; below it, the overhead dominates.', id: 'Membeli independensi tim yang baru Anda butuhkan di atas ukuran organisasi tertentu; di bawahnya, bebannya mendominasi.' },
        cites: ['microfrontends', 'fundamentals', 'conwayTeams'],
      },
      {
        optionId: 'spa',
        name: 'Single-page app (SPA)',
        what: { en: 'One rich client app that updates the page without full reloads.', id: 'Satu aplikasi klien kaya yang memperbarui halaman tanpa muat-ulang penuh.' },
        fits: { en: 'Highly interactive experiences shipped as one deployable.', id: 'Pengalaman sangat interaktif yang dikirim sebagai satu unit deploy.' },
        cost: { en: 'Weaker first paint and SEO unless mitigated (this very app is an SPA).', id: 'Render-pertama dan SEO lebih lemah kecuali dimitigasi (aplikasi ini sendiri adalah SPA).' },
        deeper: { en: 'Wins on rich interactivity; pair with code-splitting and prefetch to soften the first-load cost.', id: 'Unggul pada interaktivitas kaya; pasangkan dengan pemecahan-kode dan prefetch untuk melunakkan biaya muat-pertama.' },
        cites: ['webvitals', 'renderingWeb', 'mikowskiSPA'],
      },
      {
        optionId: 'ssr',
        name: 'Server-rendered (SSR/SSG)',
        what: { en: 'Render on the server, or at build time, before it reaches the browser.', id: 'Render di server, atau saat build, sebelum sampai ke peramban.' },
        fits: { en: 'Fast first paint and strong SEO — content and marketing sites especially.', id: 'Render-pertama cepat dan SEO kuat — terutama situs konten dan pemasaran.' },
        cost: { en: 'SSR adds runtime cost and complexity; prefer static/incremental rendering where you can.', id: 'SSR menambah biaya dan kompleksitas runtime; utamakan render statis/inkremental bila bisa.' },
        deeper: { en: 'The trade-off tracks Core Web Vitals: SSR/SSG win first-contentful-paint and SEO; SPAs win rich interactivity.', id: 'Trade-off-nya mengikuti Core Web Vitals: SSR/SSG menang di first-contentful-paint dan SEO; SPA menang di interaktivitas kaya.' },
        cites: ['webvitals', 'fundamentals', 'renderingWeb'],
      },
    ],
  },
];

// Bibliography — recognised standards, seminal books, and peer-reviewed / widely-cited works.
export const READER_CITATIONS: Record<string, ReaderCitation> = {
  iso25010: { key: 'iso25010', label: 'ISO/IEC 25010:2023', note: { en: 'SQuaRE product-quality model.', id: 'Model kualitas produk SQuaRE.' }, url: 'https://www.iso.org/standard/78176.html' },
  bass: { key: 'bass', label: 'Bass, Clements & Kazman — Software Architecture in Practice, 4e (2021)', note: { en: 'The SEI reference on architecture and quality attributes.', id: 'Rujukan SEI tentang arsitektur dan atribut kualitas.' } },
  fundamentals: { key: 'fundamentals', label: 'Richards & Ford — Fundamentals of Software Architecture (2020)', note: { en: 'Modern styles, trade-offs, and change locality.', id: 'Gaya modern, trade-off, dan lokalitas perubahan.' } },
  hardparts: { key: 'hardparts', label: 'Ford, Richards, Sadalage & Dehghani — Software Architecture: The Hard Parts (2021)', note: { en: 'Distributed trade-off analysis.', id: 'Analisis trade-off terdistribusi.' } },
  newman: { key: 'newman', label: 'Newman — Building Microservices, 2e (2021)', note: { en: 'The practical reference on services and their data.', id: 'Rujukan praktis tentang layanan dan datanya.' } },
  fowlerMicro: { key: 'fowlerMicro', label: 'Lewis & Fowler — "Microservices" (2014)', note: { en: 'The defining article.', id: 'Artikel yang mendefinisikan.' }, url: 'https://martinfowler.com/articles/microservices.html' },
  fowlerMonolithFirst: { key: 'fowlerMonolithFirst', label: 'Fowler — "MonolithFirst" (2015)', note: { en: 'Start monolithic; extract when boundaries are proven.', id: 'Mulai monolitik; ekstrak saat batas terbukti.' }, url: 'https://martinfowler.com/bliki/MonolithFirst.html' },
  strangler: { key: 'strangler', label: 'Fowler — "StranglerFigApplication" (2004)', note: { en: 'Incremental extraction from a monolith.', id: 'Ekstraksi inkremental dari monolit.' }, url: 'https://martinfowler.com/bliki/StranglerFigApplication.html' },
  ddia: { key: 'ddia', label: 'Kleppmann — Designing Data-Intensive Applications (2017)', note: { en: 'Replication, partitioning, and consistency.', id: 'Replikasi, partisi, dan konsistensi.' } },
  evoarch: { key: 'evoarch', label: 'Ford, Parsons & Kua — Building Evolutionary Architectures, 2e (2022)', note: { en: 'Fitness functions guard qualities over time.', id: 'Fitness function menjaga kualitas dari waktu ke waktu.' }, url: 'https://evolutionaryarchitecture.com/' },
  ddd: { key: 'ddd', label: 'Evans — Domain-Driven Design (2003)', note: { en: 'Bounded contexts and the ubiquitous language.', id: 'Bounded context dan bahasa ubikuitos.' } },
  implddd: { key: 'implddd', label: 'Vernon — Implementing Domain-Driven Design (2013)', note: { en: 'Applying DDD in practice.', id: 'Menerapkan DDD dalam praktik.' } },
  clean: { key: 'clean', label: 'Martin — Clean Architecture (2017)', note: { en: 'The dependency rule.', id: 'Aturan dependensi.' } },
  hexagonal: { key: 'hexagonal', label: 'Cockburn — "Hexagonal Architecture" (2005)', note: { en: 'Ports & adapters.', id: 'Port & adapter.' }, url: 'https://alistair.cockburn.us/hexagonal-architecture/' },
  eip: { key: 'eip', label: 'Hohpe & Woolf — Enterprise Integration Patterns (2003)', note: { en: 'The messaging-pattern catalogue.', id: 'Katalog pola pesan.' } },
  peaa: { key: 'peaa', label: 'Fowler — Patterns of Enterprise Application Architecture (2002)', note: { en: 'Layering and enterprise patterns.', id: 'Pelapisan dan pola enterprise.' } },
  cqrs: { key: 'cqrs', label: 'Fowler — "CQRS" (2011)', note: { en: 'Separate read and write models.', id: 'Pisahkan model baca dan tulis.' }, url: 'https://martinfowler.com/bliki/CQRS.html' },
  eventsourcing: { key: 'eventsourcing', label: 'Fowler — "Event Sourcing" (2005)', note: { en: 'State as an event log.', id: 'Keadaan sebagai log peristiwa.' }, url: 'https://martinfowler.com/eaaDev/EventSourcing.html' },
  atam: { key: 'atam', label: 'Kazman, Klein & Clements — ATAM (SEI, 2000)', note: { en: 'Architecture trade-off evaluation.', id: 'Evaluasi trade-off arsitektur.' }, url: 'https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/' },
  add: { key: 'add', label: 'Wojcik et al. — Attribute-Driven Design v2.0 (SEI, 2006)', note: { en: 'Quality-attribute-driven design.', id: 'Desain digerakkan atribut kualitas.' }, url: 'https://insights.sei.cmu.edu/library/attribute-driven-design-add-version-20/' },
  mavt: { key: 'mavt', label: 'Keeney & Raiffa — Decisions with Multiple Objectives (1993)', note: { en: 'The additive weighted-value model.', id: 'Model nilai-tertimbang aditif.' }, url: 'https://doi.org/10.1017/CBO9781139174084' },
  dragoni: { key: 'dragoni', label: 'Dragoni et al. — "Microservices: Yesterday, Today, and Tomorrow" (Springer, 2017)', note: { en: 'A widely-cited survey.', id: 'Survei yang banyak dikutip.' }, url: 'https://doi.org/10.1007/978-3-319-67425-4_12' },
  soldani: { key: 'soldani', label: 'Soldani et al. — "The pains and gains of microservices" (JSS, 2018)', note: { en: 'Systematic review of real-world costs.', id: 'Tinjauan sistematis biaya dunia nyata.' }, url: 'https://doi.org/10.1016/j.jss.2018.09.082' },
  taibi: { key: 'taibi', label: 'Taibi, Lenarduzzi & Pahl — "Architectural Patterns for Microservices" (CLOSER, 2018)', note: { en: 'Patterns and anti-patterns, evidence-based.', id: 'Pola dan anti-pola, berbasis bukti.' }, url: 'https://doi.org/10.5220/0006798302210232' },
  berkeleyServerless: { key: 'berkeleyServerless', label: 'Jonas et al. — "A Berkeley View on Serverless Computing" (2019)', note: { en: 'Serverless trends and open problems.', id: 'Tren serverless dan masalah terbuka.' }, url: 'https://arxiv.org/abs/1902.03383' },
  baldini: { key: 'baldini', label: 'Baldini et al. — "Serverless Computing: Current Trends and Open Problems" (Springer, 2017)', note: { en: 'Foundational serverless survey.', id: 'Survei serverless fondasional.' }, url: 'https://doi.org/10.1007/978-981-10-5026-8_1' },
  microfrontends: { key: 'microfrontends', label: 'Geers — Micro Frontends in Action (2020); Jackson — "Micro Frontends" (2019)', note: { en: 'The reference on UI composition by team.', id: 'Rujukan komposisi UI per tim.' }, url: 'https://martinfowler.com/articles/micro-frontends.html' },
  webvitals: { key: 'webvitals', label: 'Google — Web Vitals (web.dev)', note: { en: 'User-centric performance metrics.', id: 'Metrik performa berpusat-pengguna.' }, url: 'https://web.dev/articles/vitals' },

  // Additional peer-reviewed / practitioner references, so each architecture carries several branches.
  richardson: { key: 'richardson', label: 'Richardson — Microservices Patterns (Manning, 2018)', note: { en: 'Saga, database-per-service, API composition, CQRS in practice.', id: 'Saga, database-per-service, komposisi API, CQRS dalam praktik.' }, url: 'https://www.manning.com/books/microservices-patterns' },
  fritzschMigration: { key: 'fritzschMigration', label: 'Fritzsch et al. — "From Monolith to Microservices: A Classification of Refactoring Approaches" (2019)', note: { en: 'Evidence-based migration strategies.', id: 'Strategi migrasi berbasis bukti.' }, url: 'https://doi.org/10.1007/978-3-030-06019-0_10' },
  bognerQuality: { key: 'bognerQuality', label: 'Bogner et al. — "Microservices in Industry: Insights into Technologies, Characteristics, and Software Quality" (IEEE ICSA-C, 2019)', note: { en: 'How microservices affect maintainability in practice.', id: 'Dampak microservices pada maintainability di praktik.' }, url: 'https://doi.org/10.1109/ICSA-C.2019.00041' },
  taibiSmells: { key: 'taibiSmells', label: 'Taibi & Lenarduzzi — "On the Definition of Microservice Bad Smells" (IEEE Software, 2018)', note: { en: 'Named anti-patterns incl. the distributed monolith.', id: 'Anti-pola bernama termasuk distributed monolith.' }, url: 'https://doi.org/10.1109/MS.2018.2141031' },
  richardsonSaga: { key: 'richardsonSaga', label: 'Richardson — "Pattern: Saga" (microservices.io)', note: { en: 'Cross-service consistency without distributed transactions.', id: 'Konsistensi lintas-layanan tanpa transaksi terdistribusi.' }, url: 'https://microservices.io/patterns/data/saga.html' },
  laignerData: { key: 'laignerData', label: 'Laigner et al. — "Data Management in Microservices: State of the Practice, Challenges, and Research Directions" (VLDB, 2021)', note: { en: 'Empirical study of per-service data.', id: 'Studi empiris data per-layanan.' }, url: 'https://doi.org/10.14778/3484224.3484232' },
  overeemES: { key: 'overeemES', label: 'Overeem, Spoor & Jansen — "The dark side of event sourcing: Managing data conversion" (IEEE SANER, 2017)', note: { en: 'The real costs of event schema evolution.', id: 'Biaya nyata evolusi skema peristiwa.' }, url: 'https://doi.org/10.1109/SANER.2017.7884621' },
  akidauDataflow: { key: 'akidauDataflow', label: 'Akidau et al. — "The Dataflow Model" (Proc. VLDB, 2015)', note: { en: 'Foundations of unbounded, out-of-order stream processing.', id: 'Fondasi pemrosesan aliran tak-terbatas dan tak-berurutan.' }, url: 'https://doi.org/10.14778/2824032.2824076' },
  castroServerless: { key: 'castroServerless', label: 'Castro et al. — "The rise of serverless computing" (Communications of the ACM, 2019)', note: { en: 'A balanced survey of serverless.', id: 'Survei serverless yang seimbang.' }, url: 'https://doi.org/10.1145/3368454' },
  bogardVSlice: { key: 'bogardVSlice', label: 'Bogard — "Vertical Slice Architecture" (2018)', note: { en: 'Organise by feature, not layer.', id: 'Tata per fitur, bukan lapisan.' }, url: 'https://www.jimmybogard.com/vertical-slice-architecture/' },
  renderingWeb: { key: 'renderingWeb', label: 'Miller & Osmani — "Rendering on the Web" (web.dev, Google)', note: { en: 'CSR vs SSR vs SSG trade-offs.', id: 'Trade-off CSR vs SSR vs SSG.' }, url: 'https://web.dev/articles/rendering-on-the-web' },
  mikowskiSPA: { key: 'mikowskiSPA', label: 'Mikowski & Powell — Single Page Web Applications (Manning, 2013)', note: { en: 'The SPA model end to end.', id: 'Model SPA dari hulu ke hilir.' }, url: 'https://www.manning.com/books/single-page-web-applications' },
  conwayTeams: { key: 'conwayTeams', label: 'Skelton & Pais — Team Topologies (2019)', note: { en: 'Conway’s Law: boundaries follow teams.', id: 'Hukum Conway: batas mengikuti tim.' }, url: 'https://teamtopologies.com/book' },
};
