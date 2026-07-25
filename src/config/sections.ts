import {
  IconBooks,
  IconClipboardCheck,
  IconLayoutGrid,
  IconMap2,
  IconFlask,
  IconSchool,
  IconNotebook,
  type Icon,
} from '@tabler/icons-react';
import type { DictKey } from '../i18n/dict';
import type { SectionId } from './contentSchema';

// The content sections and their presentation. Labels live in src/i18n (label/desc are DictKeys);
// `available` gates which sections are surfaced. All seven are live as of Wave C (2026-07):
// the four architecture lenses plus Roadmap (learning paths), Academy (quizzes), Lab (sandboxes).

export interface SectionMeta {
  id: SectionId;
  icon: Icon;
  label: DictKey;
  desc: DictKey;
  available: boolean;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'catalog', icon: IconLayoutGrid, label: 'section.catalog', desc: 'section.catalog.desc', available: true },
  { id: 'playbook', icon: IconNotebook, label: 'section.playbook', desc: 'section.playbook.desc', available: true },
  { id: 'review', icon: IconClipboardCheck, label: 'section.review', desc: 'section.review.desc', available: true },
  { id: 'library', icon: IconBooks, label: 'section.library', desc: 'section.library.desc', available: true },
  { id: 'roadmap', icon: IconMap2, label: 'section.roadmap', desc: 'section.roadmap.desc', available: true },
  { id: 'academy', icon: IconSchool, label: 'section.academy', desc: 'section.academy.desc', available: true },
  { id: 'lab', icon: IconFlask, label: 'section.lab', desc: 'section.lab.desc', available: true },
];

export const AVAILABLE_SECTIONS = SECTIONS.filter((s) => s.available);

/**
 * The two kinds of section, made explicit for the Insights landing.
 *
 * Catalog / Playbook / Review / Library are FOUR ANGLES ON THE SAME 21 ARCHITECTURES — the same
 * subject read four ways, not four separate libraries. Roadmap / Academy / Lab are activities you
 * do. Presenting all seven as one flat grid hid that boundary and made the tab look like seven
 * bodies of material to get through, which is both wrong and discouraging.
 */
export interface SectionGroup {
  id: 'lenses' | 'practice';
  label: DictKey;
  desc: DictKey;
  ids: SectionId[];
}

export const SECTION_GROUPS: SectionGroup[] = [
  { id: 'lenses', label: 'learn.group.lenses', desc: 'learn.group.lenses.desc', ids: ['catalog', 'playbook', 'review', 'library'] },
  { id: 'practice', label: 'learn.group.practice', desc: 'learn.group.practice.desc', ids: ['roadmap', 'academy', 'lab'] },
];

/**
 * "Open this when…" — one line per section naming the SITUATION it answers.
 *
 * The `desc` fields say what a section contains; that is not the question a person on this page is
 * asking. They are asking which one to click, and that is decided by what they are trying to do
 * right now, so these are phrased as circumstances rather than contents.
 */
export const SECTION_WHEN: Record<SectionId, DictKey> = {
  catalog: 'learn.when.catalog',
  playbook: 'learn.when.playbook',
  review: 'learn.when.review',
  library: 'learn.when.library',
  roadmap: 'learn.when.roadmap',
  academy: 'learn.when.academy',
  lab: 'learn.when.lab',
};

export function sectionMeta(id: SectionId): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === id);
}
