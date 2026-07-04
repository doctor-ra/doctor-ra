# Personal Website Implementation Plan — Rohit (doctor-ra)

> **Instructions for the implementing model (e.g., Claude Sonnet):**
> This document is the complete specification for building Rohit's personal website.
> Follow the phases in order. Each phase has explicit tasks and acceptance criteria —
> do not move to the next phase until the current one's criteria pass. Where a value
> is marked `TODO(Rohit)`, use the given placeholder and keep going; do not invent
> personal facts that aren't in this document.

---

## 1. Context & Goals

**Who:** Rohit — BS in Neuroscience, currently working toward medical school
acceptance, with a strong side interest in programming (Python, data analysis,
web dev bootcamp experience).

**Purpose of the site:**
1. A clean, credible personal presence for med school applications, interviewers,
   and anyone who Googles him.
2. A place to showcase the unusual neuroscience + programming combination.
3. A lightweight blog for journey notes (pre-med journey, projects, things learned).

**Vibe:** Clean, minimal, professional with warmth. Think "modern personal site,"
not "flashy portfolio." Fast, readable, no clutter, no stock-photo hero banners,
no autoplaying anything. The design should feel at home next to sites like
paulgraham.com structure with modern polish (whitespace, one accent color,
beautiful typography).

**Non-goals:** No backend, no database, no login, no analytics requiring cookie
banners, no heavy JS frameworks shipped to the client.

---

## 2. Critical Repository Constraints (READ FIRST)

The target repo is **`doctor-ra/doctor-ra`** — this is GitHub's *special profile
README repository*. Two hard constraints follow:

1. **`README.md` at the repo root is Rohit's GitHub profile README.** It renders on
   https://github.com/doctor-ra. Do **not** turn it into project documentation.
   Phase 7 updates it intentionally (profile README + link to the site). Project
   docs for the website go in `SITE.md` instead.
2. **GitHub Pages URL will be a *project* page:** the site will be served at
   `https://doctor-ra.github.io/doctor-ra/` (note the `/doctor-ra/` base path).
   Every internal link and asset URL must respect the base path. Astro handles
   this via `base: '/doctor-ra'` in config — always build hrefs with
   `import.meta.env.BASE_URL` or Astro's built-in path handling, never hardcode `/about`.
   - If Rohit later buys a custom domain (e.g., `example.com`), only
     `site`/`base` in `astro.config.mjs` and a `CNAME` file change. Structure the
     code so this is a two-line change (single source of truth for base path).

---

## 3. Tech Stack (decided — do not substitute)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro (latest v5.x)** | Static output, zero JS by default, first-class Markdown content collections for the blog, official GitHub Pages deploy action. |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`) | Fast to build, consistent spacing/type scale, easy dark mode. |
| Fonts | **Inter** (UI/body) + **Newsreader** or **Source Serif 4** (headings, optional) via `@fontsource` npm packages | Self-hosted = no Google Fonts request, better privacy + performance. |
| Icons | **Lucide** static SVGs (inline or `lucide-static`) | Crisp, consistent, tree-shakeable; inline SVG only — no icon font. |
| Interactivity | Vanilla `<script>` in Astro components only (theme toggle, mobile nav) | Keep client JS under ~5 KB total. |
| Deployment | **GitHub Actions → GitHub Pages** (`withastro/action`) | Free, automatic on push to `main`. |
| Package manager | `npm` | Lowest-friction default. |

No React/Vue/Svelte islands. No CMS. Content is Markdown in the repo.

---

## 4. Repository Layout (target state)

