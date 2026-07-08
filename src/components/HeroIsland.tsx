/**
 * HeroIsland — R3F island with hardware detection + CSS fallback.
 * Used with client:only="react" in Astro.
 * ponytail: CSS fallback is a gradient orb animation. Upgrade to Lottie for richer fallback.
 */

import React, { useEffect, useState } from 'react';
import { canRunR3F } from '@/lib/webgl-detect';

/* ── CSS Fallback: animated gradient orbs ── */
function CSSFallback() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          top: '10%',
          right: '10%',
          background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-float-1 18s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-15"
        style={{
          bottom: '20%',
          left: '15%',
          background: 'radial-gradient(ellipse, rgba(96, 165, 250, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-float-2 22s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}

/* ── Lazy-loaded R3F Canvas ── */
function LazyCanvas() {
  const [HeroCanvas, setHeroCanvas] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamic import — only loads when component mounts (after hardware check passes)
    import('./three/HeroCanvas').then((mod) => {
      setHeroCanvas(() => mod.HeroCanvas);
    });
  }, []);

  if (!HeroCanvas) return <CSSFallback />;
  return <HeroCanvas />;
}

/* ── Main export: detection gate ── */
export function HeroIsland() {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShouldRender3D(canRunR3F());
    setChecked(true);
  }, []);

  // During SSR / before check: show fallback
  if (!checked) return <CSSFallback />;

  return shouldRender3D ? <LazyCanvas /> : <CSSFallback />;
}
