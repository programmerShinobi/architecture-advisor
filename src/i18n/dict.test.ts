import { describe, it, expect } from 'vitest';
import { DICT } from './dict';

// AC-13 (build spec §14): the language toggle must update ALL strings — so every UI key must
// have a non-empty English AND Indonesian value. This guards against a missing translation.
describe('i18n dictionary completeness', () => {
  it('every key has a non-empty en and id', () => {
    const broken: string[] = [];
    for (const [key, val] of Object.entries(DICT)) {
      if (!val.en || !val.en.trim()) broken.push(`${key}.en`);
      if (!val.id || !val.id.trim()) broken.push(`${key}.id`);
    }
    expect(broken).toEqual([]);
  });
});
