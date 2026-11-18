# Projects Gallery + Keystatic Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Remove dead content/code, (2) move every still-hardcoded piece of *content* into Keystatic, (3) replace the long "Selected work" list with a 4-project gallery on the homepage plus a filterable `/projects` archive.

**Architecture:** Pure helpers (`tags.ts`, `identity.ts`) have no Astro/Keystatic imports so they are unit-tested with `node --test`. Async content getters wrap `reader`. Astro components stay server-rendered; the tag filter is a ~20-line inline module script that degrades to "show everything" without JS.

**Tech Stack:** Astro 5, Tailwind 3, Keystatic (YAML), TypeScript, Node 22 (`node --test` with built-in type stripping).

**Spec:** `docs/superpowers/specs/2026-11-18-projects-gallery-design.md` (gallery). The Keystatic cleanup was added by Farhan in chat after the spec: "bersihkan yang sudah tidak digunakan, masukkan ke keystatic yang masih hardcode lalu jalankan implementasi galeri".

## Global Constraints

- **The working tree is dirty with Farhan's own uncommitted work:** `content/projects/*.yaml`, `public/images/projects/**` (renames, e.g. `website-kampus` → `sttpu-web`). Never revert, `git add -A`, `git add .`, or stage anything under `content/projects/` or `public/images/`. Always `git add` explicit paths. Edits to `content/projects/*.yaml` (adding `tags`, stripping `icon`) are made in the working tree but left **unstaged**.
- Work on a new branch `feat/projects-gallery` (never commit to `main`).
- Commit messages end with the line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Style rules from `ARCHITECTURE.md`: no bento grids, no new effects; motion is only colour transitions and the existing slight image zoom on hover; copy first person; bilingual everywhere via `Bi.astro`.
- UI chrome (nav labels, button labels, form status text, "Loading…", footer "Scale 1:1…", section headings like "How I work", "Toolbox") stays hardcoded on purpose. Only *content about Farhan* moves to Keystatic.
- Existing text must be copied **verbatim** into YAML (EN and ID); do not reword.
- Env vars kept: `PUBLIC_SITE_URL`, `PUBLIC_OG_IMAGE`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, Keystatic secrets. Env vars removed: `PUBLIC_SITE_TITLE`, `PUBLIC_SITE_DESCRIPTION`, `PUBLIC_GITHUB_URL`, `PUBLIC_LINKEDIN_URL`, `PUBLIC_EMAIL`, `PUBLIC_WHATSAPP_URL`.
- Homepage shows `HOME_PROJECT_LIMIT = 4` projects ordered by `order`.
- Verification loop (no component test framework exists): `npm test` for pure helpers, `npx astro check`, and `npm run dev` + `curl -s http://localhost:4321/... | grep` for rendered output. Stop the dev server when done.

## Review Focus

1. `?tag=` with an unknown value (e.g. `?tag=nope`) → show all projects, no empty page. (Task 1 test, Task 7 check)
2. Project without `image` → card renders a placeholder block, no broken `<img>`. (Task 6)
3. Project with empty `tags` → card has no tag line and still appears under "All". (Task 6, 7)
4. Exactly 4 projects or fewer → no "See all projects" link; 5 or more → link shown. (Task 6)
5. Phone/URL variants: `0857-7182-6637`, `+62 857-7182-6637`, `https://github.com/mchdfrhn/`, `https://github.com/mchdfrhn.git`, non-GitHub URL, empty string → helpers return sane values, nothing throws. (Task 1 tests)
6. A singleton file missing or partly empty (`read()` returns `null`) → component renders without it instead of crashing the build. (Tasks 3–5)

---

### Task 1: Branch, test harness, pure helpers

**Files:**
- Create: `src/lib/tags.ts`, `src/lib/identity.ts`, `tests/tags.test.ts`, `tests/identity.test.ts`
- Modify: `package.json` (add `"test"` script), `tsconfig.json` (exclude `tests`)
- Stage also: `docs/superpowers/specs/2026-11-18-projects-gallery-design.md`, this plan

