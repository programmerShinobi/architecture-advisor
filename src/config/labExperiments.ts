import type { Bilingual, Levels } from '../types';

// The "Lab" Insights section: interactive sandboxes ON the real engine. Each experiment is a
// hypothesis plus a prepared scenario (factor levels for the frozen model's 14 factors, values 0–2).
// "Run it" loads the levels into the Advisor — the same engine, the same scoring. Content is
// bilingual EN/ID (rendered via tr()); a unit test asserts every factor id and level is valid.

const b = (en: string, id: string): Bilingual => ({ en, id });

export interface LabExperiment {
  id: string;
  title: Bilingual;
  /** The setup: what situation the levels describe. */
  brief: Bilingual;
  /** The claim to test in the Advisor. */
  hypothesis: Bilingual;
  levels: Levels;
  /** What to look at after running it. */
  watch: Bilingual[];
  /** The reading of the result, grounded in the model. */
  takeaway: Bilingual;
  /**
   * The architectures this experiment puts in play (`"D<n>:<optionId>"` keys) — shown as
   * deep-link chips on the page. Across all experiments the union covers ALL 21 options
   * (holistic parity with the four lenses; unit-tested).
   */
  focus: string[];
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'team-size-flip',
    focus: ['D1:layered', 'D1:monolith', 'D1:modular-monolith', 'D1:microservices', 'D1:serverless'],
    title: b('When does team size flip D1?', 'Kapan ukuran tim membalik D1?'),
    brief: b(
      'A proven product that is growing: several teams, moderate scale, decent DevOps — but nothing extreme.',
      'Produk yang sudah terbukti dan sedang tumbuh: beberapa tim, skala sedang, DevOps cukup baik — tapi tidak ada yang ekstrem.',
    ),
    hypothesis: b(
      'Deployment style (D1) is driven more by team/organisation factors than by raw traffic.',
      'Gaya deployment (D1) lebih ditentukan oleh faktor tim/organisasi daripada oleh trafik semata.',
    ),
    levels: { team: 2, distribution: 1, ttm: 1, budget: 1, lifespan: 2, scale: 1, dataVolume: 1, async: 1, realtime: 0, domain: 1, consistency: 1, security: 1, legacy: 0, devops: 2 },
    watch: [
      b('The D1 ranking and the gap between modular monolith and microservices.', 'Peringkat D1 dan jarak antara modular monolith dan microservices.'),
      b('Now lower Team size to Small (1–5) and watch the ranking reorder.', 'Sekarang turunkan Ukuran tim ke Kecil (1–5) dan lihat peringkatnya berubah.'),
      b('The "why not the runner-up" explainer for which attributes moved.', 'Penjelasan "kenapa bukan peringkat-2" untuk melihat atribut mana yang bergeser.'),
    ],
    takeaway: b(
      "Deployability and maintainability weights follow team size and distribution — Conway's Law, computed. Traffic alone rarely justifies distribution.",
      'Bobot kemudahan rilis dan pemeliharaan mengikuti ukuran dan sebaran tim — Hukum Conway, dihitung. Trafik saja jarang membenarkan distribusi.',
    ),
  },
  {
    id: 'premature-split',
    focus: ['D1:monolith', 'D1:modular-monolith', 'D1:microservices'],
    title: b('Trigger the premature-microservices warning', 'Picu peringatan microservices prematur'),
    brief: b(
      'A small co-located team with immature DevOps — but imagine they pick microservices anyway.',
      'Tim kecil satu lokasi dengan DevOps belum matang — bayangkan mereka tetap memilih microservices.',
    ),
    hypothesis: b(
      'The anti-pattern engine warns when the chosen style needs operational maturity the factors do not support.',
      'Mesin anti-pattern memperingatkan saat gaya yang dipilih butuh kematangan operasional yang tidak didukung faktornya.',
    ),
    levels: { team: 0, distribution: 0, ttm: 2, budget: 0, lifespan: 1, scale: 0, dataVolume: 0, async: 0, realtime: 0, domain: 0, consistency: 1, security: 0, legacy: 0, devops: 0 },
    watch: [
      b('The D1 recommendation (it should favour a monolith/modular monolith).', 'Rekomendasi D1 (seharusnya condong ke monolith/modular monolith).'),
      b('In Expert mode, override the D1 selection to Microservices.', 'Di mode Expert, timpa pilihan D1 menjadi Microservices.'),
      b('The anti-pattern warning that appears — read its reasoning.', 'Peringatan anti-pattern yang muncul — baca alasannya.'),
    ],
    takeaway: b(
      "The warning is the literature's checklist (team, boundaries, DevOps) encoded as a guard — the same signals as the \"avoiding premature microservices\" review.",
      'Peringatan itu adalah checklist literatur (tim, batasan, DevOps) yang dikodekan sebagai penjaga — sinyal yang sama dengan tinjauan "menghindari microservices prematur".',
    ),
  },
  {
    id: 'realtime-streaming',
    focus: ['D2:synchronous', 'D2:async-messaging', 'D2:event-driven', 'D2:streaming'],
    title: b('Push D2 towards streaming', 'Dorong D2 ke arah streaming'),
    brief: b(
      'An IoT-flavoured system: high data volume, heavily async, near-real-time processing.',
      'Sistem bernuansa IoT: volume data tinggi, sangat asinkron, pemrosesan mendekati real-time.',
    ),
    hypothesis: b(
      'Real-time + async + data volume move D2 from request–response towards events and streaming.',
      'Real-time + asinkron + volume data menggeser D2 dari request–response ke arah event dan streaming.',
    ),
    levels: { team: 1, distribution: 1, ttm: 1, budget: 1, lifespan: 2, scale: 2, dataVolume: 2, async: 2, realtime: 2, domain: 1, consistency: 0, security: 1, legacy: 0, devops: 2 },
    watch: [
      b('The D2 ranking — where do event-driven and streaming land?', 'Peringkat D2 — di mana event-driven dan streaming berada?'),
      b('Drop Real-time back to its lowest level and compare (pin A/B to see it side by side).', 'Turunkan Real-time ke level terendah dan bandingkan (sematkan A/B untuk melihat berdampingan).'),
      b('The trade-off radar for what streaming costs in simplicity.', 'Radar trade-off untuk melihat harga streaming dalam hal kesederhanaan.'),
    ],
    takeaway: b(
      'Streaming wins continuous flows, not request/reply — the factors encode exactly that boundary, and the A/B compare makes the flip visible.',
      'Streaming menang untuk aliran kontinu, bukan request/reply — faktornya mengodekan persis batas itu, dan pembanding A/B membuat pembalikannya terlihat.',
    ),
  },
  {
    id: 'consistency-anchor',
    focus: ['D3:single-db', 'D3:db-per-service', 'D3:cqrs', 'D3:event-sourcing', 'D3:polyglot'],
    title: b('Consistency as the data anchor', 'Konsistensi sebagai jangkar data'),
    brief: b(
      'A regulated, correctness-critical system: strong consistency demands, high security, long lifespan.',
      'Sistem teregulasi yang kritis-kebenaran: tuntutan konsistensi kuat, keamanan tinggi, umur panjang.',
    ),
    hypothesis: b(
      'Strong consistency requirements anchor D3 on a single database even when other factors say "distribute".',
      'Kebutuhan konsistensi kuat menjangkar D3 pada satu basis data meski faktor lain berkata "distribusikan".',
    ),
    levels: { team: 2, distribution: 2, ttm: 0, budget: 2, lifespan: 2, scale: 1, dataVolume: 1, async: 0, realtime: 0, domain: 2, consistency: 2, security: 2, legacy: 1, devops: 1 },
    watch: [
      b('The D3 ranking — single shared DB vs database-per-service.', 'Peringkat D3 — satu DB bersama vs database-per-service.'),
      b('Now relax Consistency to its lowest level and watch D3 reorder.', 'Sekarang longgarkan Konsistensi ke level terendah dan lihat D3 berubah urutan.'),
      b('The data-consistency anti-pattern warnings if you force a mismatch.', 'Peringatan anti-pattern konsistensi data jika kamu memaksakan ketidakcocokan.'),
    ],
    takeaway: b(
      'Losing the single transaction is the real price of splitting data — when the business cannot tolerate eventual consistency, the model keeps data together.',
      'Kehilangan transaksi tunggal adalah harga sesungguhnya dari memecah data — saat bisnis tak bisa menoleransi konsistensi eventual, model menjaga data tetap bersama.',
    ),
  },
  {
    id: 'legacy-strangler',
    focus: ['D1:monolith', 'D1:modular-monolith', 'D1:microservices'],
    title: b('Legacy weight and the migration path', 'Bobot legacy dan jalur migrasi'),
    brief: b(
      'A heavy legacy estate with a plan to modernise: big system, old constraints, decent team.',
      'Warisan legacy yang berat dengan rencana modernisasi: sistem besar, constraint lama, tim cukup baik.',
    ),
    hypothesis: b(
      'High legacy coupling makes the Advisor recommend an incremental (Strangler Fig) path, not a leap.',
      'Kopling legacy yang tinggi membuat Advisor merekomendasikan jalur bertahap (Strangler Fig), bukan lompatan.',
    ),
    levels: { team: 2, distribution: 1, ttm: 1, budget: 1, lifespan: 2, scale: 1, dataVolume: 1, async: 1, realtime: 0, domain: 2, consistency: 1, security: 1, legacy: 2, devops: 1 },
    watch: [
      b('The migration-path card under the recommendation.', 'Kartu jalur migrasi di bawah rekomendasi.'),
      b('The "legacy without a plan" warning and what silences it.', 'Peringatan "legacy tanpa rencana" dan apa yang meredamnya.'),
      b('How D1 balances modular monolith vs microservices under legacy weight.', 'Bagaimana D1 menyeimbangkan modular monolith vs microservices di bawah bobot legacy.'),
    ],
    takeaway: b(
      "The map's rungs apply: enforce boundaries first, extract along bounded contexts, keep every step reversible — the engine encodes the same incremental bias as the Strangler Fig literature.",
      'Anak tangga petanya berlaku: tegakkan batas dulu, ekstrak sepanjang bounded context, jaga setiap langkah dapat dibatalkan — mesin mengodekan bias bertahap yang sama dengan literatur Strangler Fig.',
    ),
  },
  {
    id: 'ceremony-vs-speed',
    focus: ['D4:layered', 'D4:hexagonal', 'D4:clean', 'D4:vertical-slice'],
    title: b('Code structure: ceremony vs speed (D4)', 'Struktur kode: seremoni vs kecepatan (D4)'),
    brief: b(
      'A long-lived product with a complex domain and a stable team — the opposite of a throwaway prototype.',
      'Produk berumur panjang dengan domain kompleks dan tim stabil — kebalikan dari prototipe sekali pakai.',
    ),
    hypothesis: b(
      'Domain complexity and lifespan push D4 towards the framework-free cores (Hexagonal/Clean); a short-lived simple app flips it back to Layered/Vertical Slice.',
      'Kompleksitas domain dan umur mendorong D4 ke inti bebas-framework (Hexagonal/Clean); aplikasi sederhana berumur pendek membalikkannya ke Layered/Vertical Slice.',
    ),
    levels: { team: 1, distribution: 0, ttm: 0, budget: 1, lifespan: 2, scale: 1, dataVolume: 1, async: 0, realtime: 0, domain: 2, consistency: 1, security: 1, legacy: 0, devops: 1 },
    watch: [
      b('The D4 ranking — where do Hexagonal and Clean sit versus Layered?', 'Peringkat D4 — di mana Hexagonal dan Clean dibanding Layered?'),
      b('Now set Lifespan to its lowest and Time-to-market to its highest, and compare (pin A/B).', 'Sekarang set Umur ke terendah dan Time-to-market ke tertinggi, lalu bandingkan (sematkan A/B).'),
      b('The contribution bars: which quality attributes carry the D4 decision.', 'Bilah kontribusi: quality attribute mana yang menopang keputusan D4.'),
    ],
    takeaway: b(
      'The ceremony of a protected core is an investment priced by lifespan and domain complexity — exactly the "don\'t impose Clean on a small app" guidance, computed.',
      'Seremoni inti yang terlindungi adalah investasi yang harganya ditentukan umur dan kompleksitas domain — persis panduan "jangan paksakan Clean pada aplikasi kecil", dihitung.',
    ),
  },
  {
    id: 'frontend-autonomy',
    focus: ['D5:spa', 'D5:ssr', 'D5:micro-frontends'],
    title: b('When do micro-frontends earn their cost? (D5)', 'Kapan micro-frontend sepadan dengan biayanya? (D5)'),
    brief: b(
      'A large, distributed organisation with many UI teams on one product — high scale, mature DevOps.',
      'Organisasi besar dan terdistribusi dengan banyak tim UI di satu produk — skala tinggi, DevOps matang.',
    ),
    hypothesis: b(
      'Micro-frontends only rise in D5 when team size and distribution are high; below that, SPA/SSR win on simplicity.',
      'Micro-frontend hanya naik di D5 saat ukuran dan sebaran tim tinggi; di bawah itu, SPA/SSR menang karena kesederhanaan.',
    ),
    levels: { team: 2, distribution: 2, ttm: 1, budget: 2, lifespan: 2, scale: 2, dataVolume: 1, async: 1, realtime: 1, domain: 1, consistency: 1, security: 1, legacy: 0, devops: 2 },
    watch: [
      b('The D5 ranking — how close do micro-frontends get to the top?', 'Peringkat D5 — seberapa dekat micro-frontend ke puncak?'),
      b('Now set Team size and Team distribution to their lowest levels and compare (pin A/B).', 'Sekarang set Ukuran tim dan Sebaran tim ke level terendah dan bandingkan (sematkan A/B).'),
      b('The trade-off radar: what micro-frontends pay in simplicity and first-paint.', 'Radar trade-off: apa yang dibayar micro-frontend dalam kesederhanaan dan first-paint.'),
    ],
    takeaway: b(
      "Team autonomy is an organisational benefit — Conway's Law again: the org chart, not the framework, decides when micro-frontends are worth their integration cost.",
      'Otonomi tim adalah manfaat organisasional — sekali lagi Hukum Conway: bagan organisasi, bukan framework, yang menentukan kapan micro-frontend sepadan dengan biaya integrasinya.',
    ),
  },
];
