import type { Bilingual, DimensionId, FactorId, Levels } from '../types';

// Rule-based anti-pattern detection over the chosen COMBINATION of options + factors.
// Conditions: docs/03-blueprint/model-data-sheet.md Section 5 (🔒 Build Spec Section 10).
// Messages: docs/03-blueprint/option-content-sheet.md Section 6 (bilingual, verbatim).

export type Severity = 'info' | 'warning' | 'danger';

export interface AntiPatternContext {
  levels: Levels;
  /** The selected option id for each dimension (the coherent combination). */
  selections: Record<DimensionId, string>;
  /** Whether the user has chosen a migration path (Phase 5/6 feature; false until then). */
  migrationPathChosen: boolean;
}

export interface AntiPatternRule {
  id: string;
  severity: Severity;
  message: Bilingual;
  test: (ctx: AntiPatternContext) => boolean;
}

const lvl = (ctx: AntiPatternContext, f: FactorId) => ctx.levels[f] ?? 0;

export const ANTI_PATTERNS: AntiPatternRule[] = [
  {
    id: 'premature-microservices',
    severity: 'danger',
    message: {
      en: 'Microservices with a small team and low platform maturity usually become a distributed monolith: you pay the operational price without gaining the autonomy. Start with a modular monolith and split when the team and tooling are ready.',
      id: 'Microservices dengan tim kecil dan kematangan platform rendah biasanya berubah menjadi distributed monolith: Anda membayar harga operasionalnya tanpa mendapat otonominya. Mulailah dari modular monolith dan pecah saat tim serta tooling siap.',
    },
    test: (ctx) =>
      ctx.selections.D1 === 'microservices' && lvl(ctx, 'team') <= 0 && lvl(ctx, 'devops') <= 0,
  },
  {
    id: 'distributed-monolith',
    severity: 'danger',
    message: {
      en: 'Services that share one database cannot deploy or scale independently — the defining benefits of microservices disappear while the complexity stays. Give each service its own data, or stay with a (modular) monolith.',
      id: 'Layanan yang berbagi satu database tidak bisa rilis atau naik skala secara independen — manfaat utama microservices hilang sementara kompleksitasnya tinggal. Beri tiap layanan datanya sendiri, atau tetaplah dengan (modular) monolith.',
    },
    test: (ctx) => ctx.selections.D1 === 'microservices' && ctx.selections.D3 === 'single-db',
  },
  {
    id: 'sync-coupling-at-scale',
    severity: 'warning',
    message: {
      en: 'Synchronous call chains between services create cascading-failure risk under load. Add timeouts, retries with backoff, and circuit breakers — or make the non-urgent hops asynchronous.',
      id: 'Rantai panggilan sinkron antarlayanan menimbulkan risiko kegagalan berantai saat beban tinggi. Tambahkan timeout, retry dengan backoff, dan circuit breaker — atau jadikan lompatan yang tidak mendesak asinkron.',
    },
    test: (ctx) =>
      ctx.selections.D1 === 'microservices' &&
      ctx.selections.D2 === 'synchronous' &&
      lvl(ctx, 'scale') >= 1,
  },
  {
    id: 'over-engineered-mvp',
    severity: 'warning',
    message: {
      en: 'For a short-lived product under deadline pressure, heavyweight patterns slow you down without paying back. Bias to the simplest viable option; upgrade when the product earns it.',
      id: 'Untuk produk berumur pendek di bawah tekanan tenggat, pola kelas berat memperlambat tanpa balik modal. Condonglah ke opsi paling sederhana yang layak; naikkan kelas saat produknya sudah pantas.',
    },
    test: (ctx) =>
      lvl(ctx, 'lifespan') === 0 &&
      lvl(ctx, 'ttm') === 2 &&
      (ctx.selections.D1 === 'microservices' ||
        ctx.selections.D3 === 'cqrs' ||
        ctx.selections.D3 === 'event-sourcing'),
  },
  {
    id: 'consistency-conflict',
    severity: 'warning',
    message: {
      en: 'You require strong consistency, but the chosen styles are eventually consistent by nature. Isolate the strongly-consistent core on a transactional store, and let the rest be eventual.',
      id: 'Anda mensyaratkan konsistensi kuat, tetapi gaya yang dipilih bersifat eventual secara alami. Isolasi inti yang butuh konsistensi kuat pada penyimpanan transaksional, dan biarkan sisanya eventual.',
    },
    test: (ctx) =>
      lvl(ctx, 'consistency') === 2 &&
      (ctx.selections.D2 === 'event-driven' || ctx.selections.D3 === 'event-sourcing'),
  },
  {
    id: 'legacy-without-plan',
    severity: 'warning',
    message: {
      en: 'Heavy legacy coupling plus a big-bang rewrite is the riskiest path. Use the Strangler Fig pattern: route traffic through a facade and migrate one capability at a time.',
      id: 'Keterikatan legacy yang berat ditambah penulisan ulang sekali jadi adalah jalur paling berisiko. Gunakan pola Strangler Fig: arahkan trafik lewat fasad dan migrasikan satu kapabilitas demi satu.',
    },
    test: (ctx) =>
      lvl(ctx, 'legacy') === 2 &&
      (ctx.selections.D1 === 'microservices' || ctx.selections.D1 === 'serverless') &&
      !ctx.migrationPathChosen,
  },
  {
    id: 'strict-security-shared-infra',
    severity: 'info',
    message: {
      en: "Strict compliance on serverless means shared responsibility with your cloud provider. Clarify which controls are yours, and verify the provider's certifications cover your regulation.",
      id: 'Kepatuhan ketat di serverless berarti tanggung jawab berbagi dengan penyedia cloud Anda. Perjelas kendali mana yang menjadi milik Anda, dan pastikan sertifikasi penyedia mencakup regulasi Anda.',
    },
    test: (ctx) =>
      lvl(ctx, 'security') === 2 && ctx.selections.D1 === 'serverless' && lvl(ctx, 'devops') <= 1,
  },
];