```
doctor-ra/
├── README.md                  # PROFILE README (see Phase 7 — keep short & personal)
├── SITE.md                    # Dev docs for the website (how to run, deploy, edit content)
├── PLAN.md                    # This file (keep in repo for reference)
├── .gitignore                 # node_modules, dist, .astro, .DS_Store
├── .nvmrc                     # 22
├── package.json
├── astro.config.mjs
├── tsconfig.json              # Astro strict preset
├── .github/
│   └── workflows/
│       └── deploy.yml         # Build & deploy to GitHub Pages
├── public/
│   ├── favicon.svg            # Simple "RA" monogram (spec in §6.6)
│   ├── og-default.png         # 1200×630 social card (generate simple text-based one)
│   └── resume.pdf             # TODO(Rohit) — placeholder note page until provided
└── src/
    ├── styles/global.css      # Tailwind import + CSS custom properties + prose styles
    ├── content.config.ts      # Blog collection schema
    ├── data/
    │   ├── site.ts            # SINGLE SOURCE OF TRUTH: name, tagline, links, email
    │   ├── projects.ts        # Typed array of project entries
    │   └── timeline.ts        # Typed array of journey/timeline entries
    ├── layouts/
    │   ├── BaseLayout.astro   # <head>, meta/OG/SEO, header, footer, skip link
    │   └── PostLayout.astro   # Blog post wrapper (title, date, reading time, prose)
    ├── components/
    │   ├── Header.astro       # Logo/name + nav + theme toggle + mobile menu
    │   ├── Footer.astro       # Links, copyright, "built with" line
    │   ├── ThemeToggle.astro  # Light/dark, no-flash inline script
    │   ├── ProjectCard.astro
    │   ├── TimelineItem.astro
    │   ├── PostCard.astro
    │   └── SectionHeading.astro
    ├── content/
    │   └── blog/
    │       └── hello-world.md # Seed post (copy provided in §7.5)
    └── pages/
        ├── index.astro        # Home
        ├── about.astro
        ├── projects.astro
        ├── blog/
        │   ├── index.astro    # Post list
        │   └── [...slug].astro
        ├── 404.astro
        └── rss.xml.js         # RSS feed via @astrojs/rss
```

---

## 5. Design System

### 5.1 Color

Single accent color, neutral everything else. Accent: a medical-but-modern teal.

```css
:root {
  --bg: #fafaf9;            /* warm off-white (stone-50) */
  --bg-elevated: #ffffff;
  --text: #1c1917;          /* stone-900 */
  --text-muted: #57534e;    /* stone-600 */
  --border: #e7e5e4;        /* stone-200 */
  --accent: #0d9488;        /* teal-600 */
  --accent-hover: #0f766e;  /* teal-700 */
}
:root.dark {
  --bg: #0c0a09;            /* stone-950 */
  --bg-elevated: #1c1917;
  --text: #f5f5f4;
  --text-muted: #a8a29e;
  --border: #292524;
  --accent: #2dd4bf;        /* teal-400 */
  --accent-hover: #5eead4;
}
```

Rules:
- Accent is used ONLY for: links, primary button, active nav item, small decorative
  details (timeline dots, tag pills). Never for large background areas.
- All text/background pairs must meet WCAG AA (4.5:1). The values above do.

### 5.2 Typography

- Body/UI: Inter, `font-size: 1rem` base, `line-height: 1.7` for prose.
- Headings: same family, tighter tracking (`-0.02em`), weights 600–700.
  (If using a serif for h1/h2, apply Newsreader at weight 500 — decide once,
  apply everywhere. Default to all-Inter if unsure.)
- Type scale (rem): h1 2.25, h2 1.5, h3 1.25, body 1.0, small 0.875.
- Max prose width: `65ch`. Page content max width: `42rem` (blog) / `48rem` (other
  pages), centered, horizontal padding `1.5rem` on mobile.

### 5.3 Spacing & layout

- Section vertical rhythm: `4rem` between major sections on desktop, `3rem` mobile.
- Cards: 1px `--border` border, `0.75rem` radius, subtle hover (border →
  accent-tinted, translate-y -2px, 150ms ease). No drop shadows heavier than
  `0 1px 3px rgb(0 0 0 / 0.06)`.
- The whole site is a single centered column. No sidebars.

### 5.4 Motion

- Only: hover transitions (150ms), theme fade (color transitions 200ms), and an
  optional single fade-up on the hero (respect `prefers-reduced-motion: reduce` —
  wrap all animation in that media query).

### 5.5 Dark mode

- Class strategy (`.dark` on `<html>`), toggle in header, persisted to
  `localStorage('theme')`, defaults to `prefers-color-scheme`.
- **No flash:** inline a tiny blocking script in `<head>` (before CSS paint) that
  sets the class from localStorage/media query.

### 5.6 Favicon / monogram

