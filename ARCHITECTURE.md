# Architecture & Design Notes

## Concept: "public works"

Most of what Farhan builds is software for public institutions: an academic system for STT Pekerjaan Umum and an HR system for Pusdatin, Kementerian Pekerjaan Umum. The site borrows from the visual language of public-works engineering drawings instead of generic developer-portfolio patterns.

- **Drafting paper and ink.** Warm off-white background with a faint 24px grid, near-black text. Dark mode is the same drawing at night.
- **One accent.** Safety orange (`--primary`), used for numbers, links on hover, and selection. No gradients and no second accent colour.
- **Sheets.** Each section is a numbered "sheet" (`01 ABOUT`, `02 SELECTED WORK`, …) with a ruled label, rendered by `Sheet.astro`.
- **Title block.** The footer is drawn as the title block in the corner of an engineering drawing. This is the site's one signature detail; don't add others.

### Rules

1. Character comes from content and consistent choices, not from effects. Don't add loaders, custom cursors, marquees, scroll-jacking, 3D scenes, glow buttons, or bento grids.
2. Motion follows the drawing-set idea: rules draw like a plotter pen, headings set in word by word, blocks and image frames settle in once as they scroll into view, a hairline in the header tracks scroll progress, filter changes slide cards into place, and a project card's image and title morph into its case study (native cross-document View Transitions). Each piece plays once and never blocks reading. No scroll-jacking, pinning, parallax or looping motion. It lives in `src/scripts/motion.ts` (GSAP: ScrollTrigger, SplitText, Flip) and is driven by `data-m-*` attributes. `prefers-reduced-motion` turns all of it off and shows the content as-is, and content stays visible if the script fails to load.
3. Copy is first person and specific. Numbers must be ones Farhan can defend in an interview.

## Typography

| Role | Font | Usage |
| --- | --- | --- |
| Display | Instrument Serif | `h1`, section sub-headings, project titles |
| Body | IBM Plex Sans | paragraphs, UI |
| Annotation | IBM Plex Mono | labels, periods, tech lists, sheet numbers |

## Layout

Single column, `max-w-3xl`, sticky header. Order: Intro → About (story, how I work, toolbox, commit log) → Selected work (a gallery of the first 4 projects by `order`, linking to `/projects`) → Experience → Contact → title-block footer.

`/projects` is the archive: every project as a card, with a tag filter (`?tag=`). The tag list is fixed in `src/lib/tags.ts` and feeds both the Keystatic "Tags" field and the filter chips; add a tag there once and it is available in both. The filter is a small inline script and the page still shows every project without JS.

Each project also gets a pre-rendered case study page at `/projects/[slug]`, built from the `problem`, `solution`, and `impact` fields in `content/projects/*.yaml`.

## Bilingual content and theming

- `Bi.astro` renders both languages: `<span data-lang="en">` and `<span data-lang="id">`.
- An inline script in `Layout.astro` reads `localStorage` before paint and sets `.dark` and `.lang-id` on `<html>`. CSS in `globals.css` hides the inactive language.
- The header toggles flip those classes, persist them, and dispatch a `languagechange` event that the GitHub calendar island listens for.

## Content

All content about the person lives in `content/` as YAML and is read at build time through `src/lib/reader.ts` (Keystatic): `profile` (identity, links, contact, site description), `hero`, `about`, `contact`, `cv` (skills for the CV PDF), and the `projects`, `experience`, `expertise` collections. UI chrome (nav, buttons, form status text) stays in the components on purpose. Only `SITE_URL` and `OG_IMAGE` come from env (`src/lib/config.ts`). The same data feeds the CV PDFs (`src/lib/cv-data.ts`, `src/lib/cv-pdf.ts`).

Project images are uploaded by Keystatic into `src/assets/projects/<slug>/` (not `public/`), so Astro's `<Image>` can resize them and serve WebP at the width each slot needs. YAML stores them as `/src/assets/projects/...`; `src/lib/images.ts` turns that path into the optimised image, and `src/lib/asset-path.ts` still accepts the old `/images/projects/...` form.