**Interfaces:**
- Produces (`src/lib/tags.ts`):
  - `PROJECT_TAGS`: `{ 'internal-system': {en:'Internal system', id:'Sistem internal'}, website: {en:'Website', id:'Website'}, 'landing-page': {en:'Landing page', id:'Landing page'}, client: {en:'Client project', id:'Proyek klien'} } as const`
  - `type ProjectTag = keyof typeof PROJECT_TAGS`
  - `tagCounts(items: ReadonlyArray<{ tags: readonly string[] }>): Array<{ tag: ProjectTag; count: number }>` — only tags with count > 0, ordered like `PROJECT_TAGS` keys, unknown tag strings ignored.
  - `resolveTag(param: string | null | undefined, available: readonly string[]): string | null` — `param` if it is in `available`, else `null`.
- Produces (`src/lib/identity.ts`):
  - `githubUsername(url: string): string` — `''` unless the URL is `github.com/<user>`; tolerates trailing `/` and `.git`.
  - `initials(name: string): string` — `'Mochammad Farhan Ali'` → `'M. F. Ali'`, `'Farhan Ali'` → `'F. Ali'`, `'Farhan'` → `'Farhan'`, `''` → `''`.
  - `whatsappUrl(phone: string): string` — digits only, a leading `0` becomes `62`; `''` → `''`.

- [ ] **Step 1:** `git checkout -b feat/projects-gallery`.
- [ ] **Step 2: Write failing tests.** In `tests/tags.test.ts` (imports use the `.ts` extension, e.g. `from '../src/lib/tags.ts'`) assert:
  - `tagCounts([{tags:['website']},{tags:['landing-page','client']},{tags:['client']},{tags:[]}])` deep-equals `[{tag:'website',count:1},{tag:'landing-page',count:1},{tag:'client',count:2}]`
  - `tagCounts([{tags:['bogus']}])` deep-equals `[]`
  - `resolveTag('client', ['client','website'])` is `'client'`; `resolveTag('nope', ['client'])`, `resolveTag(null, ['client'])`, `resolveTag('', ['client'])` are `null`.

  In `tests/identity.test.ts` assert:
  - `githubUsername('https://github.com/mchdfrhn')`, `'https://github.com/mchdfrhn/'`, `'https://github.com/mchdfrhn.git'` all `'mchdfrhn'`; `githubUsername('https://gitlab.com/x')` and `githubUsername('')` are `''`.
  - `initials` cases listed above.
  - `whatsappUrl('+62 857-7182-6637')` and `whatsappUrl('0857-7182-6637')` both `'https://wa.me/6285771826637'`; `whatsappUrl('')` is `''`.
- [ ] **Step 3:** Add `"test": "node --test \"tests/**/*.test.ts\""` to `package.json`; add `"tests"` to `exclude` in `tsconfig.json`. Run `npm test` → FAIL (modules missing).
- [ ] **Step 4:** Implement both modules per the signatures above (no imports from `@/`, Astro, or Keystatic). Run `npm test` → all PASS.
- [ ] **Step 5: Commit** (explicit paths): `git add src/lib/tags.ts src/lib/identity.ts tests package.json tsconfig.json docs/superpowers && git commit -m "feat: add tag and identity helpers with tests"`.

---

### Task 2: Remove dead code, reshape Keystatic schema, migrate content

**Files:**
- Delete: `src/components/Testimonials.tsx` (unused, and contains invented testimonials with made-up names)
- Modify: `keystatic.config.ts`, `package.json` + lockfile (drop `lucide-react` if the grep below shows no other user), `content/hero.yaml`, `content/about.yaml`, `content/profile.yaml`, `content/expertise/*.yaml` (strip `icon`, `colorTheme`, `fullWidth`)
- Modify, **leave unstaged**: `content/projects/*.yaml` (strip `icon`, add `tags`)
- Create: `content/contact.yaml`, `content/cv.yaml`

