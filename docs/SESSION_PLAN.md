# WE&ME headless rebuild — session plan

Server: NESSUS GmbH (Vienna), WordPress 7.0.4 + WPML 4.9.6 + Yoast SEO 28.2,
existing custom theme at `wp-content/themes/weandmecfs/`. We **keep the WP
install** and replace only the PHP theme with a Next.js frontend. The
editor experience stays 100% in `wp-admin`.

## Stack

| Layer            | Choice                                  | Why                                         |
|------------------|-----------------------------------------|---------------------------------------------|
| Backend          | WordPress 7.0.4 (existing)              | Editors already use it; keep their flow     |
| Backend plugins  | WPGraphQL, ACF Pro, WPML, Yoast, Wordfence | Typed queries, flexible content, EN/DE, SEO |
| Frontend         | Next.js 15 (App Router) + React 19      | Mirrors the mockup stack; ISR for freshness |
| Styling          | Tailwind CSS v4 (token-based)           | Same tokens as the Lovable export           |
| Motion           | GSAP + ScrollTrigger + DrawSVGPlugin    | WhyFund spine, "Step by step" walker        |
| Frontend host    | Same Nessus box, alongside WP           | "Same server as existing weandmecfs.org"    |
| Type bridge      | GraphQL Code Generator (typed SDK)      | End-to-end types WP schema → React props    |

## Routing on the Nessus box

```
Browser → :443 (nginx)
  ├── /wp-admin/*        → WP  (PHP-FPM)
  ├── /wp-login.php      → WP
  ├── /wp-json/*         → WP  (REST; media URLs)
  ├── /wp-content/*      → WP  (served as static)
  ├── /graphql           → WP  (WPGraphQL)
  ├── /api/revalidate    → Next.js  (webhook from WP)
  └── /*                 → Next.js  (the marketing site)
```

The frontend fetches content from the WP GraphQL endpoint server-side (never
client-side), and WP's `save_post` / `acf/save_post` hooks fire a webhook to
`/api/revalidate` so the front stays in sync within seconds of a publish.

## 5-session plan

### Session 1 — Foundations + homepage (this session)

**Goal:** editors can publish content in WP, the homepage on Next.js reflects
it within ~60 s. Local dev works on the Mac (PHP + MySQL + Next.js, no
Docker). One inner page proves the content pattern.

**Deliverables**
- `weandmecfs-headless/` monorepo (this folder)
- `web/` — Next.js 15 project (App Router, React 19, Tailwind v4, GSAP)
  - Full homepage rebuilt from the Lovable mockup
  - All section components (Hero, WhyFund, Researcher, Disease, Stories,
    Campaign, Guardians, BarsDivider, Latest, SiteNav, SiteFooter, Logo)
  - Content pulled from WP REST API (GraphQL in session 2)
  - One inner page: `/about` (proves pattern for content-driven pages)
  - On-demand revalidation webhook at `/api/revalidate`
- `wp-content/plugins/weandmecfs-headless/` — the headless-CMS plugin
  - Custom Post Types: `call`, `project`, `story`, `team`, `partner`,
    `event`, `guardian`
  - Meta boxes (ACF-free for v1, ACF Pro in session 2)
  - REST API field exposure for each CPT
  - Webhook on publish → Next.js revalidation
- `wp-content/themes/weandmecfs-headless/` — minimal headless theme that
  replaces the old `weandmecfs` theme's *front-end rendering* (keeps editor
  admin, drops the PHP page templates)
- `scripts/setup-wp.sh` — installs WP core, links the plugin, creates the
  database, runs the WP installer
- `scripts/seed-content.sh` + `scripts/seed-content.php` — seeds the seven
  patient stories, the 2026 calls, the funded projects, the team
- `scripts/dev.sh` — boots WP (`php -S :8080 -t wp/`) and Next.js
  (`pnpm dev`) side by side
- `docs/ARCHITECTURE.md` — system diagram, data flow, ISR strategy
- `docs/DEPLOY.md` — Nessus box cutover (Nginx vhost, systemd units,
  secrets, rollback)
- `docs/EDITOR_GUIDE.md` — one-pager for Therese & Ben: "here's how you
  publish a story / change a homepage block / add a call"
- `README.md` — orientation + how to run

**Out of scope this session**
- WPGraphQL + ACF Pro (session 2)
- All inner pages except `/about` (session 2)
- Multilingual / EN-DE / WPML wiring (session 3)
- RaiseNow donation form, newsletter (sessions 3-4)
- Sitemap, structured data, SEO polish (session 3)
- Content migration from the old theme (session 4)
- Production cutover (session 5)

### Session 2 — GraphQL, ACF, remaining pages

- Add WPGraphQL + ACF Pro
- Convert CPT meta boxes → ACF field groups (typed GraphQL schema)
- Build remaining inner pages: `/research`, `/stories`, `/news`, `/support`,
  `/donate`
- 404 / search results

### Session 3 — Forms, multilingual, SEO

- RaiseNow donation form (drop-in script)
- Newsletter (Mailchimp or similar)
- WPML EN/DE on the Next side (locale routing, hreflang)
- Yoast meta integration (`next-seo`)
- Sitemap, robots.txt, structured data (Organization, BreadcrumbList,
  Article for posts)
- Performance: image optimization, font preloading, Core Web Vitals

### Session 4 — Hardening + content migration

- Content migration from old theme → new schema (one-time script)
- Media optimization (WebP/AVIF via Next.js, srcset)
- Security headers, CSP, HSTS pre-load check
- Backup + restore playbook
- Accessibility audit (WCAG 2.1 AA target — important for a site whose
  users include people with ME/CFS, where fonts/spacing/contrast matter)

### Session 5 — Production cutover

- Nessus box: install Node, build Next.js, systemd units, Nginx vhost
- DNS: keep `weandmecfs.org` on the same IP, change Nginx upstream
- Run the new site behind a `/v2` flag, A/B for a week
- Cutover checklist + rollback plan
- Monitoring: uptime, response time, error tracking
- Handoff doc for whoever maintains the box

## Open questions (resolve before session 2)

- Where will the Next.js process run on the Nessus box? (Same user as WP,
  separate user, Docker-less systemd unit?)
- Is there an external admin who manages the box, or do you have shell
  access? (Affects how the deploy runbook is written.)
- Do you want ACF Pro (paid) or stick with native meta boxes? (Pro is much
  nicer for the flexible-content homepage editor experience, but it's
  ~USD 50/year and needs a license key.)
- For the 2026 call: does the homepage's "Step by step" animation reference
  the new call (€2M, deadline 25 Aug 2026) or stay generic?
