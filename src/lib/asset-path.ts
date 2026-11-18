// Project images live in src/assets/projects so Astro can optimise them.
// Keystatic stores them as "/src/assets/projects/<slug>/...". Older content
// may still say "/images/projects/<slug>/..." (the former public/ folder).
export const PROJECT_ASSET_DIR = '/src/assets/projects/'
const LEGACY_PUBLIC_DIR = '/images/projects/'

/** Normalise a stored image path to its import.meta.glob key. */
export function toAssetKey(path: string | null | undefined): string {
  const p = (path ?? '').trim()
  if (p.startsWith(LEGACY_PUBLIC_DIR)) return PROJECT_ASSET_DIR + p.slice(LEGACY_PUBLIC_DIR.length)
  return p
}
