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
// `available` gates which sections are surfaced in the current rollout (Wave A = catalog, playbook,
// review). Deferred sections stay defined here so the type is complete but are not shown until built.

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
  { id: 'library', icon: IconBooks, label: 'section.library', desc: 'section.library.desc', available: false },
  { id: 'roadmap', icon: IconMap2, label: 'section.roadmap', desc: 'section.roadmap.desc', available: false },
  { id: 'academy', icon: IconSchool, label: 'section.academy', desc: 'section.academy.desc', available: false },
  { id: 'lab', icon: IconFlask, label: 'section.lab', desc: 'section.lab.desc', available: false },
];

export const AVAILABLE_SECTIONS = SECTIONS.filter((s) => s.available);

export function sectionMeta(id: SectionId): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === id);
}
