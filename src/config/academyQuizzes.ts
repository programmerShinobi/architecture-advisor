import type { Bilingual, DimensionId } from '../types';

// The "Academy" Insights section: course modules with self-check quizzes. Bilingual EN/ID (rendered
// via tr()). Every question is grounded in the model and the existing Insights content — each carries
// a `review` pointer to the page that teaches the answer, so a wrong answer becomes a reading step.
// Client-side only: answers are scored locally, nothing is sent anywhere.

const b = (en: string, id: string): Bilingual => ({ en, id });

export type QuizRef =
  | { kind: 'arch'; dim: DimensionId; optionId: string; lens: 'catalog' | 'playbook' | 'review' | 'library' }
  | { kind: 'article'; slug: string };

export interface QuizQuestion {
  q: Bilingual;
  choices: Bilingual[];
  /** Index into `choices`. */
  answer: number;
  explain: Bilingual;
  review: QuizRef;
}

export interface QuizModule {
  id: string;
  title: Bilingual;
  description: Bilingual;
  questions: QuizQuestion[];
}

export const ACADEMY_QUIZZES: QuizModule[] = [
  {
    id: 'd1-deployment',
    title: b('D1 · Deployment & composition', 'D1 · Deployment & komposisi'),
    description: b(
      'Monolith, modular monolith, microservices, serverless — when each one earns its keep.',
      'Monolith, modular monolith, microservices, serverless — kapan masing-masing sepadan dengan biayanya.',
    ),
    questions: [
      {
        q: b(
          'For a new product with a small team and an unproven domain, the evidence-backed default is…',
          'Untuk produk baru dengan tim kecil dan domain yang belum terbukti, default yang didukung bukti adalah…',
        ),
        choices: [
          b('Microservices from day one', 'Microservices sejak hari pertama'),
          b('A monolith (or modular monolith)', 'Monolith (atau modular monolith)'),
          b('Serverless for everything', 'Serverless untuk segalanya'),
          b('One service per developer', 'Satu layanan per pengembang'),
        ],
        answer: 1,
        explain: b(
          'Fowler\'s "MonolithFirst" and Newman both advise proving the product and its boundaries before paying distribution\'s permanent costs.',
          '"MonolithFirst" dari Fowler dan Newman sama-sama menyarankan membuktikan produk dan batasnya sebelum membayar biaya permanen distribusi.',
        ),
        review: { kind: 'arch', dim: 'D1', optionId: 'monolith', lens: 'catalog' },
      },
      {
        q: b(
          'A layered deployment style is quick and familiar — its classic long-term risk is…',
          'Gaya deployment berlapis itu cepat dan familiar — risiko jangka-panjang klasiknya adalah…',
        ),
        choices: [
          b('Too much network latency', 'Terlalu banyak latensi jaringan'),
          b('Eroding into a "big ball of mud" as the domain grows', 'Terkikis menjadi "big ball of mud" saat domain tumbuh'),
          b('It cannot use a database', 'Ia tak bisa memakai basis data'),
          b('It requires many teams', 'Ia membutuhkan banyak tim'),
        ],
        answer: 1,
        explain: b(
          'Without enforced boundaries, technical layers tangle as the domain grows — the erosion the Catalog and Review pages price in.',
          'Tanpa batas yang ditegakkan, lapisan teknis kusut saat domain tumbuh — erosi yang diperhitungkan halaman Catalog dan Review.',
        ),
        review: { kind: 'arch', dim: 'D1', optionId: 'layered', lens: 'review' },
      },
      {
        q: b(
          'What primarily separates a modular monolith from a plain monolith?',
          'Apa yang terutama membedakan modular monolith dari monolith biasa?',
        ),
        choices: [
          b('It runs in multiple processes', 'Ia berjalan dalam banyak proses'),
          b('CI-enforced module boundaries inside one deployable', 'Batas modul yang ditegakkan CI di dalam satu deployable'),
          b('It requires Kubernetes', 'Ia membutuhkan Kubernetes'),
          b('Each module has its own database', 'Tiap modul punya basis datanya sendiri'),
        ],
        answer: 1,
        explain: b(
          'A modular monolith stays one process and one deploy, but module boundaries (per bounded context) are explicit and enforced — the cheap stepping stone to extraction.',
          'Modular monolith tetap satu proses dan satu deploy, tapi batas modul (per bounded context) eksplisit dan ditegakkan — batu loncatan murah menuju ekstraksi.',
        ),
        review: { kind: 'arch', dim: 'D1', optionId: 'modular-monolith', lens: 'catalog' },
      },
      {
        q: b('The Strangler Fig pattern says to…', 'Pola Strangler Fig menyarankan untuk…'),
        choices: [
          b('Rewrite the system in one release', 'Menulis ulang sistem dalam satu rilis'),
          b('Freeze the monolith and build v2 beside it', 'Membekukan monolith dan membangun v2 di sampingnya'),
          b('Extract one capability at a time behind a facade, always able to roll back', 'Mengekstrak satu kapabilitas dalam satu waktu di balik facade, selalu bisa dibatalkan'),
          b('Split every layer into its own service', 'Memecah tiap lapisan menjadi layanannya sendiri'),
        ],
        answer: 2,
        explain: b(
          'Traffic is routed through a facade and capabilities move one by one — value ships early and each step is reversible, unlike a big-bang rewrite.',
          'Trafik diarahkan lewat facade dan kapabilitas berpindah satu per satu — nilai terkirim lebih awal dan tiap langkah dapat dibatalkan, tak seperti penulisan-ulang big-bang.',
        ),
        review: { kind: 'article', slug: 'strangler-fig-migration' },
      },
      {
        q: b('Which workload profile fits serverless (FaaS) best?', 'Profil beban kerja mana yang paling cocok dengan serverless (FaaS)?'),
        choices: [
          b('Steady, latency-critical, stateful', 'Mantap, kritis-latensi, stateful'),
          b('Spiky and event-driven, tolerant of cold starts', 'Berlonjak dan event-driven, toleran terhadap cold start'),
          b('Long-running batch jobs with huge in-memory state', 'Pekerjaan batch berjalan-lama dengan state di-memori yang besar'),
          b('Anything with a database', 'Apa pun yang punya basis data'),
        ],
        answer: 1,
        explain: b(
          'Scale-to-zero pays off for bursty, event-driven work; cold starts, execution limits, and statelessness make it a poor fit for latency-critical stateful cores.',
          'Scale-to-zero menguntungkan untuk kerja berlonjak dan event-driven; cold start, batasan eksekusi, dan sifat stateless membuatnya kurang cocok untuk inti stateful kritis-latensi.',
        ),
        review: { kind: 'arch', dim: 'D1', optionId: 'serverless', lens: 'review' },
      },
      {
        q: b('A "distributed monolith" is a system where…', 'Sebuah "distributed monolith" adalah sistem di mana…'),
        choices: [
          b('One team owns all services', 'Satu tim memiliki semua layanan'),
          b('Services are split but still must deploy together (often via a shared database)', 'Layanan dipecah tapi tetap harus di-deploy bersama (sering lewat basis data bersama)'),
          b('The monolith runs on many servers', 'Monolith berjalan di banyak server'),
          b('Events replace all HTTP calls', 'Event menggantikan semua panggilan HTTP'),
        ],
        answer: 1,
        explain: b(
          'You pay all the costs of distribution (network, ops, eventual consistency) with none of the independence — the top microservice anti-pattern in the literature.',
          'Kamu membayar semua biaya distribusi (jaringan, ops, konsistensi eventual) tanpa kemandiriannya — anti-pattern microservice teratas dalam literatur.',
        ),
        review: { kind: 'arch', dim: 'D1', optionId: 'microservices', lens: 'review' },
      },
    ],
  },
  {
    id: 'd2-communication',
    title: b('D2 · Communication style', 'D2 · Gaya komunikasi'),
    description: b(
      'Request–response, messaging, events, streaming — coupling, resilience, and consistency.',
      'Request–response, messaging, event, streaming — kopling, ketahanan, dan konsistensi.',
    ),
    questions: [
      {
        q: b(
          'The core question when choosing between sync and async communication is…',
          'Pertanyaan inti saat memilih antara komunikasi sinkron dan asinkron adalah…',
        ),
        choices: [
          b('Which protocol is fastest', 'Protokol mana yang tercepat'),
          b('Whether the caller must wait for an answer right now', 'Apakah pemanggil harus menunggu jawaban sekarang juga'),
          b('Whether you use JSON or protobuf', 'Apakah kamu memakai JSON atau protobuf'),
          b('How many services you have', 'Berapa banyak layanan yang kamu miliki'),
        ],
        answer: 1,
        explain: b(
          'If the caller needs the answer to continue, request–response fits; if notifying is enough, async styles buy resilience and decoupling.',
          'Jika pemanggil butuh jawaban untuk melanjutkan, request–response cocok; jika sekadar memberi tahu sudah cukup, gaya asinkron membeli ketahanan dan pemisahan.',
        ),
        review: { kind: 'article', slug: 'choosing-communication-style' },
      },
      {
        q: b('Synchronous call chains are risky at scale because…', 'Rantai panggilan sinkron berisiko pada skala besar karena…'),
        choices: [
          b('HTTP is deprecated', 'HTTP sudah usang'),
          b('Latency and failures accumulate along the chain (temporal coupling)', 'Latensi dan kegagalan menumpuk di sepanjang rantai (kopling temporal)'),
          b('They cannot cross data centers', 'Ia tak bisa melintasi pusat data'),
          b('They require an API gateway', 'Ia membutuhkan API gateway'),
        ],
        answer: 1,
        explain: b(
          'Every hop adds latency and a failure mode; timeouts, idempotent retries, and circuit breakers are the standard mitigations.',
          'Setiap hop menambah latensi dan satu mode kegagalan; timeout, retry idempoten, dan circuit breaker adalah mitigasi standarnya.',
        ),
        review: { kind: 'arch', dim: 'D2', optionId: 'synchronous', lens: 'review' },
      },
      {
        q: b('Event-driven architecture shines when…', 'Arsitektur event-driven bersinar saat…'),
        choices: [
          b('Exactly one consumer needs a reply immediately', 'Tepat satu konsumer butuh balasan seketika'),
          b('Many consumers react to the same fact and the system must be easy to extend', 'Banyak konsumer bereaksi terhadap fakta yang sama dan sistem harus mudah diperluas'),
          b('You need strong global transactions', 'Kamu butuh transaksi global yang kuat'),
          b('The team is brand new to distributed systems', 'Tim benar-benar baru terhadap sistem terdistribusi'),
        ],
        answer: 1,
        explain: b(
          'Publishing "this happened" decouples producers from an open-ended set of consumers — extensibility is the headline benefit.',
          'Memublikasikan "ini telah terjadi" memisahkan produser dari himpunan konsumer yang terbuka — kemudahan perluasan adalah manfaat utamanya.',
        ),
        review: { kind: 'arch', dim: 'D2', optionId: 'event-driven', lens: 'catalog' },
      },
      {
        q: b('Because message delivery is usually at-least-once, consumers must be…', 'Karena pengiriman pesan biasanya at-least-once, konsumer harus…'),
        choices: [
          b('Stateless', 'Stateless'),
          b('Idempotent (safe to process the same message twice)', 'Idempoten (aman memproses pesan yang sama dua kali)'),
          b('Synchronous', 'Sinkron'),
          b('Single-threaded', 'Single-thread'),
        ],
        answer: 1,
        explain: b(
          'Duplicates will happen; processing must converge to the same result — the foundational rule of messaging.',
          'Duplikat akan terjadi; pemrosesan harus menyatu ke hasil yang sama — aturan fundamental messaging.',
        ),
        review: { kind: 'arch', dim: 'D2', optionId: 'async-messaging', lens: 'playbook' },
      },
      {
        q: b('Streaming (e.g. a log like Kafka) is the right D2 pick when…', 'Streaming (mis. log seperti Kafka) adalah pilihan D2 yang tepat saat…'),
        choices: [
          b('You need one nightly batch job', 'Kamu butuh satu pekerjaan batch malam'),
          b('Data flows continuously and consumers replay or process it in near real time', 'Data mengalir kontinu dan konsumer memutar-ulang atau memprosesnya mendekati real time'),
          b('Requests must block until processed', 'Permintaan harus menunggu sampai diproses'),
          b('The payloads are tiny', 'Muatannya sangat kecil'),
        ],
        answer: 1,
        explain: b(
          'A durable, replayable stream fits telemetry, analytics pipelines, and event backbones — continuous flows, not request/reply.',
          'Stream yang tahan lama dan dapat diputar-ulang cocok untuk telemetri, pipeline analitik, dan tulang punggung event — aliran kontinu, bukan request/reply.',
        ),
        review: { kind: 'arch', dim: 'D2', optionId: 'streaming', lens: 'catalog' },
      },
    ],
  },
  {
    id: 'd3-data',
    title: b('D3 · Data management', 'D3 · Manajemen data'),
    description: b(
      'The hardest decision to reverse: ownership, consistency, and the patterns that keep it correct.',
      'Keputusan yang paling sulit dibatalkan: kepemilikan, konsistensi, dan pola yang menjaganya tetap benar.',
    ),
    questions: [
      {
        q: b('Why does the guidance say "split data only when you truly must"?', 'Mengapa panduannya berkata "pecah data hanya saat benar-benar harus"?'),
        choices: [
          b('Databases are expensive to license', 'Basis data mahal untuk dilisensi'),
          b('Data ownership is the hardest architectural decision to reverse', 'Kepemilikan data adalah keputusan arsitektur yang paling sulit dibatalkan'),
          b('SQL is faster than NoSQL', 'SQL lebih cepat dari NoSQL'),
          b('Backups become impossible', 'Backup menjadi mustahil'),
        ],
        answer: 1,
        explain: b(
          'Frameworks are swappable; how data is owned and kept consistent is not — splitting trades free transactions for application-managed consistency.',
          'Framework dapat diganti; cara data dimiliki dan dijaga konsisten tidak — memecah menukar transaksi gratis dengan konsistensi yang dikelola aplikasi.',
        ),
        review: { kind: 'arch', dim: 'D3', optionId: 'single-db', lens: 'catalog' },
      },
      {
        q: b('Once each service owns its database, cross-service "transactions" are handled by…', 'Begitu tiap layanan memiliki basis datanya, "transaksi" lintas-layanan ditangani oleh…'),
        choices: [
          b('Two-phase commit everywhere', 'Two-phase commit di mana-mana'),
          b('Sagas with compensating steps', 'Saga dengan langkah kompensasi'),
          b('Locking all databases', 'Mengunci semua basis data'),
          b('Retrying until it works', 'Me-retry sampai berhasil'),
        ],
        answer: 1,
        explain: b(
          'A saga coordinates local steps and undoes completed ones on failure — the standard replacement for distributed transactions.',
          'Saga mengoordinasikan langkah lokal dan membatalkan yang sudah selesai saat gagal — pengganti standar untuk transaksi terdistribusi.',
        ),
        review: { kind: 'arch', dim: 'D3', optionId: 'db-per-service', lens: 'review' },
      },
      {
        q: b('Polyglot persistence means…', 'Polyglot persistence berarti…'),
        choices: [
          b('Translating the schema into many languages', 'Menerjemahkan skema ke banyak bahasa'),
          b('Using the right kind of database per access pattern — accepting the operational cost', 'Memakai jenis basis data yang tepat per pola akses — menerima biaya operasionalnya'),
          b('One database vendor for everything', 'Satu vendor basis data untuk segalanya'),
          b('Storing data in JSON only', 'Menyimpan data hanya dalam JSON'),
        ],
        answer: 1,
        explain: b(
          'Sharply divergent access patterns can justify different stores (document, graph, key-value) — but every extra engine is a permanent operational bill.',
          'Pola akses yang sangat berbeda bisa membenarkan penyimpanan berbeda (dokumen, graph, key-value) — tapi tiap mesin tambahan adalah tagihan operasional permanen.',
        ),
        review: { kind: 'arch', dim: 'D3', optionId: 'polyglot', lens: 'catalog' },
      },
      {
        q: b('The transactional outbox pattern exists so that…', 'Pola transactional outbox ada agar…'),
        choices: [
          b('Events are prettier', 'Event terlihat lebih cantik'),
          b('"Save data" and "publish the event" can never drift apart', '"Simpan data" dan "publikasikan event" tak pernah bisa menyimpang'),
          b('Databases stay small', 'Basis data tetap kecil'),
          b('Consumers can skip idempotency', 'Konsumer bisa melewati idempotensi'),
        ],
        answer: 1,
        explain: b(
          'The event is written in the same local transaction as the data and relayed afterwards — no more "saved but never announced" bugs.',
          'Event ditulis dalam transaksi lokal yang sama dengan data dan diteruskan setelahnya — tak ada lagi bug "tersimpan tapi tak pernah diumumkan".',
        ),
        review: { kind: 'article', slug: 'data-consistency-review' },
      },
      {
        q: b('CQRS is best applied…', 'CQRS paling baik diterapkan…'),
        choices: [
          b('To every service, always', 'Ke tiap layanan, selalu'),
          b('Selectively, on slices where read and write models differ sharply', 'Secara selektif, pada irisan di mana model baca dan tulis berbeda tajam'),
          b('Only with event sourcing', 'Hanya dengan event sourcing'),
          b('When the team is bored', 'Saat tim bosan'),
        ],
        answer: 1,
        explain: b(
          'CQRS (and event sourcing) are commonly over-applied; the literature says use them on the parts whose load or shape truly demands it.',
          'CQRS (dan event sourcing) umum diterapkan berlebihan; literatur menyarankan memakainya pada bagian yang beban atau bentuknya benar-benar menuntutnya.',
        ),
        review: { kind: 'arch', dim: 'D3', optionId: 'cqrs', lens: 'review' },
      },
      {
        q: b('Event sourcing stores…', 'Event sourcing menyimpan…'),
        choices: [
          b('The latest row per entity', 'Baris terbaru per entity'),
          b('The full history of changes as an append-only list of events', 'Seluruh riwayat perubahan sebagai daftar event yang hanya-tambah'),
          b('Snapshots only', 'Hanya snapshot'),
          b('CSV exports', 'Ekspor CSV'),
        ],
        answer: 1,
        explain: b(
          'State is derived by replaying events — a complete audit trail, at the cost of schema evolution and more complex reads.',
          'State diturunkan dengan memutar-ulang event — jejak audit yang lengkap, dengan biaya evolusi skema dan baca yang lebih kompleks.',
        ),
        review: { kind: 'arch', dim: 'D3', optionId: 'event-sourcing', lens: 'catalog' },
      },
    ],
  },
  {
    id: 'd4-structure',
    title: b('D4 · Code structure', 'D4 · Struktur kode'),
    description: b(
      'Hexagonal, Clean, Vertical Slice, Layered — the inside of the codebase and the cost of change.',
      'Hexagonal, Clean, Vertical Slice, Layered — bagian dalam basis kode dan biaya perubahan.',
    ),
    questions: [
      {
        q: b('What do Hexagonal and Clean Architecture fundamentally enforce?', 'Apa yang secara fundamental ditegakkan Hexagonal dan Clean Architecture?'),
        choices: [
          b('A specific folder layout', 'Tata letak folder tertentu'),
          b('Business rules never depend on frameworks or IO', 'Aturan bisnis tak pernah bergantung pada framework atau IO'),
          b('Microservices deployment', 'Deployment microservices'),
          b('One controller per file', 'Satu controller per berkas'),
        ],
        answer: 1,
        explain: b(
          'Ports & adapters and the dependency rule both fence the core from IO — that is what makes it unit-testable and durable.',
          'Ports & adapter dan dependency rule sama-sama memagari inti dari IO — itulah yang membuatnya dapat di-unit-test dan tahan lama.',
        ),
        review: { kind: 'arch', dim: 'D4', optionId: 'hexagonal', lens: 'catalog' },
      },
      {
        q: b('Vertical Slice architecture organises code by…', 'Arsitektur Vertical Slice menyusun kode berdasarkan…'),
        choices: [
          b('Technical layer', 'Lapisan teknis'),
          b('Feature — one feature lives in one place', 'Fitur — satu fitur berada di satu tempat'),
          b('Team seniority', 'Senioritas tim'),
          b('File size', 'Ukuran berkas'),
        ],
        answer: 1,
        explain: b(
          'It optimises for how software actually changes (per feature), the inverse of pure layering\'s change-amplification weakness.',
          'Ia mengoptimalkan cara perangkat lunak sebenarnya berubah (per fitur), kebalikan dari kelemahan amplifikasi-perubahan layering murni.',
        ),
        review: { kind: 'arch', dim: 'D4', optionId: 'vertical-slice', lens: 'catalog' },
      },
      {
        q: b('The classic failure mode of a purely layered structure is…', 'Mode kegagalan klasik dari struktur berlapis murni adalah…'),
        choices: [
          b('Too few files', 'Terlalu sedikit berkas'),
          b('One requirement change touching many layers (change amplification)', 'Satu perubahan kebutuhan menyentuh banyak lapisan (amplifikasi perubahan)'),
          b('Not enough abstraction', 'Abstraksi yang kurang'),
          b('Slow compilation', 'Kompilasi lambat'),
        ],
        answer: 1,
        explain: b(
          'Technical layering spreads one feature across every layer, so small domain changes fan out — the most predictive signal of architectural debt.',
          'Layering teknis menyebarkan satu fitur ke setiap lapisan, sehingga perubahan domain kecil merambat — sinyal utang arsitektur yang paling prediktif.',
        ),
        review: { kind: 'arch', dim: 'D4', optionId: 'layered', lens: 'review' },
      },
      {
        q: b('When is Clean Architecture\'s ceremony NOT worth it?', 'Kapan seremoni Clean Architecture TIDAK sepadan?'),
        choices: [
          b('In long-lived complex domains', 'Pada domain kompleks berumur panjang'),
          b('In small applications where the cost exceeds the benefit', 'Pada aplikasi kecil di mana biayanya melebihi manfaatnya'),
          b('When there are many integrations', 'Saat ada banyak integrasi'),
          b('When tests matter', 'Saat tes itu penting'),
        ],
        answer: 1,
        explain: b(
          'The guidance is explicit: don\'t impose the full ceremony on a small app — pick the lightest structure that keeps the core testable.',
          'Panduannya eksplisit: jangan paksakan seremoni penuh pada aplikasi kecil — pilih struktur teringan yang menjaga inti tetap dapat diuji.',
        ),
        review: { kind: 'arch', dim: 'D4', optionId: 'clean', lens: 'review' },
      },
      {
        q: b('Why does clear internal structure matter MORE with AI-assisted coding?', 'Mengapa struktur internal yang jelas makin PENTING dengan koding berbantuan AI?'),
        choices: [
          b('AI writes less code', 'AI menulis lebih sedikit kode'),
          b('Code is cheaper to write and costlier to understand — boundaries and tests become the safety brakes', 'Kode lebih murah ditulis dan lebih mahal dipahami — batas dan tes menjadi rem pengamannya'),
          b('AI refuses layered code', 'AI menolak kode berlapis'),
          b('It doesn\'t', 'Ia tidak'),
        ],
        answer: 1,
        explain: b(
          'Erosion happens faster when large "looks right" changes are cheap; enforced boundaries and fitness functions limit the blast radius.',
          'Erosi terjadi lebih cepat saat perubahan besar yang "tampak benar" itu murah; batas yang ditegakkan dan fitness function membatasi blast radius.',
        ),
        review: { kind: 'article', slug: 'genai-and-architecture' },
      },
    ],
  },
  {
    id: 'd5-frontend',
    title: b('D5 · Frontend architecture', 'D5 · Arsitektur frontend'),
    description: b(
      'SPA, SSR/SSG, micro-frontends — first paint, SEO, interactivity, and team autonomy.',
      'SPA, SSR/SSG, micro-frontend — first paint, SEO, interaktivitas, dan otonomi tim.',
    ),
    questions: [
      {
        q: b('The D5 decision fundamentally trades…', 'Keputusan D5 secara fundamental menukar…'),
        choices: [
          b('CSS vs JavaScript', 'CSS vs JavaScript'),
          b('First paint & SEO versus interactivity & team autonomy', 'First paint & SEO melawan interaktivitas & otonomi tim'),
          b('React vs Vue', 'React vs Vue'),
          b('Mobile vs desktop', 'Mobile vs desktop'),
        ],
        answer: 1,
        explain: b(
          'SSR/SSG win time-to-content and SEO; SPAs win rich interactivity; micro-frontends buy team autonomy at an integration cost.',
          'SSR/SSG memenangkan waktu-ke-konten dan SEO; SPA memenangkan interaktivitas kaya; micro-frontend membeli otonomi tim dengan biaya integrasi.',
        ),
        review: { kind: 'article', slug: 'choosing-frontend-architecture' },
      },
      {
        q: b('A content/marketing site where SEO and time-to-content dominate should default to…', 'Situs konten/marketing di mana SEO dan waktu-ke-konten mendominasi sebaiknya default ke…'),
        choices: [
          b('A SPA', 'Sebuah SPA'),
          b('SSR/SSG (prefer static or incremental rendering)', 'SSR/SSG (utamakan rendering statis atau inkremental)'),
          b('Micro-frontends', 'Micro-frontend'),
          b('An iframe', 'Sebuah iframe'),
        ],
        answer: 1,
        explain: b(
          'Rendering on the server or at build time wins first-contentful-paint and crawlability — the Core Web Vitals logic.',
          'Merender di server atau saat build memenangkan first-contentful-paint dan kemampuan-crawl — logika Core Web Vitals.',
        ),
        review: { kind: 'arch', dim: 'D5', optionId: 'ssr', lens: 'catalog' },
      },
      {
        q: b('Micro-frontends earn their cost when…', 'Micro-frontend sepadan dengan biayanya saat…'),
        choices: [
          b('Any app has two pages', 'Aplikasi apa pun punya dua halaman'),
          b('A large organisation has many UI teams on one product needing independent deploys', 'Organisasi besar punya banyak tim UI di satu produk yang butuh deploy independen'),
          b('You want a smaller bundle', 'Kamu ingin bundel yang lebih kecil'),
          b('SEO is critical', 'SEO itu kritis'),
        ],
        answer: 1,
        explain: b(
          'Below a certain organisation size the integration and consistency overhead dominates — the benefit is team autonomy, not technology.',
          'Di bawah ukuran organisasi tertentu, overhead integrasi dan konsistensi mendominasi — manfaatnya adalah otonomi tim, bukan teknologi.',
        ),
        review: { kind: 'arch', dim: 'D5', optionId: 'micro-frontends', lens: 'review' },
      },
      {
        q: b('The standard mitigations for a SPA\'s first-load weakness are…', 'Mitigasi standar untuk kelemahan muat-awal SPA adalah…'),
        choices: [
          b('Bigger servers', 'Server yang lebih besar'),
          b('Code-splitting and prefetching', 'Code-splitting dan prefetching'),
          b('Removing images', 'Menghapus gambar'),
          b('HTTP/1.0', 'HTTP/1.0'),
        ],
        answer: 1,
        explain: b(
          'Splitting the bundle and prefetching likely routes soften the first paint while keeping the rich-client interactivity.',
          'Memecah bundel dan mem-prefetch rute yang mungkin dituju melunakkan first paint sambil menjaga interaktivitas rich-client.',
        ),
        review: { kind: 'arch', dim: 'D5', optionId: 'spa', lens: 'playbook' },
      },
      {
        q: b('Conway\'s Law predicts that your UI architecture will mirror…', 'Hukum Conway memprediksi bahwa arsitektur UI-mu akan mencerminkan…'),
        choices: [
          b('The latest framework', 'Framework terbaru'),
          b('The communication structure of the teams that build it', 'Struktur komunikasi tim yang membangunnya'),
          b('The database schema', 'Skema basis data'),
          b('The cloud provider', 'Penyedia cloud'),
        ],
        answer: 1,
        explain: b(
          'Micro-frontends without genuinely separate UI teams re-create the coupling they were meant to remove — design teams and boundaries together.',
          'Micro-frontend tanpa tim UI yang benar-benar terpisah menciptakan kembali kopling yang seharusnya dihilangkan — rancang tim dan batas bersamaan.',
        ),
        review: { kind: 'article', slug: 'conways-law-team-topologies' },
      },
    ],
  },
  {
    id: 'methods-practice',
    title: b('Methods · Reviews, ADRs & guardrails', 'Metode · Tinjauan, ADR & rambu'),
    description: b(
      'ATAM, decision records, fitness functions, sustainability — the practice around the decisions.',
      'ATAM, catatan keputusan, fitness function, keberlanjutan — praktik di sekitar keputusan.',
    ),
    questions: [
      {
        q: b('ATAM\'s output is…', 'Keluaran ATAM adalah…'),
        choices: [
          b('A pass/fail grade', 'Nilai lulus/gagal'),
          b('A shared understanding of risks, sensitivity points, and trade-offs', 'Pemahaman bersama tentang risiko, titik sensitivitas, dan trade-off'),
          b('A vendor recommendation', 'Rekomendasi vendor'),
          b('A performance benchmark', 'Benchmark performa'),
        ],
        answer: 1,
        explain: b(
          'ATAM asks how well the architecture satisfies the prioritised quality attributes and what is sacrificed — it surfaces risks, not scores.',
          'ATAM menanyakan seberapa baik arsitektur memenuhi quality attribute yang diprioritaskan dan apa yang dikorbankan — ia memunculkan risiko, bukan skor.',
        ),
        review: { kind: 'article', slug: 'atam-review-checklist' },
      },
      {
        q: b('When an architectural decision changes, the recorded ADR should be…', 'Saat keputusan arsitektur berubah, ADR yang tercatat sebaiknya…'),
        choices: [
          b('Edited in place', 'Disunting di tempat'),
          b('Deleted', 'Dihapus'),
          b('Superseded by a new ADR (records are immutable)', 'Digantikan oleh ADR baru (catatan bersifat tak-berubah)'),
          b('Moved to a wiki', 'Dipindahkan ke wiki'),
        ],
        answer: 2,
        explain: b(
          'ADRs are immutable: a new record supersedes the old one, preserving the trail of reasoning.',
          'ADR bersifat tak-berubah: catatan baru menggantikan yang lama, menjaga jejak penalaran.',
        ),
        review: { kind: 'article', slug: 'writing-good-adrs' },
      },
      {
        q: b('A fitness function is…', 'Sebuah fitness function adalah…'),
        choices: [
          b('A gym plan for on-call engineers', 'Program gym untuk insinyur on-call'),
          b('An automated, CI-run check that fails when an architectural property is violated', 'Pemeriksaan otomatis yang dijalankan CI yang gagal saat properti arsitektur dilanggar'),
          b('A manual review meeting', 'Rapat tinjauan manual'),
          b('A performance test only', 'Hanya tes performa'),
        ],
        answer: 1,
        explain: b(
          'Just as unit tests protect behaviour, fitness functions protect architectural properties — dependency rules, budgets, boundaries.',
          'Sebagaimana unit test melindungi perilaku, fitness function melindungi properti arsitektur — aturan dependensi, anggaran, batas.',
        ),
        review: { kind: 'article', slug: 'fitness-functions-guarding' },
      },
      {
        q: b('Deliberate, prudent technical debt should be…', 'Utang teknis yang disengaja dan bijaksana sebaiknya…'),
        choices: [
          b('Hidden from the backlog', 'Disembunyikan dari backlog'),
          b('Recorded (e.g. in an ADR) with its interest and a repayment trigger', 'Dicatat (mis. dalam ADR) beserta bunganya dan pemicu pelunasan'),
          b('Fixed immediately, always', 'Diperbaiki segera, selalu'),
          b('Blamed on the last team', 'Ditimpakan pada tim sebelumnya'),
        ],
        answer: 1,
        explain: b(
          'The goal is not zero debt but visible, managed debt — like a planned loan instead of a surprise bill.',
          'Tujuannya bukan nol utang tapi utang yang terlihat dan terkelola — seperti pinjaman terencana alih-alih tagihan kejutan.',
        ),
        review: { kind: 'article', slug: 'architectural-technical-debt' },
      },
      {
        q: b('For carbon-efficient ("green") architecture, the biggest proven lever is…', 'Untuk arsitektur hemat-karbon ("hijau"), tuas terbukti terbesar adalah…'),
        choices: [
          b('Dark mode', 'Mode gelap'),
          b('Utilization — right-sizing, scale-to-zero when idle, cleaner regions/hours', 'Utilisasi — penyesuaian ukuran, scale-to-zero saat menganggur, region/jam yang lebih bersih'),
          b('Shorter variable names', 'Nama variabel yang lebih pendek'),
          b('More microservices', 'Lebih banyak microservices'),
        ],
        answer: 1,
        explain: b(
          'Many services at 5% utilization waste more than one at 60%; the SCI standard (ISO/IEC 21031) makes the target measurable.',
          'Banyak layanan pada utilisasi 5% lebih boros dari satu pada 60%; standar SCI (ISO/IEC 21031) membuat targetnya terukur.',
        ),
        review: { kind: 'article', slug: 'green-software-architecture' },
      },
    ],
  },
];
