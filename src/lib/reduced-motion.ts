/**
 * Centralized prefers-reduced-motion utility.
 * 
 * The early inline script in Layout.astro sets `html.reduced-motion` before paint.
 * This module provides a JS hook for React/Astro components.
 */

declare global {
  interface Window {
    __reducedMotion: boolean;
  }
}

/** Check if user prefers reduced motion. Safe on server (returns false). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.__reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
