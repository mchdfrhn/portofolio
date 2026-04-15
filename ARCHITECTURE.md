# 📱 Architecture Design: Mobile-First Vibe Coder Portfolio

This document outlines the architectural decisions focusing on **Mobile-First Design**, performance, and a premium adaptive aesthetic for the **Vibe Coder** portfolio.

## 🚀 1. Mobile-First System Design

The application follows a strictly mobile-first approach. All layouts are designed for small viewports as the "baseline," with progressive enhancement (Astro Islands) and layout expansion (Tailwind Breakpoints) for larger screens.

```mermaid
graph TD
    A[Astro Router] --> B{Mobile-First Layout}
    B --> C[Core Content (Stacked)]
    B --> D[React Islands]
    
    C --> C1[Hero (Text-First)]
    C --> C2[Bento Grid (Auto-Reflow)]
    C --> C3[Experience Timeline]
    
    D --> D1[Adaptive Theme System]
    D --> D2[Interactive Mobile Menu]
    D --> D3[Premium Animations]
    
    subgraph "Progressive Enhancement"
        C
        D
    end
```

---

## 🛠️ 2. Core Technology Stack

| Technology | Purpose | Rationale |
| :--- | :--- | :--- |
| **Astro v5** | SSG Framework | Zero-JS by default for lightning-fast mobile loads. |
| **React 19** | Adaptive UI | used for the Theme Toggle and the Mobile Navigation. |
| **Tailwind CSS** | Styling | **Mobile-First Utility Classes** (e.g., `grid-cols-1 md:grid-cols-3`). |
| **GSAP & Splitting** | High-End Motion | Precise entrance animations synchronized with smooth scrolling. |
| **Lenis & ScrollTrigger**| Gesture-First Scroll | Professional smooth scrolling that works natively with touch. |
| **Simple Icons** | Official Branding | Crisp, high-fidelity SVGs for the Tech Stack marquee. |

---

## 🌓 3. Adaptive Theming System

The portfolio implements a robust **Dark/Light/Auto** theme system:
1.  **Flicker-Free Initialization**: A blocking `is:inline` script in the HTML `<head>` reads `localStorage` or `prefers-color-scheme` *before* the first paint.
2.  **State Management**: Theme persistence is handled via `localStorage` to ensure a consistent experience across sessions.
3.  **UI/UX Integration**: A dedicated `ThemeToggle` component in the Navbar provides a seamless bridge between user preferences.

---

## 📁 4. Project Organization

```text
src/
├── components/
│   ├── theme/          # Theme switching logic and UI
│   ├── ui/             # Mobile-optimized primitives
│   ├── AboutBento.astro # Bento grid with fluid auto-rows
│   └── SmoothScroll.astro # Global scroll & animation proxy
├── layouts/
│   └── Layout.astro    # Base HTML with Theme-Blocking script
├── pages/
│   └── index.astro     # Mobile-first section stacking
└── styles/
    └── globals.css     # Design tokens with HSL theme overrides
```

---

## ✨ 5. Engineering Patterns (Mobile Focus)

### 🍱 Responsive Bento Grid
Our bento layouts use `grid-cols-1` for mobile and only expand to `md:grid-cols-2` or `md:grid-cols-3` once screen space permits. Rows use `auto-rows` with minimum height constraints instead of fixed pixels.

### 📜 Touch-Native Scrolling
Animations are specifically adjusted for touch gestures using Lenis's `touchMultiplier`, ensuring that GSAP triggers feel responsive and fluid on mobile browsers.

---

## 🏗️ 6. Build & Optimization pipeline

1. **JIT Compilation**: Only shipping the minimal required mobile-first CSS.
2. **Pre-Rendering**: All pages are pre-rendered to static HTML for instant mobile access.
3. **Asset Optimization**: Adaptive loading for images where necessary (WebP/AVIF).

---

> [!IMPORTANT]
> **Mobile-First Mantra**: If it doesn't look stunning on a phone, it shouldn't be on the portfolio. Standard desktop-to-mobile conversion is prohibited; all features must be conceived mobile-first.
