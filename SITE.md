# Site development notes

This repo holds two things:

1. **The personal site source** (Astro + Tailwind) — Rohit's medicine-focused page: home,
   about/journey, and blog. It is **not** auto-deployed anywhere; publish it yourself (see
   "Deploying to DigitalOcean" below).
2. **`README.md`** — the GitHub **profile README** that renders on
   https://github.com/doctor-ra. It's the programmer-identity intro and points to the
   separate programmer site. Don't turn it into project docs.

The programmer site (projects + Byte Blaster game) lives in the
[doctor-ra.github.io](https://github.com/doctor-ra/doctor-ra.github.io) repo and deploys to
GitHub Pages automatically.

## Running locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to dist/
npm run preview  # serve the production build
```

Node 22+ (see `.nvmrc`).

## Before publishing: set the real domain

Search for `doctor-ra.example` and replace it with the real domain in:

- `astro.config.mjs` → `site`
- `src/data/site.ts` → `url`
- `public/robots.txt` → the Sitemap line

Canonical URLs, the sitemap, RSS, and social tags all derive from that value.

## Deploying to DigitalOcean

Simplest path — **App Platform static site** (free tier works for static sites):

1. In DigitalOcean: Create → Apps → connect GitHub → pick `doctor-ra/doctor-ra` (main branch).
2. It should detect a static site. If asked: build command `npm run build`, output directory `dist`.
3. Set the app type to **Static Site** (not Web Service) so it's on the free static tier.
4. Add your custom domain under the app's Settings → Domains, and point the domain's DNS at
   DigitalOcean per their prompts.
5. Every push to `main` redeploys automatically.

Alternative (droplet + nginx): `npm run build`, copy `dist/` to the server, point nginx's
`root` at it. For a 404 page, add `error_page 404 /404.html;`.

## Adding a blog post

Create `src/content/blog/my-post.md`:

```markdown
---
title: "Post title"
description: "One sentence for SEO/RSS/social previews."
pubDate: 2026-08-01
---

Post body in Markdown.
```

The filename becomes the URL slug. Set `draft: true` to keep a post out of the
index/RSS/sitemap while writing it.

## Editing content

- Bio and page copy: `src/pages/about.astro`, `src/pages/index.astro`
- Journey timeline: `src/data/timeline.ts`
- Name/tagline/domain: `src/data/site.ts` (single source of truth)