`favicon.svg`: rounded square, `--accent` teal background (#0d9488), white bold
"RA" (Inter 700) centered. Also use this mark at small size next to the name in
the header. Generate `og-default.png` (1200×630): off-white background, "Rohit
" large, tagline below, teal accent bar — can be produced with a small
Node script using `sharp`/`satori` at build time, or committed as a static asset
generated once (simpler — do that).

---

## 6. Information Architecture & Page Specs

Global nav (header, right-aligned): **Home · About · Projects · Blog** + theme
toggle. Header is sticky, backdrop-blur, bottom border. Mobile: nav collapses to
a simple disclosure menu (`<details>`-based or minimal JS, must work without JS
degrading gracefully).

Footer: name + © year, links (GitHub, Email, RSS), and "Built with Astro" small text.

### 6.1 Home (`/`)

1. **Hero** (no image required; if avatar used, pull `public/avatar.jpg` —
   `TODO(Rohit)`, ship without it):
   - h1: `Rohit`
   - Tagline (styled subtitle): `Neuroscience grad on the road to medicine. I also build things with code.`
   - Short paragraph (2–3 sentences, from §7.1 intro copy).
   - Two buttons: primary `About me →` (accent bg), secondary `View projects`
     (border style). Plus inline icon links: GitHub, Email.
2. **"Currently" strip** — a small bordered card with 2–3 bullets:
   - `📚 Preparing my medical school application`
   - `🧠 Interested in the intersection of neuroscience & software`
   - `🛠 Building small tools in Python`
3. **Featured projects** — 2 `ProjectCard`s (the top two from §7.3) + "All projects →" link.
4. **Latest writing** — up to 3 `PostCard`s from the blog collection, sorted by
   date desc + "All posts →". If only the seed post exists, show just it.

### 6.2 About (`/about`)

1. Intro section — the long-form bio from §7.2 (3 short paragraphs, prose styling).
2. **Journey timeline** — vertical timeline (accent dots + connecting line, date
   label, title, 1-line description) rendered from `src/data/timeline.ts`. Entries in §7.4.
3. **Skills / toolbox** — two small groups of tag pills:
   - Science: `Neuroscience`, `Research methods`, `Data analysis`, `Scientific writing`
   - Code: `Python`, `Jupyter`, `HTML/CSS`, `JavaScript`, `Git & GitHub`
4. **Beyond the desk** — one short paragraph, placeholder:
   `TODO(Rohit): hobbies/interests — ship with: "Outside of studying and coding, I'm usually reading, at the gym, or going down a Wikipedia rabbit hole."`
5. Closing CTA: "Want to get in touch? Email me at …" (mailto from `site.ts`).

### 6.3 Projects (`/projects`)

- Short intro sentence, then a single-column list of `ProjectCard`s (all entries
  from §7.3). Card contents: title, year, description, tech tag pills, links
  (GitHub icon+link; demo link if present).
- End with a note: *"More on my [GitHub](https://github.com/doctor-ra)."*

### 6.4 Blog (`/blog`, `/blog/<slug>`)

- **Index:** intro line ("Occasional notes on medicine, neuroscience, and code."),
  then `PostCard` list: title (link), date (`Jan 4, 2026` format), description.
  No pagination until >20 posts (skip building it now).
- **Post page (`PostLayout`):** back link (`← All posts`), h1, date + reading time
  (compute: words/200 rounded up), prose-styled Markdown body (style headings,
  code blocks with Astro's built-in Shiki — theme `github-light`/`github-dark`
  matching color scheme via CSS, blockquotes, lists, links in accent).
- **Content schema** (`src/content.config.ts`, zod): `title: string`,
  `description: string`, `pubDate: date`, `updatedDate: date optional`,
  `draft: boolean default false` (drafts excluded from builds/lists/RSS).
- **RSS** at `/rss.xml` via `@astrojs/rss`, absolute URLs using the configured `site`.

### 6.5 404

Friendly: big `404`, line `This page doesn't exist — maybe it's studying for the MCAT.`,
button back home. Must respect base path.

### 6.6 SEO / meta (in `BaseLayout`)

Every page gets: `<title>` (`{pageTitle} · Rohit`, home = `Rohit — Neuroscience & Code`),
meta description (per-page prop), canonical URL, OG + Twitter card tags
(default `og-default.png`), `<link rel="sitemap">` (add `@astrojs/sitemap`),
theme-color for both schemes, and JSON-LD `Person` on the home page
(name, url, sameAs: GitHub). `robots.txt` allowing all + sitemap pointer.

---

## 7. Content (draft copy — use verbatim, Rohit edits later)

### 7.1 Hero intro (Home)

> I graduated with a BS in Neuroscience and I'm working toward medical school.
> Along the way I fell for programming — so this site is where the two halves
> meet: the journey to becoming a physician, and the things I build with code.

### 7.2 Bio (About)

> Hi, I'm Rohit. I studied neuroscience because I wanted to understand the organ
> that makes us who we are — and the more I learned, the more certain I became
> that I want to spend my career in medicine. Right now, my focus is earning a
> seat in medical school.
>
> Somewhere between lab courses and lecture halls, I discovered programming.
> What started as curiosity became a real skill set: I've worked through a web
> development bootcamp, analyzed research data in Jupyter notebooks, and built
> small tools in Python. I think the ability to reason about both neurons and
> code will only become more valuable in medicine.
>
> This site is my home on the internet — a record of the journey, the projects,
> and the occasional thing I can't stop thinking about.

### 7.3 Projects data (`src/data/projects.ts`)

```ts
export interface Project {
  title: string; year: string; description: string;
  tech: string[]; github?: string; demo?: string; featured?: boolean;
}
```

1. **NURP Research Project** — `2022`, featured — *Data analysis project from the
   Neuroscience Undergraduate Research Program: exploring and visualizing research
   data in Jupyter notebooks.* Tech: `Python`, `Jupyter`, `Data analysis`.
   GitHub: `https://github.com/doctor-ra/NURP`.
2. **Equation Calculator** — `2021`, featured — *A Python tool for computing common
   scientific and everyday equations from a simple interface.* Tech: `Python`.
   GitHub: `https://github.com/doctor-ra/calculator`.
3. **Aniverse** — `2020` — *Team project from a web development bootcamp — a site
   for exploring anime, built with front-end fundamentals.* Tech: `HTML`, `CSS`,
   `JavaScript`. GitHub: `https://github.com/doctor-ra/aniverse`.
4. **This website** — `2026` — *The site you're reading — statically generated,
   near-zero JavaScript, deployed from this repo.* Tech: `Astro`, `Tailwind CSS`,
   `GitHub Actions`. GitHub: `https://github.com/doctor-ra/doctor-ra`.

### 7.4 Timeline data (`src/data/timeline.ts`)

| When | Title | Line |
|---|---|---|
| `TODO(Rohit)` (use "20XX") | Started BS in Neuroscience | Chose the brain as a major. No regrets. |
| 2020 | First lines of code | Started teaching myself web development; completed bootcamp projects. |
| 2022 | NURP research | Undergraduate research program — first taste of real data analysis. |
| `TODO(Rohit)` ("20XX") | Graduated — BS, Neuroscience | The first big milestone. |
| Now | Road to medical school | Preparing applications and sharpening both stethoscope-adjacent and software skills. |

### 7.5 Seed blog post (`src/content/blog/hello-world.md`)

```markdown
---
title: "Hello, world (the premed edition)"
description: "Why a neuroscience grad aiming for medical school keeps a website with a blog."
pubDate: 2026-07-04
---

Every doctor I admire is, at some level, a good explainer. Writing is how I
practice that.

I built this site for two reasons. First, I wanted one place that tells my
story better than a profile page can: neuroscience degree, medical school
ambitions, and a genuine love of programming. Second, I wanted a place to
write — about the application journey, about things I learn, and about the
odd corners where medicine and software overlap.

Expect posts to be short, occasional, and honest. If any of that sounds
interesting, there's an [RSS feed](/rss.xml) — or just check back sometime.
```

### 7.6 Contact info (`src/data/site.ts`)

```ts
export const site = {
  name: "Rohit",
  handle: "doctor-ra",
  tagline: "Neuroscience grad on the road to medicine. I also build things with code.",
  url: "https://doctor-ra.github.io/doctor-ra", // update when custom domain exists
  email: "<email withheld>",               // TODO(Rohit): confirm public email
  github: "https://github.com/doctor-ra",
  // linkedin: TODO(Rohit) — omit link until provided
};
```

---

## 8. Deployment (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`astro.config.mjs` must set `site: 'https://doctor-ra.github.io'` and
`base: '/doctor-ra'`. After first push, Pages must be enabled in repo settings
with **Source: GitHub Actions** (note this in SITE.md; if `gh` CLI is available,
run `gh api -X POST repos/doctor-ra/doctor-ra/pages -f build_type=workflow` — if it
403s or Pages is already configured, just document the manual step).

---

## 9. Implementation Phases

### Phase 0 — Scaffold
1. `npm create astro@latest` (empty template, TypeScript strict), add Tailwind v4
   via `@tailwindcss/vite`, add `@astrojs/sitemap`, `@astrojs/rss`, `@fontsource-variable/inter`.
2. Configure `astro.config.mjs` (site, base, sitemap), `.nvmrc`, `.gitignore`.
3. **Keep the existing `README.md` untouched in this phase.**
- ✅ *Accepts when:* `npm run dev` serves a page; `npm run build` succeeds.

### Phase 1 — Design system & layout shell
1. `global.css`: CSS variables (§5.1), font registration, base element styles,
   prose classes for Markdown.
2. `BaseLayout` (head/meta per §6.6, skip-to-content link), `Header` (sticky nav,
   active-page highlighting via `Astro.url.pathname` compared against base-aware
   paths), `Footer`, `ThemeToggle` (+ no-flash script).
- ✅ *Accepts when:* empty pages render with header/footer; theme toggles and
  persists with no flash on reload; nav works on 375px viewport; lighthouse
  a11y on shell ≥ 95.

### Phase 2 — Data + Home
`site.ts`, `projects.ts`, `timeline.ts` (§7), then Home per §6.1 with
`ProjectCard`, `PostCard`, `SectionHeading`.
- ✅ *Accepts when:* Home matches §6.1 ordering; all links resolve under the
  `/doctor-ra` base in `npm run preview`.

### Phase 3 — About + Projects pages
Per §6.2 / §6.3 with `TimelineItem`.
- ✅ *Accepts when:* timeline renders correctly on mobile & desktop; tag pills wrap.

### Phase 4 — Blog
Content collection config, seed post, blog index, `[...slug].astro`, `PostLayout`
(reading time, prose, Shiki themes), RSS, drafts excluded.
- ✅ *Accepts when:* post renders styled; `/rss.xml` validates (absolute URLs);
  draft posts don't appear anywhere.

### Phase 5 — 404, SEO polish, socials
404 page, JSON-LD, `robots.txt`, `og-default.png`, favicon (§5.6), verify every
page's title/description/canonical.
- ✅ *Accepts when:* `npm run build` outputs sitemap; view-source shows correct
  OG tags on each page type.

### Phase 6 — QA pass
1. `npm run build && npm run preview` — click every link (base path bugs are the
   #1 risk; grep `dist/` for `href="/` occurrences not starting with `/doctor-ra`).
2. Check both themes, 375px/768px/1440px widths, keyboard-only navigation,
   `prefers-reduced-motion`.
3. Lighthouse (or equivalent) targets: Performance ≥ 95, A11y ≥ 95, SEO ≥ 95.
   Total transferred JS < 10 KB.

### Phase 7 — README, docs, ship
1. Rewrite `README.md` as an improved **profile README** (it shows on his GitHub
   profile): short intro mirroring the hero (🧠 Neuroscience BS → 🩺 med school,
   🛠 programming), link to the website, link to featured repos. Keep it under
   ~25 lines, tasteful emoji, no badge walls.
2. Write `SITE.md`: run/build/deploy instructions, how to add a blog post, how to
   add a project, how to switch to a custom domain, the Pages settings note.
3. Commit in logical increments per phase (conventional messages: `feat: scaffold astro site`,
   `feat: design system and layout`, …). Push to `main`, verify the Actions run
   deploys, and confirm `https://doctor-ra.github.io/doctor-ra/` loads.
- ✅ *Accepts when:* live URL renders correctly with working nav, blog, RSS, and dark mode.

---

## 10. Open items for Rohit (site ships without them)

- [ ] Confirm public contact email (currently `<email withheld>`).
- [ ] Headshot/avatar (`public/avatar.jpg`) — optional.
- [ ] Resume PDF (`public/resume.pdf`) — nav/footer link only added once present.
- [ ] Timeline years for degree start/graduation.
- [ ] LinkedIn URL (omit until provided).
- [ ] Custom domain (optional; two-line config change per §2).
