// Single source for the deployed site's origin + base path. Kept in one place so canonical URLs,
// sitemaps, and share links never hardcode the domain — future custom-domain safe. The base path
// must match Vite's `base` and the GitHub Pages project path.

export const SITE_BASE = '/architecture-advisor/';

export const SITE_URL = 'https://programmershinobi.github.io/architecture-advisor/';

/** Absolute URL for an in-app path (e.g. absoluteUrl('catalog/foo') → SITE_URL + 'catalog/foo'). */
export function absoluteUrl(path = ''): string {
  return SITE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
