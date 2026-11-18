# Projects gallery — design

Date: 2026-11-18 · Size: small-to-medium change (short design)

## Intent and why

The "Selected work" section is a vertical list where every project takes a full block (16:9 image, tagline, impact, tech, links). With 6 projects the homepage is already long, and the list will keep growing. Goal: the homepage stays short no matter how many projects exist, and visitors can still browse everything.

## Goals

- Homepage "Selected work" becomes a compact gallery of 4 projects, then a link to the full archive.
- New `/projects` page: gallery of all projects with a tag filter.
- Adding a project in Keystatic needs no code change (it appears in both places automatically).

## Non-goals / anti-goals

- No change to the case study pages' content or to the CV PDF.
- No effects beyond ARCHITECTURE.md rules: no bento grids, no new motion (only colour transitions + the existing slight image zoom on hover).
- No framework island for the filter; the page must still show every project if JS is off.

## Constraints

- Existing stack and style: Astro 5, Tailwind, Keystatic YAML, `Sheet`/`Bi` components, bilingual EN/ID via `Bi`.
- Existing projects must keep working without edits beyond adding tags.

## Approaches considered

- **A.** Grid of all projects on the homepage. Simplest, but the homepage grows again at ~15–20 projects.
- **B.** Homepage grid capped at 4, plus `/projects` archive with tech/year filter. No schema change.
- **C (chosen by Farhan).** Same as B, but the archive filters by a new tag field. Costs one Keystatic field and a fixed tag list; tags describe the kind of project better than tech or year do.

## Design

**Content.** New optional field `tags` in `keystatic.config.ts` (multi-select, fixed options): `internal-system`, `website`, `landing-page`, `client`. Labels are bilingual and live in one map in `src/lib/projects.ts`. Initial tagging (my call, easy to change): RuangSDM, Pusdatin HR, SIPEKAD → `internal-system`; Website Kampus (`sttpu-web`) → `website`; Huora Beauty, Metland Cikarang → `landing-page` + `client`.

**Card (`ProjectCard.astro`, new).** Whole card links to `/projects/[slug]`. Image 16:10 top-aligned (placeholder block with the title in mono if no image), then title (serif), tagline (`Bi`), and a mono line with year and tag labels. Two columns from `sm`, one on mobile. Same hairline border and orange-on-hover title as the current list.

**Homepage.** `Work.astro` renders the first 4 projects by `order` as cards, and under the grid a link "See all projects →" (`Lihat semua proyek →`) to `/projects`, shown only when there are more than 4.

**`/projects` page.** Same layout as the case study pages (`Header home={false}`, `Footer`), a `Sheet`-style heading, a row of filter chips (All + only tags in use, with counts), then the full card grid in `order`. Filtering is a small inline script toggling `hidden` on cards by `data-tags`; one tag at a time, synced to `?tag=` so a filtered view is linkable. Without JS all cards show.

**Other touches.** Sitemap gets `/projects`. The case study's "← All work" link points to `/projects`. Header "Work" still goes to `/#work`. ARCHITECTURE.md Layout paragraph updated.

## Left to the builder

Exact spacing, chip styling, empty-image placeholder look, and the small refactor of shared project-card markup, as long as it follows the existing visual language.

## Calls I made (not yet confirmed by Farhan)

- Homepage shows 4 projects, chosen by existing `order` (no new "featured" field).
- Tag set and initial tagging above; one tag at a time; `?tag=` URL sync.
- Filter by tag only (no tech/year filter).