**Interfaces:**
- Consumes: `PROJECT_TAGS` from Task 1 (the Keystatic tag options are built from it: `Object.entries(PROJECT_TAGS).map(([value, l]) => ({ value, label: l.en }))`; import with a relative path and `.ts`-less specifier as the rest of the config does).
- Produces the following Keystatic shapes (reader types follow automatically):
  - `projects`: remove `icon`; add `tags: fields.multiselect({ label: 'Tags', options })`.
  - `expertise`: remove `icon`, `colorTheme`, `fullWidth`.
  - `profile`: remove `profileImage`, `availability`, `softwareHouseShortName` **only if** `grep -rn "profileImage\|availability\|softwareHouseShortName" src` shows no consumer (expected: none); add `siteDescription: text (multiline)` — default meta description, seeded with the current `SITE_DESCRIPTION` string from `src/lib/config.ts`.
  - `hero` (replaces old shape entirely): `en: { headline, intro (multiline) }`, `id: { headline, intro (multiline) }`, `facts: array({ en: { label, value }, id: { label, value } })`.
  - `about` (replaces old shape): `en: { description (multiline, used by CV summary + JSON-LD), story: array(text multiline) }`, `id: same`, `principles: array({ en: { title, body (multiline) }, id: { title, body (multiline) } })`.
  - `contact` singleton (`content/contact`): `en: { heading, intro (multiline) }`, `id: same`.
  - `cv` singleton (`content/cv`, label "CV Extras"): `skillGroups: array({ en: { label }, id: { label }, items: array(text) })`, `coreCompetencies: array({ en: text, id: text })`.

- [ ] **Step 1:** Confirm with `grep -rn "lucide" src` that `Testimonials.tsx` is the only consumer, then delete it and remove `lucide-react` from `package.json`/lockfile (`npm uninstall lucide-react`).
- [ ] **Step 2:** Edit `keystatic.config.ts` to the shapes above.
- [ ] **Step 3: Migrate content, copying text verbatim:**
  - `hero.yaml`: headline + intro (EN/ID) from `Intro.astro`; `facts` = the three rows Now / Also / Studying (labels `Now`/`Sekarang`, `Also`/`Juga`, `Studying`/`Kuliah`; values as in `Intro.astro`). The "Based" row is **not** a fact: it keeps coming from `profile.location`.
  - `about.yaml`: `description` EN/ID kept from the current file; `story` = the two paragraphs from `About.astro` (EN/ID); `principles` = the four items from `About.astro`.
  - `contact.yaml`: heading and the "I'm open to full-time roles…Email is fastest:" sentence (EN/ID) from `Contact.astro`. The glue text `" — or "` and the links stay in code.
  - `cv.yaml`: `skillGroups` and `coreCompetencies` from `src/lib/cv-data.ts` (both languages; only the first group has differing labels).
  - `profile.yaml`: add `siteDescription`, drop removed fields.
  - Strip `icon`/`colorTheme`/`fullWidth` lines from `content/expertise/*.yaml` and `icon:` from `content/projects/*.yaml`.
  - Add `tags:` to `content/projects/*.yaml` (unstaged): `pusdatin-hr`, `ruang-sdm`, `sipekad` → `[internal-system]`; `sttpu-web` → `[website]`; `huora-beauty`, `metland-cikarang` → `[landing-page, client]`.
- [ ] **Step 4: Verify.** `npx astro check` → no errors (existing components only read fields that still exist: `profile.location`, `about.en.description`/`about.id.description`, expertise `en/id.title`, `tech`, `order`, projects). Fix any consumer that referenced a removed field. Then `npm run dev`, load `/` (200) and stop the server; confirm Keystatic reads all new YAML without error (check the dev server log).
- [ ] **Step 5: Commit** explicit paths: `git add keystatic.config.ts package.json package-lock.json content/hero.yaml content/about.yaml content/profile.yaml content/contact.yaml content/cv.yaml content/expertise src/components/Testimonials.tsx && git commit -m "refactor: reshape Keystatic schema, migrate content, drop dead code"`. Do not stage `content/projects`.

---

