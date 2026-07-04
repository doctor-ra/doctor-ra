# Site development notes

This repo hosts [Rohit's personal website](https://doctor-ra.github.io/doctor-ra/), built with
[Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com). This file is for whoever
(human or model) is maintaining the site. See [PLAN.md](PLAN.md) for the original design spec.

Note: `README.md` at the repo root is Rohit's **GitHub profile README** (it renders on
https://github.com/doctor-ra) — it's separate from this file and shouldn't be turned into project docs.

## Running locally

```sh
npm install
npm run dev      # dev server at http://localhost:4321/doctor-ra
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

Node 22+ is expected (see `.nvmrc`).

## Adding a blog post

Create a new Markdown file in `src/content/blog/`, e.g. `src/content/blog/my-post.md`:

```markdown
---
title: "Post title"
description: "One sentence for SEO/RSS/social previews."
pubDate: 2026-08-01
---

Post body in Markdown here.
```

- The filename (without `.md`) becomes the URL slug: `my-post.md` → `/blog/my-post`.
- Set `draft: true` in the frontmatter to keep a post out of the blog index, RSS feed, and
  sitemap while it's a work in progress.
- Root-relative links in post content (e.g. `[RSS feed](/rss.xml)`) are automatically rewritten
  to include the site's base path by a remark plugin (`src/remark-base-path.mjs`) — write links
  naturally, without `/doctor-ra` prefixed.

## Adding a project

Add an entry to the `projects` array in `src/data/projects.ts`. Set `featured: true` to have it
show on the homepage (only the first two featured projects are shown there).

## Editing the timeline / bio / contact info

- Bio and page copy live directly in `src/pages/about.astro`.
- The "Journey" timeline is data-driven from `src/data/timeline.ts`.
- Site-wide info (name, tagline, email, GitHub URL) lives in `src/data/site.ts` — this is the
  single source of truth used across the header, footer, SEO tags, and RSS feed.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it
to GitHub Pages via GitHub Actions. The live site is at:

```
https://doctor-ra.github.io/doctor-ra/
```

**One-time setup**: in the repo's Settings → Pages, set **Source** to **GitHub Actions** (only
needed once; skip if already configured).

## Game leaderboard (optional shared database)

The game at `/game` saves high scores in each visitor's own browser (localStorage) by default —
no setup needed. To switch on a **global leaderboard shared by everyone who plays**, the site
needs a small hosted database (GitHub Pages is static and can't store data itself). Free
5-minute setup with [Supabase](https://supabase.com):

1. Create a free Supabase account and a new project.
2. In the project's **SQL Editor**, run:

   ```sql
   create table public.scores (
     id bigint generated always as identity primary key,
     name text not null check (char_length(name) between 1 and 20),
     score integer not null check (score between 0 and 1000000),
     created_at timestamptz not null default now()
   );

   alter table public.scores enable row level security;
   create policy "anyone can read scores" on public.scores for select using (true);
   create policy "anyone can add a score" on public.scores for insert with check (true);
   ```

3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key into
   `src/data/leaderboard.ts`, then commit and push. That's it — the game switches to the
   shared board automatically.

Notes: the anon key is designed to be public (the policies above only allow reading scores and
adding new ones — nothing can be edited or deleted). Because anyone can submit a score, a
determined prankster could post fake ones; for a fun toy leaderboard that's a reasonable
trade-off. If it ever gets spammed, delete rows in the Supabase table editor.

## Switching to a custom domain

If Rohit buys a custom domain later, only two things change:

1. In `astro.config.mjs`, update `site` to the new domain and change `base` to `'/'` (project
   pages need a base path; a custom domain at the root doesn't).
2. Add a `public/CNAME` file containing the domain name (e.g. `example.com`).

Everything else (internal links, the remark base-path plugin, RSS/sitemap URLs) is derived from
that config, so no other files need to change.

## Known non-blockers

- Astro's `markdown.remarkPlugins` option prints a deprecation notice during build (Astro 7
  changed its default Markdown engine). It still works correctly; it's just a console warning,
  not a build error.
