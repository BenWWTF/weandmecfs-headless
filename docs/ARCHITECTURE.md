# Architecture

## One-screen view

```
                      ┌────────────────────────────────────────────┐
                      │   Browser (weandmecfs.org)                │
                      └────────────────────┬───────────────────────┘
                                           │ HTTPS
                                           ▼
                      ┌────────────────────────────────────────────┐
                      │   Nginx on the Nessus box (5.183.173.98)   │
                      │                                            │
                      │   /wp-admin/*          → WP   (8081)       │
                      │   /wp-login.php        → WP   (8081)       │
                      │   /wp-json/*           → WP   (8081)       │
                      │   /wp-content/*        → WP   (8081)       │
                      │   /api/revalidate      → Next (3000)       │
                      │   /*                   → Next (3000)       │
                      └────────────┬────────────────┬──────────────┘
                                   │                │
                                   ▼                ▼
                          ┌──────────────┐    ┌─────────────────────┐
                          │  WordPress   │    │  Next.js (Node 22)  │
                          │  PHP-FPM     │    │  React 19, TS, GSAP │
                          │  MySQL 8     │    │  Tailwind v4        │
                          └──────────────┘    └─────────────────────┘
                                   │                ▲
                                   └────  POST /api/revalidate
                                          (signed HMAC, save_post hook)
```

## Data flow

1. **Editor** publishes a story in `wp-admin`.
2. **`save_post_story`** hook fires.
3. The plugin's `WeAndMe_Headless_Revalidation::dispatch()` looks up the
   paths that depend on that post (`/`, `/stories`, `/stories/{slug}`)
   and signs a JSON body with the shared secret.
4. The plugin POSTs to `https://www.weandmecfs.org/api/revalidate` in the
   background (non-blocking, 4 s timeout).
5. Next.js's `/api/revalidate` verifies the signature, calls
   `revalidatePath()` for each path and `revalidateTag('homepage')`.
6. The next request to those paths regenerates from the latest WP REST
   response, and the editor's change is live in seconds.

## Why headless WordPress specifically

| Concern                     | WordPress admin keeps working | React frontend gets the design freedom |
|-----------------------------|--------------------------------|----------------------------------------|
| Editors (Therese, Ben)     | Familiar UI, no retraining     |                                        |
| Multilingual (EN/DE)       | WPML already in use             | Frontend renders the right locale       |
| SEO                         | Yoast meta tag emission         | We read the Yoast fields via REST      |
| Brand changes               | ACF Pro for flexible content    | Design tokens stay in code             |
| Media                       | Existing uploads library        | Served by `next/image`                 |

The two halves share **only the database and the media folder** — there
is no shared code. The frontend treats WordPress as a remote API.

## File layout

```
weandmecfs-headless/
├── docs/                     ← you are here
├── scripts/
│   ├── setup-wp.sh           ← install WP core + link plugin/theme
│   ├── seed-content.sh       ← populate with real WE&ME content
│   ├── seed-content.php      ← the actual seed data
│   └── dev.sh                ← run WP + Next.js side by side
├── wp-content/
│   ├── plugins/
│   │   └── weandmecfs-headless/   ← the editor-facing plugin
│   │       ├── weandmecfs-headless.php   (loader)
│   │       └── includes/
│   │           ├── class-cpt.php          (registers 7 CPTs)
│   │           ├── class-meta.php         (meta boxes, save_post)
│   │           ├── class-rest.php         (exposes meta in REST)
│   │           ├── class-revalidation.php (webhook to Next.js)
│   │           ├── class-admin.php        (settings page)
│   │           └── class-graphql.php      (no-op until WPGraphQL)
│   └── themes/
│       └── weandmecfs-headless/   ← minimal headless theme
│           ├── style.css
│           ├── functions.php      (410 + redirect to Next)
│           └── index.php
└── web/                      ← Next.js 15 + React 19
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx           ← homepage
    │   ├── about/page.tsx     ← /about
    │   ├── api/revalidate/route.ts
    │   ├── globals.css
    │   └── not-found.tsx
    ├── components/
    │   ├── site/   SiteNav, SiteFooter, Logo, SigneMark
    │   ├── home/   Hero, WhyFund, Researcher, Disease, Stories,
    │   │          Campaign, Guardians, BarsDivider, Latest
    │   └── ui/     SliderImage
    ├── lib/
    │   ├── wp.ts              ← WordPress REST client + zod schemas
    │   ├── decode.ts          ← strip HTML entities
    │   └── utils.ts
    ├── public/
    │   ├── fonts/             ← Klarheit Grotesk (drop in 4 woff2)
    │   └── images/            ← local assets
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    └── postcss.config.mjs
```

## Data model

Seven custom post types share a single source of truth
(`WeAndMe_Headless_CPT::SCHEMA`) that drives:

1. `register_post_type` arguments
2. Meta box UI (one box per CPT, schema-driven form)
3. REST field registration (`/wp-json/wp/v2/{slug}?{field}=…`)
4. GraphQL field registration (when WPGraphQL is active, session 2)

Adding a field to the SCHEMA adds it everywhere — there is no manual
re-typing of meta keys, REST schemas, or GraphQL types.

## ISR strategy

Pages use Next.js's `revalidate` option, which is shorthand for ISR
(incremental static regeneration). The default is 60 s for the homepage
and 300 s for inner pages. On top of that:

- `revalidateTag('homepage')` after any homepage-affecting post
- `revalidateTag('story')` after any story publish
- `revalidatePath('/stories')` plus `/stories/{slug}` after a single
  story save (so the change is live within a second)

For session 1 we use `revalidatePath`; session 2 swaps to a tag-only
strategy once we have a clear tag taxonomy.

## What we are not doing in session 1

- **WPGraphQL** — REST is enough for the homepage. The plugin's
  `class-graphql.php` is wired in but no-op.
- **ACF Pro** — meta boxes are native WordPress. We add ACF in session
  2 so the homepage can be edited as flexible content.
- **Multilingual** — `alternates.languages` is set in metadata but the
  `/de` locale is not yet rendered. WPML keeps the translations on
  the WP side in the meantime.
- **Donation form** — the donate URL goes to RaiseNow. A drop-in
  form lands in session 3.
- **Newsletter** — same.
- **Sitemap / structured data** — session 3.
