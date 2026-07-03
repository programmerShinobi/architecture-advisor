import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from './frontmatter';

// The dependency-free frontmatter parser must handle exactly the shapes content uses: scalars,
// inline arrays, one nested map (related_advisor), and a list of flow maps (sources).
describe('parseFrontmatter', () => {
  const sample = `---
title_id: "Judul"
title_en: Title
slug: my-slug
audience: [awam, expert]
related_advisor:
  dimensions: [D1, D3]
  options: [monolith, microservices]
sources:
  - { label: "Newman", venue: "O'Reilly", year: 2021, url: "https://example.com/x" }
  - { label: "Fowler", venue: "mf.com", year: 2015, url: "https://example.com/y" }
status: published
---
# Body heading

Some **body** text.`;

  it('parses scalars, quoted and unquoted', () => {
    const { data } = parseFrontmatter(sample);
    expect(data.title_id).toBe('Judul');
    expect(data.title_en).toBe('Title');
    expect(data.slug).toBe('my-slug');
    expect(data.status).toBe('published');
  });

  it('parses inline arrays', () => {
    const { data } = parseFrontmatter(sample);
    expect(data.audience).toEqual(['awam', 'expert']);
  });

  it('parses a nested map with inline arrays', () => {
    const { data } = parseFrontmatter(sample);
    expect(data.related_advisor).toEqual({
      dimensions: ['D1', 'D3'],
      options: ['monolith', 'microservices'],
    });
  });

  it('parses a list of flow maps', () => {
    const { data } = parseFrontmatter(sample);
    const sources = data.sources as Record<string, unknown>[];
    expect(sources).toHaveLength(2);
    expect(sources[0]).toEqual({ label: 'Newman', venue: "O'Reilly", year: '2021', url: 'https://example.com/x' });
  });

  it('returns the body after the frontmatter block', () => {
    const { body } = parseFrontmatter(sample);
    expect(body.startsWith('# Body heading')).toBe(true);
    expect(body).toContain('Some **body** text.');
  });

  it('treats a file with no frontmatter as all body', () => {
    const { data, body } = parseFrontmatter('no frontmatter here');
    expect(data).toEqual({});
    expect(body).toBe('no frontmatter here');
  });
});
