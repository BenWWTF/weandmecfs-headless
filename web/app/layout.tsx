import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { BackToTop } from "@/components/site/BackToTop";

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
    <html lang="en">
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
