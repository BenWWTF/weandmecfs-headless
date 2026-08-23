import type { NextConfig } from "next";

/**
 * Next.js config for the WE&ME frontend.
 *
 * `images.remotePatterns` is the allowlist for next/image — the
 * WordPress media domain is the only one we trust. Add more patterns
 * (e.g. an image CDN later) by appending entries here.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
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

  // ISR: pages that have no explicit `revalidate` get this default.
  // Per-page revalidate is set in app/page.tsx and app/about/page.tsx.
};

export default nextConfig;
