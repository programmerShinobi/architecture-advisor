import type { Bilingual } from '../types';

// Incremental migration paths for brownfield situations (Strangler Fig). Ported from the design
// reference (docs/03-blueprint/prototype/index.html MIG); Indonesian authored to match.

export type MigrationKey = 'fresh' | 'big' | 'mix';

export const MIGRATION_PATHS: Record<MigrationKey, Bilingual[]> = {
  fresh: [
    { en: 'Start with a Modular monolith — fast and simple', id: 'Mulai dari Modular monolith — cepat dan sederhana' },
    { en: 'Keep clear module boundaries from day one', id: 'Jaga batas modul yang jelas sejak hari pertama' },
    { en: 'Extract a module into its own service only when it proves a bottleneck', id: 'Pisahkan modul jadi layanan sendiri hanya saat terbukti jadi leher botol' },
    { en: 'Grow into microservices where the benefit is real', id: 'Tumbuh menjadi microservices di tempat manfaatnya nyata' },
  ],
  big: [
    { en: 'Add clear module boundaries inside the current app', id: 'Tambahkan batas modul yang jelas di dalam aplikasi saat ini' },
    { en: 'Wrap the seams with tests and CI', id: 'Bungkus titik sambung dengan tes dan CI' },
    { en: 'Carve out the busiest area as the first service (Strangler Fig)', id: 'Pisahkan area tersibuk sebagai layanan pertama (Strangler Fig)' },
    { en: 'Repeat for the next bottleneck, retiring old code as you go', id: 'Ulangi untuk leher botol berikutnya, pensiunkan kode lama secara bertahap' },
  ],
  mix: [
    { en: 'Put an API gateway / anti-corruption layer in front', id: 'Pasang API gateway / anti-corruption layer di depan' },
    { en: 'Route new features to new services', id: 'Arahkan fitur baru ke layanan baru' },
    { en: 'Strangle legacy piece by piece behind the gateway', id: 'Cekik legacy bagian demi bagian di balik gateway' },
    { en: 'Retire old systems as traffic shifts over', id: 'Pensiunkan sistem lama saat trafik berpindah' },
  ],
};
