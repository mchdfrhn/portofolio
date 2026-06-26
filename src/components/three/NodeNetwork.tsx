/**
 * AmbientShapes — Minimal floating translucent geometry.
 * 3 shapes: solid semi-transparent + wireframe overlay for depth.
 * Positioned in background, no text overlap.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingShape({
  position,
  rotationSpeed,
  color,
  solidOpacity,
  wireOpacity,
  scale = 1,
  children,
}: {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  color: string;
  solidOpacity: number;
  wireOpacity: number;
  scale?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += rotationSpeed[0] * delta;
    ref.current.rotation.y += rotationSpeed[1] * delta;
    ref.current.rotation.z += rotationSpeed[2] * delta;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Solid translucent fill */}
      <mesh>
        {children}
        <meshBasicMaterial
          color={color}
          transparent
          opacity={solidOpacity}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        {children}
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={wireOpacity}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function NodeNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x: tx, y: ty } = state.pointer;
    const rx = (ty * Math.PI) / 30;
    const ry = (tx * Math.PI) / 30;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rx, 0.03);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, ry, 0.03);
    groupRef.current.rotation.y += 0.0004;
  });

  return (
    <group ref={groupRef}>
      {/* Icosahedron — top-right, blue */}
      <FloatingShape
        position={[2.8, 1.2, -1]}
        rotationSpeed={[0.12, 0.18, 0.05]}
        color="#38BDF8"
        solidOpacity={0.04}
        wireOpacity={0.2}
        scale={1.6}
      >
        <icosahedronGeometry args={[1, 1]} />
      </FloatingShape>

      {/* Torus — bottom-left, purple */}
      <FloatingShape
        position={[-2.8, -1.5, 0.5]}
        rotationSpeed={[0.1, -0.15, 0.08]}
        color="#A78BFA"
        solidOpacity={0.03}
        wireOpacity={0.18}
        scale={1.3}
      >
        <torusGeometry args={[0.8, 0.28, 12, 32]} />
      </FloatingShape>

      {/* Octahedron — center-right low, cyan */}
      <FloatingShape
        position={[0.8, -2.2, -0.5]}
        rotationSpeed={[-0.08, 0.12, -0.1]}
        color="#22D3EE"
        solidOpacity={0.03}
        wireOpacity={0.15}
        scale={1.1}
      >
        <octahedronGeometry args={[0.9, 0]} />
      </FloatingShape>
    </group>
  );
}
