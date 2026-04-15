# 📱 frhn.dev - Mobile-First Vibe Coder Portfolio

A modern, high-performance portfolio built with **Astro**, **React**, **Tailwind CSS**, and premium animations. Mobile-first design with smooth scrolling, adaptive theming, and optimized build pipeline.

## ✨ Features

- **Mobile-First Design**: Progressive enhancement from mobile baseline to desktop
- **Zero-JS by Default**: Astro SSG for lightning-fast static site generation
- **React Islands**: Interactive components (Theme Toggle, Navbar, Projects) only when needed
- **Premium Animations**: GSAP + Splitting.js for text animations
- **Smooth Scrolling**: Lenis + ScrollTrigger for gesture-native scroll experience
- **Adaptive Theming**: Dark/Light/Auto theme with flicker-free initialization
- **Responsive Layouts**: Tailwind CSS with mobile-first utility classes
- **Docker Ready**: Multi-stage build for production deployment

## 🛠 Tech Stack

| Technology         | Purpose                             |
| ------------------ | ----------------------------------- |
| **Astro 5**        | SSG framework with zero-JS default  |
| **React 19**       | Interactive UI components (islands) |
| **Tailwind CSS 3** | Mobile-first utility styling        |
| **GSAP 3**         | High-end motion graphics            |
| **Lenis 1**        | Gesture-native smooth scrolling     |
| **Splitting.js**   | Text animation support              |
| **TypeScript**     | Type-safe development               |
| **Tailwind UI**    | Premium UI components               |

## 📁 Project Structure

```text
src/
├── components/
│   ├── Hero.astro              # Hero section with text animations
│   ├── AboutBento.astro        # Bento grid about section
│   ├── Projects.tsx            # Portfolio projects showcase
│   ├── Experience.astro        # Experience timeline
│   ├── Navbar.tsx              # Navigation with theme toggle
│   ├── Footer.astro            # Footer with social links
│   ├── SmoothScroll.astro      # Lenis + ScrollTrigger setup
│   ├── Contact.astro           # Contact form
│   ├── StackMarquee.astro      # Tech stack marquee
│   ├── ThemeToggle.tsx         # Dark/light theme switcher
│   └── ui/                     # Reusable UI components
├── layouts/
│   └── Layout.astro            # Base layout with theme initialization
├── pages/
│   └── index.astro             # Homepage
├── lib/
│   └── config.ts               # Configuration from .env
└── styles/
    └── globals.css             # Global design tokens

public/
└── [static assets]
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mchdfrhn/my-portofolio.git
   cd my-portofolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your personal info
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:4321`

## 📋 Available Commands

| Command           | Action                             |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start dev server with hot reload   |
| `npm run build`   | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally   |
| `npm run astro`   | Run Astro CLI commands             |

## 🐳 Docker Deployment

### Production Build

```bash
# Build Docker image
docker build -t frhn-portfolio .

# Run container
docker run -p 80:80 frhn-portfolio
```

Visit `http://localhost`

### Development with Docker

For future multi-service setups (frontend + backend), use Docker Compose:

```bash
docker-compose up
```

## 🎨 Configuration

### Environment Variables

Create `.env` file with:

```env
PUBLIC_SITE_TITLE=frhn.dev
PUBLIC_SITE_DESCRIPTION=Your description
PUBLIC_OG_IMAGE=/og-image.png
PUBLIC_GITHUB_URL=https://github.com/your-username
PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-username
PUBLIC_EMAIL=you@example.com
```

See `.env.example` for template.

### Theme System

Theme is managed via:

1. **Initialization**: Blocking script in `<head>` reads localStorage/prefers-color-scheme
2. **Toggle**: `ThemeToggle` component in Navbar
3. **Persistence**: localStorage

## 📊 Performance

- **Zero-JS by default**: Only ship interactive components when needed
- **Pre-rendered HTML**: All pages static HTML
- **Mobile-first CSS**: Minimal baseline, progressive enhancement
- **Optimized assets**: Adaptive loading for images

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions, including:

- Mobile-first system design
- Adaptive theming implementation
- Smooth scrolling integration
- Build & optimization pipeline

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and adapt for your own use.

## 📝 License

MIT License - feel free to use this as a template for your portfolio.

## 🔗 Links

- **Portfolio**: https://frhn.dev
- **GitHub**: https://github.com/mchdfrhn
- **LinkedIn**: https://www.linkedin.com/in/mchdfrhn
- **Email**: mochamadfarhanali@gmail.com
- **Contact**: https://api.whatsapp.com/send/?phone=6285771826637&text&type=phone_number&app_absent=0