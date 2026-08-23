import Link from "next/link";
import { Logo } from "./Logo";

type Item = { label: string; href: string };

const foundation: Item[] = [
  { label: "About Us",         href: "/foundation" },
  { label: "Team & boards",    href: "/foundation#team" },
  { label: "What is ME/CFS?",  href: "/about" },
  { label: "Funded research",  href: "/research" },
  { label: "Annual reports",   href: "/foundation#transparency" },
];

const involved: Item[] = [
  { label: "Donate",          href: "/support#donations" },
  { label: "Become a Guardian", href: "/support#guardian" },
  { label: "Stories",         href: "/stories" },
  { label: "Newsletter",      href: "/blog#newsletter" },
  { label: "Contact",         href: "mailto:contact@weandmecfs.org" },
];

const socials: { label: string; href: string; path: string }[] = [
  {
    label: "X",
    href: "https://x.com/weandmecfs",
    path: "M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.4-5.7L6 21H2.9l7.3-8.3L2.5 3h6.4l4 5.3L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/weandmecfs",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.4 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21h-4V9Z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/weandmecfs",
    path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2a3.9 3.9 0 0 1-.9 1.4c-.4.42-.8.68-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm6.4-3.9a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@weandmecfs",
    path: "M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C19.3 5 12 5 12 5s-7.3 0-8.9.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8c1.6.5 8.9.5 8.9.5s7.3 0 8.9-.5a2.5 2.5 0 0 0 1.7-1.8c.4-1.5.4-4.7.4-4.7ZM9.8 15.3V8.7l6 3.3-6 3.3Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/15 bg-empathy">
      <div className="mx-auto max-w-[1200px] px-7 py-12 md:px-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Logo variant="written" className="text-[26px]" />
            <p className="mt-5 text-sm leading-relaxed text-ink/80">
              Foundation for ME/CFS Research
              <br />
              Eiswerkstraße 18, 1220 Vienna
              <br />
              <a
                href="mailto:contact@weandmecfs.org"
                className="underline underline-offset-4 hover:text-blue"
              >
                contact@weandmecfs.org
              </a>
            </p>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-ink/60">
              Donations are tax-deductible in Austria · BMF registration no.
              [registration number]
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="headline text-xs text-ink/50 mb-4">Foundation</p>
            <ul className="space-y-2">
              {foundation.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} className="text-sm text-ink/70 hover:text-blue transition-colors">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="headline text-xs text-ink/50 mb-4">Get involved</p>
            <ul className="space-y-2">
              {involved.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} className="text-sm text-ink/70 hover:text-blue transition-colors">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-ink/55">
            <a href="#" className="hover:text-blue">Legal Notice</a> ·{" "}
            <a href="#" className="hover:text-blue">Privacy Policy</a> · © 2026 WE&amp;ME Foundation
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-ink/60 hover:text-blue transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
