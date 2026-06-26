# Portfolio Revamp Blueprint

## Timeline

**[FASE 0: FIX & FOUNDATION]** ──> **[FASE 1: MOTION FOUNDATION]** ──> **[FASE 2: HERO CINEMATIC (R3F)]** ──> **[FASE 3: STORYTELLING]** ──> **[FASE 4: QA & PERF]**
(2-3 Hari)                     (1 Minggu)                     (2 Minggu)                     (1 Minggu)                 (3-5 Hari)


---

### FASE 0: Fix & Foundation (Estimasi: 2-3 Hari)

Fokus: membersihkan technical debt dasar dan menyiapkan pondasi arsitektur performa.

* **Hotfix Metadata & SEO:**
  * Mutasi `og:url` dan `og:image` dari relative path/localhost menjadi absolute production URL.
  * Implementasi `<link rel="canonical" href="..." />` dinamis di setiap rute Astro.
* **Audit Baseline Lighthouse:**
  * Ambil metrik awal Core Web Vitals (LCP, FID/INP, CLS) menggunakan Lighthouse di mode incognito.
* **Strategi Aksesibilitas (`prefers-reduced-motion`):**
  * Bangun arsitektur utility CSS / wrapper JS yang mendeteksi preferensi pengguna sejak awal.
  * Jika user mengaktifkan pembatasan animasi di level OS, seluruh engine GSAP dan R3F harus dimatikan secara elegan.

### FASE 1: Motion Foundation — Lenis + GSAP (Estimasi: 1 Minggu)

Mengubah scroll behavior dari navigasi bawaan browser menjadi gerakan linier yang terprediksi dan elastis.

* **Integrasi Sinkronisasi Ticker:**
  Satukan siklus hidup Lenis dan GSAP ke dalam satu ticker bawaan GSAP.
* **Implementasi pada Komponen Astro:**
  ```javascript
  import Lenis from 'lenis';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const initSmoothScroll = () => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);
  };

  document.addEventListener('astro:page-load', () => {
    initSmoothScroll();
  });
  ```
* **ScrollTrigger Per-Section:**
  * **Hero Section:** Pinned section + staggered text reveal.
  * **About Section:** Stat counter animasi.
  * **Projects Section:** Stagger + scale-in + parallax image.
  * **Section Transitions:** Background gradient shift berdasarkan scroll progress.

> **Astro Islands Warning:** GSAP wajib dikelola per komponen island via `gsap.context()`. Destroy dan cleanup via `astro:before-swap` / `astro:page-load`.

### FASE 2: R3F + Drei di Hero Section (Estimasi: 2 Minggu)

3D hanya pada satu pulau React terisolasi di Hero Section dengan `client:only="react"`.

* **Konsep Visual — "System & Architecture Node Network":**
  Representasi abstrak scalable backend architecture. Node-network / jalur sirkuit geometris abstrak dengan partikel bercahaya yang merespons kursor mouse.
* **Cinematic Lerp Interpolation:**
  ```jsx
  import React, { useRef } from 'react';
  import { useFrame } from '@react-three/fiber';
  import * as THREE from 'three';

  export function CinematicMesh() {
    const meshRef = useRef();

    useFrame((state, delta) => {
      const { x: targetX, y: targetY } = state.pointer;
      const rotationTargetX = (targetY * Math.PI) / 20;
      const rotationTargetY = (targetX * Math.PI) / 20;

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x, rotationTargetX, 0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y, rotationTargetY, 0.05
      );
    });

    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#0055ff" wireframe />
      </mesh>
    );
  }
  ```
* **Drei Helpers:**
  * `<Float />` — idle bobbing natural.
  * `<Environment />` — image-based lighting instan.
  * `<MeshDistortMaterial />` — liquid glass / organic abstract.
* **Scroll-Linked Transformation:**
  Morphing geometry / shattered matrix saat scroll ke section "Expertise".
* **Fail-Safe & Heuristic Fallback (Wajib):**
  Deteksi WebGL + deviceMemory >= 4GB + hardwareConcurrency >= 4. Gagal → CSS animasi / gradasi statis.

### FASE 3: Polish & Storytelling (Estimasi: 1 Minggu)

* **Reactive Custom Cursor:**
  Kursor custom berbasis DOM, responsive di area interaktif 3D / kartu proyek.
* **Restrukturisasi Presentasi Proyek:**
  Horizontal scroll-snap GSAP atau pinned card showcase.
* **Deep Dive Interactive Case Study (SIPEKAD):**
  * Diagram perbandingan arsitektur before/after.
  * Visualisasi interaktif load balancing simulation.

### FASE 4: Performance Optimization & QA (Estimasi: 3-5 Hari)

* **Code-Splitting & Lazy Loading:**
  Dynamic code splitting untuk three.js / R3F / drei. IntersectionObserver untuk lazy load.
* **Target Metrik & Kompresi Aset:**
  Lighthouse 90+. Draco Compression untuk model 3D (target < 500kb). Primitif geometri bawaan.
* **Mobile Experience QA:**
  R3F OFF di bawah 768px. Ganti dengan CSS transitions / Lottie JSON.

---

## 2. MANIFESTO DEPENDENSI

```json
{
  "dependencies": {
    "@react-three/drei": "^9.0.0",
    "@react-three/fiber": "^8.0.0",
    "gsap": "^3.12.0",
    "lenis": "^1.1.0",
    "three": "^0.160.0"
  }
}
```

GSAP ScrollTrigger: gratis untuk non-komersial.

---

## 3. REKOMENDASI TAMBAHAN

1. **The Architecture Simulator (SIPEKAD Deep-Dive):** Slider interaktif simulasi "Beban Trafik vs Respon Server".
2. **Deterministic Debugger Mode:** Toggle bounding box, FPS monitor, GSAP context log.
3. **The Chrono-History Scroll:** Transisi warna latar berbasis ScrollTrigger merefleksikan maturitas karir.
