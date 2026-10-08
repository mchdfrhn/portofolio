# Mochammad Farhan Ali — Portfolio

Portfolio of Mochammad Farhan Ali, Fullstack Developer. Built with **Astro**, **Tailwind CSS**, and **Keystatic** for content. Design notes live in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Features

- **Mostly zero-JS**: every section is a static Astro component; the only React island is the GitHub contribution calendar
- **Case study pages**: one pre-rendered page per project at `/projects/[slug]`
- **Bilingual (EN/ID)**: both languages render server-side; a class on `<html>` picks one before paint
- **Light/dark theme**: applied before paint, no flash
- **CMS-driven content**: profile, experience, expertise, and projects are YAML files under `content/`, editable via Keystatic in dev
- **CV as PDF**: `/cv-en.pdf` and `/cv-id.pdf` are generated from the same content with pdfkit

## Tech Stack

| Technology         | Purpose                               |
| ------------------ | ------------------------------------- |
| **Astro 5**        | Framework, static + server rendering  |
| **Tailwind CSS 3** | Styling via design tokens             |
| **Keystatic**      | Local, Git-based content editing      |
| **React 19**       | GitHub calendar island                |
| **pdfkit**         | CV PDF generation                     |
| **Resend**         | Contact form email delivery           |
| **TypeScript**     | Type-safe development                 |

## Project Structure

```text
content/                        # YAML content (Keystatic)
src/
├── components/
│   ├── site/                   # Page sections: Header, Intro, About, Work, Experience, Contact, Footer
│   └── GithubActivity.tsx      # Contribution calendar (React island)
├── layouts/Layout.astro        # <head>, theme + language bootstrap
├── lib/                        # Content reader, CV data + PDF builder, config
├── pages/
│   ├── index.astro             # Homepage
│   ├── projects/[slug].astro   # Case study pages
│   ├── cv-{en,id}.pdf.ts       # CV PDFs
│   └── api/contact.ts          # Contact form endpoint
└── styles/globals.css          # Design tokens
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mchdfrhn/portofolio.git
   cd portofolio
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
PUBLIC_SITE_TITLE=Mochammad Farhan Ali
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
2. **Toggle**: button in `src/components/site/Header.astro`
3. **Persistence**: localStorage

## 📊 Performance

- **Zero-JS by default**: Only ship interactive components when needed
- **Pre-rendered HTML**: All pages static HTML
- **Mobile-first CSS**: Minimal baseline, progressive enhancement
- **Optimized assets**: Adaptive loading for images

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions, including:

- The "public works" design concept
- Colour, type, and layout rules
- How bilingual content and theming work

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and adapt for your own use.

## 📝 License

MIT License - feel free to use this as a template for your portfolio.

## 🔗 Links

- **Portfolio**: https://www.mochamadfarhanali.my.id
- **GitHub**: https://github.com/mchdfrhn
- **LinkedIn**: https://www.linkedin.com/in/mchdfrhn
- **Email**: mochamadfarhanali@gmail.com
- **Contact**: https://api.whatsapp.com/send/?phone=6285771826637&text&type=phone_number&app_absent=0