### Task 3: Intro, About, Contact read from Keystatic

**Files:**
- Create: `src/lib/site-content.ts`
- Modify: `src/components/site/Intro.astro`, `About.astro`, `Contact.astro`

**Interfaces:**
- Produces (`src/lib/site-content.ts`, uses `reader`): `getProfile()`, `getHero()`, `getAbout()`, `getContact()` — each `async`, returning the matching singleton's `read()` result (possibly `null`). Also `getCv()` returning `reader.singletons.cv.read()` (used in Task 5).
- Consumes: `whatsappUrl`, `githubUsername` from `src/lib/identity.ts` (imported as `@/lib/identity`).

- [ ] **Step 1:** Implement `site-content.ts`.
- [ ] **Step 2: `Intro.astro`:** headline/intro from `hero`; fact rows from `hero.facts` followed by the "Based" row (`profile.location`, labels `Based`/`Lokasi`); eyebrow = `profile.name` + " — " + title (`titleEn`/`titleId` via `Bi`); link row GitHub/LinkedIn/Email from `profile.github`, `profile.linkedin`, `mailto:${profile.email}`. Keep the CV download buttons unchanged. Missing hero/profile → render the parts that exist, never throw.
- [ ] **Step 2b: `About.astro`:** story paragraphs from `about.en.story`/`about.id.story` (map index to index); principles from `about.principles`; remove the `ponytail` draft comment. Sub-headings stay hardcoded.
- [ ] **Step 3: `Contact.astro`:** heading + intro from `contact`; email = `profile.email`, WhatsApp = `whatsappUrl(profile.phone)`.
- [ ] **Step 4: Verify.** `npx astro check`; `npm run dev`; `curl -s localhost:4321/` and confirm it contains one string from each of: hero headline (EN and ID), a story paragraph, principle 1 title, contact heading, `mailto:` the profile email, `wa.me/6285771826637`. Compare against `git show HEAD:src/components/site/Intro.astro` text to make sure nothing was reworded. Stop the server.
- [ ] **Step 5: Commit** `git add src/lib/site-content.ts src/components/site/Intro.astro src/components/site/About.astro src/components/site/Contact.astro && git commit -m "refactor: read intro, about, contact copy from Keystatic"`.

---

### Task 4: Layout, Footer, CommitLog, config stop duplicating profile data

**Files:**
- Modify: `src/layouts/Layout.astro`, `src/components/site/Footer.astro`, `src/components/site/CommitLog.astro`, `src/lib/config.ts`, `.env.example`, `README.md` / `ARCHITECTURE.md` only where they mention removed env vars

**Interfaces:**
- Consumes: `getProfile`, `getAbout` (Task 3); `githubUsername`, `initials` (Task 1).
- Produces: `config.ts` exports only `SITE_URL` and `OG_IMAGE`.

- [ ] **Step 1: `Layout.astro`:** default `description` = `profile.siteDescription`; JSON-LD `name`, `jobTitle` (`titleEn`), `email`, `sameAs` (`[github, linkedin]`), `address.addressLocality` (first segment of `profile.location` before the comma), `description` (`about.en.description`), `knowsAbout` (`profile.techStack` plus the existing non-stack topics are dropped), `worksFor` (`softwareHouseName`/`softwareHouseUrl`) all from Keystatic. `og:site_name` = `profile.name`.
- [ ] **Step 2: `Footer.astro`:** project name = `profile.name`; "Drawn by" = `initials(profile.name)`; Studio link = `softwareHouseName`/`softwareHouseUrl`.
- [ ] **Step 3: `CommitLog.astro`:** username = `githubUsername(profile.github)`; if it is `''`, render the existing unavailable fallback; the "see it on GitHub" link uses `profile.github`.
- [ ] **Step 4:** Reduce `config.ts` to `SITE_URL` and `OG_IMAGE`; update `.env.example`; `grep -rn "PUBLIC_SITE_TITLE\|PUBLIC_SITE_DESCRIPTION\|PUBLIC_GITHUB_URL\|PUBLIC_LINKEDIN_URL\|PUBLIC_EMAIL\|PUBLIC_WHATSAPP_URL" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.vercel` → no hits.
- [ ] **Step 5: Verify.** `npx astro check`; `npm run dev`; `curl -s localhost:4321/` contains `"sameAs"` with both profile URLs, `Drawn by` followed by `M. F. Ali`, the software house link, and a `<meta name="description"` equal to `profile.siteDescription`. Stop the server.
- [ ] **Step 6: Commit** the modified files (explicit paths) with `refactor: source site identity from the profile singleton`.

