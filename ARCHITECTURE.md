# Architecture & Design Notes

## Concept: "public works"

Most of what Farhan builds is software for public institutions: an academic system for STT Pekerjaan Umum and an HR system for Pusdatin, Kementerian Pekerjaan Umum. The site borrows from the visual language of public-works engineering drawings instead of generic developer-portfolio patterns.

- **Drafting paper and ink.** Warm off-white background with a faint 24px grid, near-black text. Dark mode is the same drawing at night.
- **One accent.** Safety orange (`--primary`), used for numbers, links on hover, and selection. No gradients and no second accent colour.
- **Sheets.** Each section is a numbered "sheet" (`01 ABOUT`, `02 SELECTED WORK`, …) with a ruled label, rendered by `Sheet.astro`.
- **Title block.** The footer is drawn as the title block in the corner of an engineering drawing. This is the site's one signature detail; don't add others.

### Rules

1. Character comes from content and consistent choices, not from effects. Don't add loaders, custom cursors, marquees, scroll-jacking, 3D scenes, glow buttons, or bento grids.
2. Motion is limited to colour transitions and a slight image zoom on hover. `prefers-reduced-motion` disables both.
3. Copy is first person and specific. Numbers must be ones Farhan can defend in an interview.

## Typography

| Role | Font | Usage |
| --- | --- | --- |
| Display | Instrument Serif | `h1`, section sub-headings, project titles |
| Body | IBM Plex Sans | paragraphs, UI |
| Annotation | IBM Plex Mono | labels, periods, tech lists, sheet numbers |

## Layout

Single column, `max-w-3xl`, sticky header. Order: Intro → About (story, how I work, toolbox, commit log) → Selected work → Experience → Contact → title-block footer.

Each project also gets a pre-rendered case study page at `/projects/[slug]`, built from the `problem`, `solution`, and `impact` fields in `content/projects/*.yaml`.

## Bilingual content and theming

- `Bi.astro` renders both languages: `<span data-lang="en">` and `<span data-lang="id">`.
- An inline script in `Layout.astro` reads `localStorage` before paint and sets `.dark` and `.lang-id` on `<html>`. CSS in `globals.css` hides the inactive language.
- The header toggles flip those classes, persist them, and dispatch a `languagechange` event that the GitHub calendar island listens for.

## Content

All content lives in `content/` as YAML and is read at build time through `src/lib/reader.ts` (Keystatic). The same data feeds the CV PDFs (`src/lib/cv-data.ts`, `src/lib/cv-pdf.ts`).
