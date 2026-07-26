import type { SectionId } from './contentSchema';
import type { Bilingual } from '../types';

/**
 * The paragraph shown when an Insights section is opened.
 *
 * WHY THESE LIVE HERE AND NOT IN `dict`. `dict` is a single object literal, so Vite cannot
 * tree-shake its properties: every key costs first-paint bytes for everyone, including visitors who
 * never open this tab. That is tolerable for short chrome labels and untenable for long prose — the
 * seven paragraphs below are ~2.5kB, they are read only inside the lazily-loaded Insights view, and
 * moving them here puts them in that lazy chunk where they belong. The alternative was raising the
 * initial-JS budget a third time in one sitting, which would have made the budget decorative.
 *
 * WHAT THEY HAVE TO DO. Each answers "what am I looking at, and is it the one I want?" at a level
 * that assumes nothing: no jargon carried over from the section name, no term used before it is
 * explained. Each is written natively in both languages rather than translated word-for-word, since
 * a literal rendering of an English sentence reads as stilted Indonesian and vice versa.
 */
export const SECTION_INTROS: Record<SectionId, Bilingual> = {
  catalog: {
    en: 'the starting point when a name means nothing to you yet. Each of the 21 architectures gets a plain-language page: what it actually is, the kind of project it suits, what it costs you in practice, and where those claims come from. Read this one first if you are new — the other three assume you already know what the thing is.',
    id: 'titik awal ketika sebuah nama belum berarti apa-apa bagi Anda. Masing-masing dari 21 arsitektur punya halaman berbahasa sederhana: sebenarnya ia apa, cocok untuk proyek seperti apa, apa yang harus Anda bayar dalam praktik, dan dari mana klaim itu berasal. Baca yang ini dulu kalau Anda baru — tiga lensa lainnya menganggap Anda sudah tahu bendanya apa.',
  },
  playbook: {
    en: 'for after the decision, when the question changes from "which one" to "how do I actually build this". Each page lays out what must be in place before you start, the steps in the order you do them, the practices that hold up over time, and the mistakes people reliably make — so you can read the traps before you walk into them rather than after.',
    id: 'untuk setelah keputusan diambil, ketika pertanyaannya berubah dari "yang mana" menjadi "bagaimana sebenarnya membangun ini". Tiap halaman memaparkan apa yang harus tersedia sebelum mulai, langkah-langkahnya dalam urutan pengerjaan, praktik yang terbukti bertahan, dan kesalahan yang berulang kali dibuat orang — supaya Anda membaca jebakannya sebelum terperosok, bukan sesudah.',
  },
  review: {
    en: 'for when two options both look reasonable and you have to choose. Each architecture is examined the same way — what it does well, where it hurts, how it behaves under load, how it grows, and what it feels like to work on day to day — and closes with a plain verdict. Because the shape is identical for every one, you can lay two side by side and compare like with like.',
    id: 'untuk saat dua opsi sama-sama terlihat masuk akal dan Anda harus memilih. Tiap arsitektur ditelaah dengan cara yang sama — apa yang dikerjakannya dengan baik, di mana ia menyakitkan, bagaimana perilakunya saat beban tinggi, bagaimana ia tumbuh, dan bagaimana rasanya dikerjakan sehari-hari — lalu ditutup dengan kesimpulan yang lugas. Karena bentuknya identik untuk semuanya, Anda bisa menyandingkan dua dan membandingkan hal yang setara.',
  },
  library: {
    en: 'the place to look something up rather than read it through. Precise definitions, the ideas an architecture rests on, the patterns that travel with it, and the vocabulary you will meet in the other pages. Come here the moment a word stops you — that is what it is for.',
    id: 'tempat untuk mencari sesuatu, bukan untuk dibaca dari awal sampai akhir. Definisi yang presisi, gagasan yang menjadi dasar sebuah arsitektur, pola yang biasa menyertainya, dan kosakata yang akan Anda temui di halaman lain. Datanglah ke sini begitu ada kata yang menghentikan Anda — memang untuk itu ia ada.',
  },
  roadmap: {
    en: 'for when the obstacle is not the material but knowing where to begin. Each path is an ordered route through the pages you already have — read this, then that — taking you from knowing nothing to being able to hold your own in an architecture discussion. Follow one instead of choosing for yourself.',
    id: 'untuk saat hambatannya bukan materinya, melainkan tahu harus mulai dari mana. Tiap jalur adalah rute berurutan melewati halaman yang memang sudah ada — baca ini, lalu itu — membawa Anda dari tidak tahu apa-apa sampai mampu mengimbangi pembicaraan soal arsitektur. Ikuti satu jalur daripada memilih sendiri.',
  },
  academy: {
    en: 'questions that show you the difference between having read something and actually knowing it — a page can feel familiar while none of it stuck. Get one wrong and it links straight back to the page that teaches it. Nothing leaves your device and no score is kept anywhere; this is for you, not for anyone to see.',
    id: 'soal-soal yang memperlihatkan bedanya pernah membaca sesuatu dengan benar-benar menguasainya — sebuah halaman bisa terasa familier padahal tak ada yang tersangkut. Salah satu soal, dan ia langsung menautkan Anda ke halaman yang mengajarkannya. Tak ada yang keluar dari perangkat Anda dan tak ada nilai yang disimpan di mana pun; ini untuk Anda sendiri, bukan untuk dilihat siapa pun.',
  },
  lab: {
    en: 'for learning by watching rather than reading. Each experiment states a claim — say, that tightening the budget should favour a simpler build — then loads a ready-made project into the real Advisor so you can change one answer and watch the ranking move. It is the same engine that produces your own recommendation, not a demonstration made to agree with the claim.',
    id: 'untuk belajar dengan mengamati, bukan membaca. Tiap eksperimen menyatakan sebuah klaim — misalnya, bahwa mengetatkan anggaran mestinya menguntungkan bangunan yang lebih sederhana — lalu memuat proyek siap pakai ke Advisor sungguhan sehingga Anda bisa mengubah satu jawaban dan melihat peringkatnya bergerak. Mesinnya sama dengan yang menghasilkan rekomendasi Anda sendiri, bukan peragaan yang dibuat supaya klaimnya terbukti.',
  },
};