---

### Task 5: CV PDF takes skills and competencies from Keystatic

**Files:**
- Modify: `src/lib/cv-data.ts`

**Interfaces:**
- Consumes: `cv` singleton shape from Task 2 (`getCv()` or `reader.singletons.cv.read()` inside `getCvData`).
- Produces: `CvData.skillGroups` / `coreCompetencies` unchanged in type (`SkillGroup[]`, `string[]`), now built from `cv.skillGroups` (label by `lang`) and `cv.coreCompetencies` (text by `lang`), `[]` if the singleton is missing.

- [ ] **Step 1:** Replace the two literals in `getCvData` with values derived from `cv`.
- [ ] **Step 2: Verify equivalence.** Before editing, save the current PDF text: `curl` is not enough (PDF), so instead run `npm run dev` and `curl -s localhost:4321/cv-en.pdf -o /tmp/before-en.pdf` and the same for `-id`; after editing, fetch to `/tmp/after-*.pdf` and compare extracted text (`pdftotext` if available, else compare that both return `200`/`application/pdf` and file sizes are within 1% — content was copied verbatim). Use the scratchpad directory, not `/tmp`, for these files.
- [ ] **Step 3: Commit** `git add src/lib/cv-data.ts && git commit -m "refactor: CV skills and competencies come from Keystatic"`.

---

### Task 6: ProjectCard + homepage gallery

**Files:**
- Create: `src/components/site/ProjectCard.astro`
- Modify: `src/components/site/Work.astro`, `src/lib/projects.ts` (export `HOME_PROJECT_LIMIT = 4`)

**Interfaces:**
- Consumes: `PROJECT_TAGS`, `ProjectTag` (Task 1); `getProjects()` (existing, returns `{ slug, entry }[]` sorted by `order`).
- Produces: `ProjectCard.astro` props `{ slug: string; entry: <project entry>; index?: number }`. The root element is `<li data-tags="<space-separated tags>">` containing one `<a href="/projects/{slug}">` covering the whole card. Reused by Task 7.

- [ ] **Step 1: `ProjectCard.astro`.** Image block 16:10, `object-cover object-top`, `loading="lazy"`, zoom on group-hover (existing `scale-[1.015]` pattern); if `entry.image` is empty, render a bordered block with the title in mono instead of an `<img>`. Below: title (`font-serif`, orange on hover), tagline (`Bi`), then a mono line `year · <tag labels via Bi>` (omit the tag part if there are no tags; ignore tags not in `PROJECT_TAGS`).
- [ ] **Step 2: `Work.astro`.** Keep `Sheet` (`no="02"`, same labels). Render `projects.slice(0, HOME_PROJECT_LIMIT)` in `<ul class="grid gap-x-6 gap-y-10 sm:grid-cols-2">` of `ProjectCard`. When `projects.length > HOME_PROJECT_LIMIT`, add below the grid a `link` "See all projects →" / "Lihat semua proyek →" pointing to `/projects`.
- [ ] **Step 3: Verify.** `npm run dev`; `curl -s localhost:4321/` → exactly 4 `href="/projects/` card links in the Work section, a `/projects` "See all" link present (6 projects now). Temporarily check the ≤4 case by confirming the condition in the code (`length > limit`), or by temporarily setting `HOME_PROJECT_LIMIT` to 6 and confirming the link disappears, then restore 4. Check a project without image by temporarily blanking one `image:` in a copy, never in the user's YAML (use a scratch component prop test or inspect the template branch); revert any temporary change. Stop the server.
- [ ] **Step 4: Commit** `git add src/components/site/ProjectCard.astro src/components/site/Work.astro src/lib/projects.ts && git commit -m "feat: homepage project gallery"`.

