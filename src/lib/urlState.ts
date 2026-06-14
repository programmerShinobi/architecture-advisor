import type { ScenarioState } from './scenarioIO';

// Share-via-URL: the full scenario is encoded in the URL hash so a link reproduces the exact
// state (Build Spec Section 2 / AC-14). On load we hydrate localStorage from the hash, then
// strip it, so the normal persisted-state hooks pick the values up.

const PREFIX = '#s=';

// localStorage keys, kept in sync with the usePersistedState calls in App/contexts.
const KEYS = {
  mode: 'aa.mode',
  lang: 'aa.lang',
  levels: 'aa.levels',
  selections: 'aa.selections',
  overrides: 'aa.overrides',
} as const;

const toB64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const fromB64 = (b: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(b), (c) => c.charCodeAt(0)));

export function buildShareUrl(state: ScenarioState): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}${PREFIX}${toB64(JSON.stringify(state))}`;
}

/**
 * If the URL hash carries a shared scenario, write it into localStorage and remove the hash.
 * Returns true if state was applied. Call once before the app mounts.
 */
export function hydrateFromUrl(): boolean {
  const hash = window.location.hash;
  if (!hash.startsWith(PREFIX)) return false;
  try {
    const state = JSON.parse(fromB64(hash.slice(PREFIX.length))) as ScenarioState;
    if (state.v !== 1) return false;
    localStorage.setItem(KEYS.mode, JSON.stringify(state.mode));
    localStorage.setItem(KEYS.lang, JSON.stringify(state.lang));
    localStorage.setItem(KEYS.levels, JSON.stringify(state.levels));
    localStorage.setItem(KEYS.selections, JSON.stringify(state.selections));
    localStorage.setItem(KEYS.overrides, JSON.stringify(state.overrides ?? {}));
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  } catch {
    return false;
  }
}
