/**
 * WebGL + hardware capability detection.
 * Returns true if the device can handle R3F scenes.
 * ponytail: basic heuristic — upgrade to GPU benchmark if needed.
 */

export function canRunR3F(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
  } catch {
    return false;
  }

  // 2. Check device memory (min 4GB)
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;

  // 3. Check logical processors (min 4 cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;

  // 4. Check mobile viewport (< 768px → skip R3F)
  if (window.innerWidth < 768) return false;

  // 5. Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  return true;
}
