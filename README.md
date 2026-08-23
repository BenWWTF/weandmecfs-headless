# WE&ME Foundation — headless rebuild

A headless WordPress + Next.js rebuild of [weandmecfs.org](https://www.weandmecfs.org).
Editors keep using the WordPress admin they already know; the public
site is served by a Next.js 15 + React 19 + GSAP frontend that reads
WordPress over the REST API.

This is **session 1** of a 5-session plan. See
[`docs/SESSION_PLAN.md`](docs/SESSION_PLAN.md) for the full breakdown
and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the system
diagram.

## What's in session 1

- A working local dev setup (PHP + MySQL + Next.js, no Docker).
- A custom WordPress plugin with **7 custom post types** (Calls, Funded
  Projects, Stories, Team & Board, Partners, Events, Guardians) and
  schema-driven meta boxes.
- A minimal **headless WordPress theme** that replaces the old
  `weandmecfs` theme for front-end rendering.
- The **homepage rebuilt** from the Lovable mockup — Hero, WhyFund
  (with GSAP scroll-linked spine and count-up), Researcher, Disease,
  Stories, Campaign slot, Guardians, BarsDivider, Latest.
- A second page, **`/about`**, to prove the content pattern works.
- An on-demand **revalidation webhook** at `/api/revalidate` so editor
  publishes are live in ~2 s.
- A seed script that populates WordPress with the real WE&ME content
  (Mila, Carmen, Yvonne, Madeleine, Petra; the 2026 calls; the
  funded projects; team; partners; guardians).
- Full docs: architecture, deploy runbook, editor guide, session plan.

## Requirements

- macOS or Linux
- **PHP 8.1+** with the usual extensions (mysqli, mbstring, intl, xml)
- **MySQL 8+** or MariaDB 10.6+
- **Node 22+**, **pnpm 10+** (or npm 10+ / bun 1+)
- `curl`, `tar`

No Docker required.

## Quick start (local dev)

```bash
# 1. Install WordPress core, link the plugin and theme, create the
#    database and run the installer.
scripts/setup-wp.sh

# 2. Seed the local install with the real WE&ME content.
scripts/seed-content.sh

# 3. Start WordPress on :8080 and Next.js on :3000 side by side.
scripts/dev.sh
```

Now:

- **Frontend**: <http://localhost:3000>
- **WordPress admin**: <http://localhost:8080/wp-admin> (admin / admin)
- **REST API**: <http://localhost:8080/wp-json/wp/v2/>

Edit a story in wp-admin, save it, and watch the homepage reflect
the change within ~2 seconds.

## Project layout

```
weandmecfs-headless/
├── docs/                              ← ARCHITECTURE, DEPLOY, EDITOR_GUIDE, SESSION_PLAN
├── scripts/                           ← setup-wp, seed-content, dev
├── wp-content/
│   ├── plugins/weandmecfs-headless/   ← the editor-facing plugin
│   └── themes/weandmecfs-headless/    ← minimal headless theme
└── web/                               ← Next.js 15 + React 19 + TS
    ├── app/                           ← routes (App Router)
    ├── components/
    │   ├── site/                      ← SiteNav, SiteFooter, Logo
    │   ├── home/                      ← Hero, WhyFund, Stories, etc.
    │   └── ui/
    ├── lib/                           ← wp.ts, decode, utils
    └── public/fonts/                  ← drop Klarheit Grotesk woff2 here
```

## Configuring the revalidation webhook

After `scripts/setup-wp.sh`, the local WordPress is missing the
revalidation URL and secret. To wire it up:

1. Generate a secret: `openssl rand -hex 32`
2. Edit `web/.env.local` and add:
   ```
   WEANDME_REVALIDATION_SECRET=<paste-the-secret>
   ```
3. Restart `scripts/dev.sh` so the Next.js process picks up the env.
4. In `wp-admin` → Settings → WE&ME Headless:
   - **Frontend revalidate URL**: `http://localhost:3000/api/revalidate`
   - **Shared secret**: paste the same secret.
5. Click **Revalidate /**. The page should reload within 1-2 s.

## Production deploy

See [`docs/DEPLOY.md`](docs/DEPLOY.md). The Nessus box already runs
WordPress 7.0.4 + WPML + Yoast. The deploy adds:

- A Node 22 systemd service for the Next.js frontend.
- A new Nginx vhost that routes `/wp-admin`, `/wp-json`, `/wp-content`
  to WordPress and everything else to Next.js.

The new theme's `template_redirect` hook emits a 410 Gone + redirect
to the Next.js URL for any request that bypasses Nginx (e.g. if the
vhost is misconfigured during cutover).

## What you need to do

- **Drop the Klarheit Grotesk woff2 files** into `web/public/fonts/`.
  The mockup looks the same with the General Sans fallback, but the
  production site uses Klarheit. Names must match what
  `app/globals.css` expects:
  - `klarheit-grotesk-regular.woff2`
  - `klarheit-grotesk-medium.woff2`
  - `klarheit-grotesk-semibold.woff2`
  - `klarheit-grotesk-bold.woff2`
- **Replace the placeholder hero photo** with the final Brent Stirton
  asset. The seed script puts the WE&ME logo into the media library;
  the Hero component currently points at
  `https://www.weandmecfs.org/wp-content/uploads/2025/12/hero-bed.jpg`
  (the live site). Once the team provides the final asset, upload it
  to WordPress and update the URL in `web/components/home/Hero.tsx`.
- **Pull the partner logos** (FWF, WWTF, S4ME) into
  `web/public/images/partners/` and update the `decides` block in
  `web/components/home/WhyFund.tsx` to use them.

## Status

Session 1 — done. Ready for review.

Next: session 2 adds WPGraphQL + ACF Pro for typed schema-driven
flexible content, plus the remaining inner pages (`/research`,
`/stories`, `/news`, `/support`).
