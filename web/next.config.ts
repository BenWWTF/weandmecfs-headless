import type { NextConfig } from "next";

/**
 * Next.js config for the WE&ME frontend.
 *
 * Two deployment modes:
 *   - Production with live WordPress → dynamic SSR, ISR (revalidate)
 *   - Static export (GitHub Pages) → `next build` produces `out/`,
 *     pages are pre-rendered at build time, no server needed
 *
 * For the GitHub Pages deploy, set `NEXT_PUBLIC_USE_DEMO_DATA=1` at
 * build time so the static pages render the seed data even when
 * the WordPress REST API isn't reachable from the build runner,
 * and apply the basePath so all asset / link URLs point under
 * /weandmecfs-headless/.
 */
const isDemoBuild = process.env.NEXT_PUBLIC_USE_DEMO_DATA === "1";
const BASE_PATH = isDemoBuild ? "/weandmecfs-headless" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // basePath rewrites <Link>, <Image>, script, and CSS asset URLs so
  // that the static export serves correctly from the GitHub Pages
  // subpath /weandmecfs-headless/. In live-WP mode (Nessus deploy)
  // the site lives at the domain root, so basePath stays empty.
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,

  // `output: 'export'` enables full static export for the GitHub
  // Pages demo build. Live WP mode (local dev against :8080, or the
  // Nessus deploy) runs as a normal Next.js server with ISR, so
  // `output` stays unset there — `output: 'export'` requires
  // `images.unoptimized: true` unconditionally, which would break
  // the WP-served image proxy in live mode.
  ...(isDemoBuild ? { output: "export" as const, trailingSlash: true } : {}),

  images: {
    // Unoptimized is required for `output: 'export'`. With a live
    // server we keep optimization on for the WP-served image proxy.
    unoptimized: isDemoBuild,
    remotePatterns: [
      { protocol: "https", hostname: "www.weandmecfs.org" },
      { protocol: "https", hostname: "weandmecfs.org" },
      // Local dev: WordPress is served on :8080
      { protocol: "http", hostname: "localhost", port: "8080" },
    ],
  },

  // Security headers — match what the live site already sends.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
