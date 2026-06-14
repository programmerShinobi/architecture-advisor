import type { Bilingual, DimensionId } from '../types';

// Plain-language narrative for the recommendation detail panel, matching the design reference
// (docs/03-blueprint/prototype/index.html DIMS): per-dimension "the good / the cost / good to
// know", and a one-line blurb per option (guided + expert voice). English ported from the
// prototype; Indonesian authored in the same register. (Expert "contributions" are computed
// live from the engine, not stored here.)

export interface DimNarrative {
  good: Bilingual;
  cost: Bilingual;
  know: Bilingual;
}

export const DIM_NARRATIVE: Record<DimensionId, DimNarrative> = {
  D1: {
    good: {
      en: 'handles big crowds well, and teams update their own part without stepping on each other',
      id: 'menangani lonjakan pengunjung dengan baik, dan tiap tim memperbarui bagiannya tanpa saling mengganggu',
    },
    cost: {
      en: 'more moving parts to manage, and keeping data in sync is harder — which you said is OK',
      id: 'lebih banyak bagian untuk dikelola, dan menjaga data tetap sinkron lebih sulit — yang Anda bilang tidak masalah',
    },
    know: {
      en: "needs a capable team and good automation; if that's not ready, the runner-up is gentler",
      id: 'butuh tim yang cakap dan otomasi yang baik; bila belum siap, opsi peringkat berikutnya lebih ramah',
    },
  },
  D2: {
    good: {
      en: 'parts react to events instead of waiting in line, so the system stays responsive and keeps working even when one part is busy',
      id: 'bagian-bagian bereaksi terhadap event alih-alih menunggu antrean, sehingga sistem tetap responsif dan terus berjalan walau satu bagian sibuk',
    },
    cost: {
      en: 'the exact order of events and keeping data perfectly in sync is harder to guarantee',
      id: 'urutan persis event dan menjaga data benar-benar sinkron lebih sulit dijamin',
    },
    know: {
      en: 'great when work can happen in the background; if you truly need an instant yes/no answer, a direct call is simpler',
      id: 'bagus saat pekerjaan bisa berjalan di latar belakang; bila benar-benar butuh jawaban ya/tidak seketika, panggilan langsung lebih sederhana',
    },
  },
  D3: {
    good: {
      en: 'each app owns its own data, so teams can change and scale their part without waiting on others',
      id: 'tiap aplikasi memiliki datanya sendiri, sehingga tim bisa mengubah dan menskalakan bagiannya tanpa menunggu yang lain',
    },
    cost: {
      en: 'keeping data consistent across apps takes more effort, and there are more databases to operate',
      id: 'menjaga konsistensi data antar-aplikasi butuh upaya lebih, dan ada lebih banyak database untuk dioperasikan',
    },
    know: {
      en: 'a natural fit for small independent apps; with one big app, a single shared database is simpler',
      id: 'cocok untuk aplikasi kecil yang independen; dengan satu aplikasi besar, satu database bersama lebih sederhana',
    },
  },
  D4: {
    good: {
      en: 'business rules are kept separate from technical details, so the core is easy to test and change',
      id: 'aturan bisnis dipisah dari detail teknis, sehingga inti mudah diuji dan diubah',
    },
    cost: {
      en: 'a little more structure up front, which slightly slows the very first delivery',
      id: 'sedikit lebih banyak struktur di awal, yang sedikit memperlambat rilis pertama',
    },
    know: {
      en: 'pays off as the domain grows complex; for a tiny short-lived app, a simple layered structure is enough',
      id: 'terbayar saat domain makin kompleks; untuk aplikasi kecil berumur pendek, struktur layered sederhana sudah cukup',
    },
  },
  D5: {
    good: {
      en: 'each team can build and ship its own part of the screen independently',
      id: 'tiap tim bisa membangun dan merilis bagian layarnya sendiri secara independen',
    },
    cost: {
      en: 'more moving parts in the browser and more setup to keep the experience consistent',
      id: 'lebih banyak bagian di browser dan lebih banyak penyiapan agar pengalaman tetap konsisten',
    },
    know: {
      en: 'worth it for large or distributed teams; for a small team, one single-page app is simpler and faster',
      id: 'sepadan untuk tim besar atau terdistribusi; untuk tim kecil, satu single-page app lebih sederhana dan cepat',
    },
  },
};

export interface OptionBlurb {
  plain: Bilingual;
  expert: Bilingual;
}