---

### Task 7: `/projects` archive with tag filter

**Files:**
- Create: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[slug].astro` (back link), `src/pages/sitemap.xml.ts`, `ARCHITECTURE.md` (Layout paragraph: homepage gallery of 4 + `/projects` archive; note about tag list living in `src/lib/tags.ts`)

**Interfaces:**
- Consumes: `ProjectCard.astro`, `getProjects()`, `tagCounts`, `resolveTag`, `PROJECT_TAGS`.
- Produces: route `/projects` (prerendered), filter via `?tag=<tag>`.

- [ ] **Step 1: Page.** `Layout` (title "Projects · Farhan Ali"), `Header home={false}`, `Footer`; back link "← Home" style like the case study page; `Sheet`-style heading row "Projects / Proyek"; a filter row `<div id="tag-filter" hidden>` with an "All / Semua (N)" button and one button per `tagCounts(...)` entry showing the bilingual label and count (`data-tag`, `aria-pressed`); the grid of every project via `ProjectCard` (same grid classes as Task 6). Hide the filter row entirely when `tagCounts` is empty.
- [ ] **Step 2: Script.** Inline module `<script>` importing `resolveTag` from `../../lib/tags`: unhide `#tag-filter`; read `?tag=`; `resolveTag(param, availableTags)` decides the active tag (null → All); toggle `hidden` on each card by its `data-tags`; set `aria-pressed`; on click update the active tag and `history.replaceState` the `?tag=` (remove the param for All). Active chip style: foreground background, background text; inactive: bordered, muted text; colour transitions only.
- [ ] **Step 3:** `[slug].astro`: change the `href="/#work"` back link to `/projects` (label unchanged). `sitemap.xml.ts`: add `/projects` to `paths`.
- [ ] **Step 4: Verify.** `npx astro check`; `npm run dev`; `curl -s localhost:4321/projects` → 6 cards, filter container present with `hidden`, chips for `internal-system (3)`, `website (1)`, `landing-page (2)`, `client (2)`; `curl -s localhost:4321/sitemap.xml` contains `/projects`; a case study page links back to `/projects`. In a real browser (use the `playwright-cli` skill): open `/projects?tag=client` → only 2 cards visible, "Client project" chip pressed; open `/projects?tag=nope` → all 6 visible; click chips and confirm the URL updates; toggle EN/ID and dark mode and confirm chips and cards still read correctly. Stop the server.
- [ ] **Step 5: Commit** `git add src/pages/projects src/pages/sitemap.xml.ts ARCHITECTURE.md && git commit -m "feat: /projects archive with tag filter"`.

---

### Task 8: Whole-branch verification

- [ ] **Step 1:** `npm test` (all pass), `npx astro check` (0 errors), `npm run build` (succeeds).
- [ ] **Step 2: Hardcode audit.** `grep -rn "mchdfrhn\|surupan.tech\|mochamadfarhanali\|6285771826637" src` → no hits. `grep -rn "I build the software\|Saya membangun software" src` → no hits (content now lives in `content/`).
- [ ] **Step 3:** `git status --short` shows only Farhan's own pre-existing changes (`content/projects/**`, `public/images/**`) plus my unstaged `tags`/`icon` edits in `content/projects/*.yaml`. `git log --oneline main..HEAD` shows the 7 commits above.
- [ ] **Step 4:** Report to Farhan: what was removed (`Testimonials.tsx`, `lucide-react`, old `hero`/`about`/`profile`/`expertise`/`projects` fields, 6 env vars), which new Keystatic screens exist (Hero, About, Contact, CV Extras, project Tags), that `content/projects/*.yaml` carries unstaged `tags` edits to commit together with his own changes, and the open note that the four "How I work" principles were still marked as a draft for him to rewrite.
