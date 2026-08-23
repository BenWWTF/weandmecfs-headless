import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { BackToTop } from "@/components/site/BackToTop";

// Klarheit Grotesk — licensed to WE&ME Foundation.
// Loaded via next/font/local so the @font-face URL auto-prepends the
// basePath on GitHub Pages. We only ship the regular weight file; the
// mockup uses font-synthesis for any semibold/bold rendering. Variable
// font support isn't available for this foundry, so we declare a
// single weight and let the browser synthesize the rest.
const klarheit = localFont({
  src: "../public/fonts/klarheit-grotesk-regular.woff2",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-klarheit",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://www.weandmecfs.org"),
  title: {
    default: "WE&ME Foundation — A future without ME/CFS",
    template: "%s · WE&ME Foundation",
  },
  description:
    "We fund research and fight for everyone affected by ME/CFS. Your donation makes a cure possible.",
  openGraph: {
    type: "website",
    siteName: "WE&ME Foundation",
    title: "WE&ME Foundation — A future without ME/CFS",
    description: "Together we will cure ME/CFS. Fund research. Stand with those affected.",
  },
  twitter: { card: "summary_large_image", site: "@weandmecfs" },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      de: "/de",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#2e73db",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={klarheit.variable}>
      <body className="min-h-screen bg-white text-ink antialiased">
        <ReadingProgress />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