// Keyed "<dimensionId>:<optionId>".
export const OPTION_BLURB: Record<string, OptionBlurb> = {
  'D1:microservices': {
    plain: { en: 'Several small apps — best for crowds and independent teams', id: 'Beberapa aplikasi kecil — terbaik untuk keramaian dan tim independen' },
    expert: { en: 'Independent services; strongest on scalability & deployability', id: 'Layanan independen; terkuat pada skalabilitas & kemudahan rilis' },
  },
  'D1:serverless': {
    plain: { en: 'Runs code on demand — no servers to manage', id: 'Menjalankan kode sesuai permintaan — tanpa server untuk dikelola' },
    expert: { en: 'FaaS; scales to zero, pay-per-use, watch cold starts', id: 'FaaS; skala ke nol, bayar per pakai, waspadai cold start' },
  },
  'D1:modular-monolith': {
    plain: { en: 'One app with clear internal modules', id: 'Satu aplikasi dengan modul internal yang jelas' },
    expert: { en: 'Single deploy; enforced module boundaries', id: 'Satu rilis; batas modul ditegakkan' },
  },
  'D1:monolith': {
    plain: { en: 'One app for everything — simplest to start', id: 'Satu aplikasi untuk semua — paling sederhana untuk mulai' },
    expert: { en: 'Single deployable; simplest ops, scales as a whole', id: 'Satu unit rilis; operasional paling sederhana, naik skala sebagai satu kesatuan' },
  },
  'D1:layered': {
    plain: { en: 'Classic tiers: presentation, business, data', id: 'Tier klasik: presentasi, bisnis, data' },
    expert: { en: 'N-tier; familiar, tiers scale together', id: 'N-tier; familiar, tier naik skala bersama' },
  },
  'D2:event-driven': {
    plain: { en: 'Parts react to events — very scalable and resilient', id: 'Bagian bereaksi terhadap event — sangat skalabel dan tangguh' },
    expert: { en: 'Pub/sub; high decoupling, eventual consistency', id: 'Pub/sub; decoupling tinggi, konsistensi eventual' },
  },
  'D2:async-messaging': {
    plain: { en: 'Parts leave messages for each other — resilient', id: 'Bagian saling meninggalkan pesan — tangguh' },
    expert: { en: 'Queues/brokers; decoupled, buffered load', id: 'Queue/broker; ter-decouple, beban ter-buffer' },
  },
  'D2:streaming': {
    plain: { en: 'Continuous flow of live data — great for sensors', id: 'Aliran data langsung yang kontinu — bagus untuk sensor' },
    expert: { en: 'Event streams; high throughput, real-time', id: 'Event stream; throughput tinggi, real-time' },
  },
  'D2:synchronous': {
    plain: { en: 'Parts ask and wait — simplest but tighter coupling', id: 'Bagian bertanya dan menunggu — paling sederhana tapi lebih terikat' },
    expert: { en: 'Request/response; simple, tighter coupling', id: 'Request/response; sederhana, kopling lebih ketat' },
  },
  'D3:db-per-service': {
    plain: { en: 'Each app keeps its own data — stays independent', id: 'Tiap aplikasi menyimpan datanya sendiri — tetap independen' },
    expert: { en: 'Per-service stores; enables independent deploy/scale', id: 'Penyimpanan per-layanan; memungkinkan rilis/skala independen' },
  },
  'D3:cqrs': {
    plain: { en: 'Separate paths for reading and writing — fast reads', id: 'Jalur terpisah untuk baca dan tulis — baca cepat' },
    expert: { en: 'Split read/write models; scales divergent loads', id: 'Pisahkan model baca/tulis; menskalakan beban yang berbeda' },
  },
  'D3:polyglot': {
    plain: { en: 'Right database for each job', id: 'Database yang tepat untuk tiap kebutuhan' },
    expert: { en: 'Fit-for-purpose stores; higher ops overhead', id: 'Penyimpanan sesuai fungsi; overhead operasional lebih tinggi' },
  },
  'D3:event-sourcing': {
    plain: { en: 'Stores every change as history — full audit trail', id: 'Menyimpan tiap perubahan sebagai riwayat — jejak audit lengkap' },
    expert: { en: 'Append-only log; audit + replay, complex', id: 'Log append-only; audit + replay, kompleks' },
  },
  'D3:single-db': {
    plain: { en: 'One database for everything — simple but limiting', id: 'Satu database untuk semua — sederhana tapi membatasi' },
    expert: { en: 'Shared store; simple, blocks independent scaling', id: 'Penyimpanan bersama; sederhana, menghambat skala independen' },
  },
  'D4:hexagonal': {
    plain: { en: 'Business logic kept separate from technical details', id: 'Logika bisnis dipisah dari detail teknis' },
    expert: { en: 'Ports & adapters; isolates core from IO/frameworks', id: 'Ports & adapters; mengisolasi inti dari IO/framework' },
  },
  'D4:clean': {
    plain: { en: 'Strict layers around the core rules', id: 'Lapisan ketat mengelilingi aturan inti' },
    expert: { en: 'Dependency rule inward; testable core', id: 'Aturan dependensi ke dalam; inti mudah diuji' },
  },
  'D4:vertical-slice': {
    plain: { en: 'Organized by feature, not by layer', id: 'Diatur per fitur, bukan per lapisan' },
    expert: { en: 'Feature-sliced; low coupling between features', id: 'Per-fitur; kopling antar-fitur rendah' },
  },
  'D4:layered': {
    plain: { en: 'Simple top-to-bottom layers', id: 'Lapisan sederhana atas-ke-bawah' },
    expert: { en: 'Classic layering; quick but can tangle over time', id: 'Layering klasik; cepat tapi bisa kusut seiring waktu' },
  },
  'D5:micro-frontends': {
    plain: { en: 'Teams own their own screens independently', id: 'Tim memiliki layarnya sendiri secara independen' },
    expert: { en: 'Independently deployable UI; suits large teams', id: 'UI yang dirilis independen; cocok untuk tim besar' },
  },
  'D5:spa': {
    plain: { en: 'One smooth app in the browser', id: 'Satu aplikasi mulus di browser' },
    expert: { en: 'SPA; rich interactivity, one deployable', id: 'SPA; interaktivitas kaya, satu unit rilis' },
  },
  'D5:ssr': {
    plain: { en: 'Pages built on the server — fast first load, good SEO', id: 'Halaman dibangun di server — muat awal cepat, SEO baik' },
    expert: { en: 'SSR/SSG; strong first paint & SEO', id: 'SSR/SSG; first paint kuat & SEO' },
  },
};
