"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

type Sub = { label: string; href: string; tag?: string };
type Group = { label: string; href: string; hash?: string; items: Sub[] };

const groups: Group[] = [
  {
    label: "About Us",
    // Foundation (mission, story, team, partners, transparency) lives
    // on its own page now — the old `/about` content moved there.
    href: "/foundation",
    items: [
      { label: "Our Mission",       href: "/foundation#mission" },
      { label: "Our Story",         href: "/foundation#story" },
      { label: "Our Team & Boards", href: "/foundation#team" },
      { label: "Partners",          href: "/foundation#partners" },
      { label: "Transparency",      href: "/foundation#transparency" },
    ],
  },
  {
    label: "What is ME/CFS?",
    href: "/about#what",
    items: [
      { label: "What is ME/CFS?",       href: "/about#what" },
      { label: "Who develops ME/CFS?",  href: "/about#who" },
      { label: "Severity & disease burden", href: "/about#severity" },
      { label: "Course, diagnosis & treatment", href: "/about#course" },
      { label: "Terminology & comorbidities",   href: "/about#terminology" },
      { label: "Living with ME/CFS",    href: "/stories" },
    ],
  },
  {
    label: "Research",
    // Top-level "Research" jumps straight to the first subpoint
    // (the strategy section) so the user lands on the substance
    // instead of the page header.
    href: "/research",
    hash: "strategy",
    items: [
      { label: "Research strategy",           href: "/research#strategy" },
      { label: "WE&ME Projects",              href: "/research#projects" },
      { label: "WE&ME Emerging Leader Award", href: "/research#award" },
      { label: "ME/CFS Fellowships",          href: "/research#fellowships" },
      { label: "All funded research",         href: "/research#funded" },
      { label: "Call for proposals",          href: "/research#proposals" },
    ],
  },
  {
    label: "News",
    // Renamed from /news to /blog per the upstream mockup rename.
    href: "/blog",
    items: [
      { label: "Latest News",  href: "/blog#news" },
      { label: "Events",       href: "/blog#events" },
      { label: "Newsletter",   href: "/blog#newsletter" },
      { label: "Archive",      href: "/blog#archive" },
    ],
  },
  {
    label: "Notes on ME/CFS",
    href: "/blog",
    hash: "notes",
    items: [],
  },
  {
    label: "Support",
    href: "/support",
    items: [
      { label: "Donations",                   href: "/support#donations" },
      { label: "Become a Guardian",           href: "/support#guardian" },
      { label: "Awareness & Information Materials", href: "/support#materials" },
      { label: "Shop",                        href: "/shop", tag: "Soon" },
    ],
  },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [showFund, setShowFund] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Derive the current language from the URL path. The demo build
  // serves English; the live weandmecfs.org serves German under
  // /de/… via WPML. The DE link below takes the user to the
  // equivalent German page on the live site, preserving the path
  // when it makes sense.
  const [currentLang, setCurrentLang] = useState<"EN" | "DE">("EN");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    setCurrentLang(path.startsWith("/de") ? "DE" : "EN");
  }, []);

  const deUrl =
    typeof window !== "undefined"
      ? `https://www.weandmecfs.org/de${window.location.pathname.replace(/^\/weandmecfs-headless/, "")}`
      : "https://www.weandmecfs.org/de/";

  // Show "Fund the Research" once the hero donate button scrolls past.
  useEffect(() => {
    const el = document.getElementById("hero-donate");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowFund(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const closeAll = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-ink/8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 md:px-10">
        <Link href="/" className="flex items-center" aria-label="WE&ME Foundation — home" onClick={closeAll}>
          <Logo variant="written" className="text-[19px] md:text-[21px]" />
        </Link>

        <nav className="hidden lg:flex gap-8" aria-label="Primary">
          {groups.map((g) => (
            <div key={g.label} className="group relative">
              <Link
                href={g.hash ? `${g.href}#${g.hash}` : g.href}
                className="text-[15px] font-semibold text-ink/70 hover:text-ink transition-colors"
              >
                {g.label}
              </Link>
              {g.items.length > 0 && (
                <div className="invisible absolute left-0 top-full z-50 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[280px] rounded-2xl border border-ink/10 bg-white p-3 shadow-xl">
                    {g.items.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        className="flex items-center rounded-lg px-3 py-2 text-[15px] text-ink/80 hover:bg-mint hover:text-ink"
                      >
                        {s.label}
                        {s.tag && (
                          <span className="ml-2 text-[11px] uppercase tracking-[0.08em] text-ink/55">
                            {s.tag}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/support#donations"
            className="inline-flex items-center rounded-full bg-urgency px-4 py-2 md:px-5 md:py-2.5 text-sm font-bold text-ink transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ink"
          >
            {showFund && !open ? "Fund the Research" : "Donate"}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              aria-label="Switch language"
              aria-expanded={langOpen}
              title={currentLang === "EN" ? "Auf Deutsch" : "In English"}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-ink/80 border border-ink/20 rounded-full hover:bg-ink hover:text-white transition"
            >
              {currentLang} <span aria-hidden>⌄</span>
            </button>
            {langOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl border border-ink/10 bg-white p-2 shadow-xl z-50"
              >
                <div className="px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-ink/55">
                  Language
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setLangOpen(false)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[14px] font-medium text-ink/80 hover:bg-mint"
                >
                  <span>EN — English</span>
                  {currentLang === "EN" && <span aria-hidden>✓</span>}
                </button>
                <a
                  role="menuitem"
                  href={deUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[14px] font-medium text-ink/80 hover:bg-mint"
                >
                  <span>DE — Deutsch</span>
                  {currentLang === "DE" && <span aria-hidden>✓</span>}
                </a>
                <p className="px-3 py-2 text-[11px] leading-snug text-ink/50">
                  German content is served by the live site via WPML.
                </p>
              </div>
            )}
          </div>

          <button
            className="lg:hidden text-sm font-medium p-2"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-ink/10 bg-white lg:hidden max-h-[calc(100svh-60px)] overflow-y-auto">
          <div className="px-7 pb-12 pt-2">
            {groups.map((g) => {
              const isOpen = openGroup === g.label;
              if (g.items.length === 0) {
                return (
                  <div key={g.label} className="border-b border-ink/10">
                    <Link
                      href={g.hash ? `${g.href}#${g.hash}` : g.href}
                      onClick={closeAll}
                      className="flex h-14 w-full items-center text-left text-[22px] font-semibold"
                    >
                      {g.label}
                    </Link>
                  </div>
                );
              }
              return (
                <div key={g.label} className="border-b border-ink/10">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : g.label)}
                    aria-expanded={isOpen}
                    className="flex h-14 w-full items-center justify-between text-left text-[22px] font-semibold"
                  >
                    {g.label}
                    <span className={cn("text-ink/50 transition-transform", isOpen && "rotate-180")} aria-hidden>
                      ⌄
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-2">
                      {g.items.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          onClick={closeAll}
                          className="flex h-11 items-center pl-4 text-[17px] text-ink/85"
                        >
                          {s.label}
                          {s.tag && (
                            <span className="ml-2 text-[11px] uppercase tracking-[0.08em] text-ink/55">
                              {s.tag}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Language toggle in the mobile drawer */}
            <div className="mt-6 flex items-center gap-2 border-t border-ink/10 pt-4">
              <span className="text-[11px] uppercase tracking-[0.08em] text-ink/55">
                Language
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-ink/20 px-3 py-1.5 text-[12px] font-bold tracking-wide text-ink/80">
                {currentLang}
              </span>
              <a
                href={deUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-blue/30 bg-blue/10 px-3 py-1.5 text-[12px] font-bold tracking-wide text-blue hover:bg-blue/20"
              >
                DE →
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
