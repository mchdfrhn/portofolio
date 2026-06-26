/**
 * HeroCanvas — Lean R3F Canvas for ambient geometry.
 * No Float/Environment overhead. Just shapes + ambient light.
 */

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { NodeNetwork } from './NodeNetwork';

export function HeroCanvas() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <NodeNetwork />
      </Canvas>
    </div>
  );
}
