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
 * the WordPress REST API isn't reachable from the build runner.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // `output: 'export'` enables full static export for the GitHub
  // Pages demo. When deploying to Nessus (live WP) we keep ISR
  // available, so this stays on in this build. To go back to the
  // dynamic ISR mode for production, comment out the next two lines
  // and set `unoptimized: false` below.
  output: "export",
  trailingSlash: true,

  images: {
    // Unoptimized is required for `output: 'export'`. With a live
    // server we keep optimization on for the WP-served image proxy.
    unoptimized: process.env.NEXT_PUBLIC_USE_DEMO_DATA === "1",
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
