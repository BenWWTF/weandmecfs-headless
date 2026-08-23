/**
 * WordPress REST client.
 *
 * The frontend reads the WP install over the WP REST API. In local dev
 * we hit http://localhost:8080 (the PHP server in setup-wp.sh). In
 * production we hit the same host as the site, /wp-json/wp/v2/*.
 *
 * Every fetch uses Next.js ISR via `next: { revalidate: N, tags: [...] }`,
 * so each route is regenerated on demand and the WP webhook (see
 * /api/revalidate) flushes the right tags on publish.
 *
 * Note: the fields registered via `register_rest_field` in the WP plugin
 * are emitted at the top level of each response, not under `meta`. The
 * standard WP `meta` field is an array of footnotes — different thing.
 */

import { z } from "zod";

export const WP_BASE_URL = process.env.WP_BASE_URL
  ?? (process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://www.weandmecfs.org");

/* ------------------------------------------------------------------ */
/* Schemas (kept in lock-step with the plugin's class-cpt.php)         */
/* ------------------------------------------------------------------ */

const MediaSchema = z.object({
  id: z.number(),
  source_url: z.string().url(),
  alt_text: z.string().optional(),
  media_details: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
});
export type Media = z.infer<typeof MediaSchema>;

const StorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }).optional(),
  // Flattened `register_rest_field` outputs:
  age: z.number().nullable().optional(),
  location: z.string().nullable().optional(),
  onset_year: z.number().nullable().optional(),
  short_bio: z.string().nullable().optional(),
  long_story_url: z.string().nullable().optional(),
  photographer: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  display_order: z.number().nullable().optional(),
  _embedded: z.object({
    "wp:featuredmedia": z.array(MediaSchema).optional(),
  }).optional(),
});
export type Story = z.infer<typeof StorySchema>;

const CallSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }).optional(),
  status: z.enum(["open", "upcoming", "closed"]).nullable().optional(),
  amount_total: z.number().nullable().optional(),
  deadline: z.string().nullable().optional(),
  external_url: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  display_order: z.number().nullable().optional(),
});
export type Call = z.infer<typeof CallSchema>;

const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }).optional(),
  institution: z.string().nullable().optional(),
  amount: z.number().nullable().optional(),
  year: z.number().nullable().optional(),
  call_id: z.number().nullable().optional(),
  lead_team_id: z.number().nullable().optional(),
  external_url: z.string().nullable().optional(),
  display_order: z.number().nullable().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

const GuardianSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  quote: z.string().nullable().optional(),
  since: z.number().nullable().optional(),
  external_url: z.string().nullable().optional(),
  display_order: z.number().nullable().optional(),
  _embedded: z.object({
    "wp:featuredmedia": z.array(MediaSchema).optional(),
  }).optional(),
});
export type Guardian = z.infer<typeof GuardianSchema>;

const TeamMemberSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }).optional(),
  role: z.string().nullable().optional(),
  role_type: z.enum(["team", "advisor", "jury", "alumni"]).nullable().optional(),
  x_handle: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  display_order: z.number().nullable().optional(),
  _embedded: z.object({
    "wp:featuredmedia": z.array(MediaSchema).optional(),
  }).optional(),
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

const PageSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }).optional(),
});
export type WPPage = z.infer<typeof PageSchema>;

const PostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  date: z.string(),
  _embedded: z.object({
    "wp:featuredmedia": z.array(MediaSchema).optional(),
  }).optional(),
});
export type WPPost = z.infer<typeof PostSchema>;

/* ------------------------------------------------------------------ */
/* Low-level fetch                                                     */
/* ------------------------------------------------------------------ */

type FetchOpts = {
  revalidate?: number;
  tags?: string[];
};

/**
 * Low-level WP fetch. Degrades gracefully: if WP is down, hasn't been
 * migrated yet, or returns an error, the call resolves with `fallback`
 * (default: empty array) instead of throwing. The frontend prefers to
 * show the layout with empty sections rather than a 500.
 */
async function wpFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  opts: FetchOpts & { fallback?: T } = {},
): Promise<T> {
  const fallback = (opts.fallback ?? []) as T;
  const url = `${WP_BASE_URL}/wp-json/wp/v2${path}`;
  try {
    const res = await fetch(url, {
      next: {
        revalidate: opts.revalidate ?? 60,
        tags: opts.tags ?? [],
      },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[wp] ${res.status} for ${url} — using fallback`);
      }
      return fallback;
    }
    const json = await res.json();
    return schema.parse(json);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[wp] fetch failed for ${url}:`, (e as Error).message);
    }
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* High-level queries                                                  */
/* ------------------------------------------------------------------ */

export const homepageRevalidate = 60; // seconds

export async function getStories(): Promise<Story[]> {
  return wpFetch(
    "/story?per_page=12&orderby=menu_order&order=asc&_embed=1",
    z.array(StorySchema),
    { revalidate: homepageRevalidate, tags: ["story", "homepage"] },
  );
}

export async function getCalls(): Promise<Call[]> {
  return wpFetch(
    "/call?per_page=20&orderby=menu_order&order=asc",
    z.array(CallSchema),
    { revalidate: homepageRevalidate, tags: ["call", "homepage"] },
  );
}

export async function getProjects(): Promise<Project[]> {
  return wpFetch(
    "/project?per_page=20&orderby=menu_order&order=asc",
    z.array(ProjectSchema),
    { revalidate: homepageRevalidate, tags: ["project", "homepage"] },
  );
}

export async function getGuardians(): Promise<Guardian[]> {
  return wpFetch(
    "/guardian?per_page=12&orderby=menu_order&order=asc&_embed=1",
    z.array(GuardianSchema),
    { revalidate: homepageRevalidate, tags: ["guardian", "homepage"] },
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  return wpFetch(
    "/team?per_page=40&orderby=menu_order&order=asc&_embed=1",
    z.array(TeamMemberSchema),
    { revalidate: 300, tags: ["team"] },
  );
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const pages = await wpFetch(
    `/pages?slug=${encodeURIComponent(slug)}`,
    z.array(PageSchema),
    { revalidate: 300, tags: [`page:${slug}`], fallback: [] },
  );
  return pages[0] ?? null;
}

export async function getLatestPosts(count = 5): Promise<WPPost[]> {
  return wpFetch(
    `/posts?per_page=${count}&orderby=date&order=desc&_embed=1`,
    z.array(PostSchema),
    { revalidate: 120, tags: ["post", "homepage"] },
  );
}
