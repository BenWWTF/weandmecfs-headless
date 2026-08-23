/**
 * Build-time basePath helper.
 *
 * In the live (Nessus) deploy the site lives at the domain root, so
 * `BASE_PATH` is the empty string. In the static GitHub Pages demo it
 * is `/weandmecfs-headless`. Both are baked in at build time by
 * Next.js' `NEXT_PUBLIC_*` env-var inlining, so the helper is free at
 * runtime.
 *
 * Use it for any path that Next.js doesn't already rewrite for us:
 * raw `<img src>` from `next/image` with `unoptimized: true`,
 * `srcSet` entries, `<a href>` we control manually, etc. The
 * `next/link` and `next/script` paths are auto-rewritten by Next.js
 * based on `basePath` in `next.config.ts`, so don't double-apply
 * the helper there.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Join the build-time basePath with a path. Empty basePath → no-op. */
export function withBasePath(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("mailto:") || path.startsWith("tel:")) return path;
  // Don't double-prefix if the path already has the basePath.
  if (BASE_PATH && path.startsWith(BASE_PATH + "/")) return path;
  return BASE_PATH + path;
}

/** The literal basePath, useful for the rare case where you need the
 *  prefix on its own (e.g. inside a CSS variable or a JSON manifest). */
export const BASE_PATH_PREFIX = BASE_PATH;
