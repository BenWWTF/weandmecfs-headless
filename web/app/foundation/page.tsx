import { getPageBySlug, getTeam } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";
import Image from "next/image";
import type { TeamMember } from "@/lib/wp";

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: "About WE&ME — WE&ME Foundation",
    description:
      "WE&ME is an independent Austrian foundation advancing biomedical ME/CFS research. Patient-driven. Guided by science. Focused on impact.",
  };
}

const ILLU = withBasePath("/images/illustrations/illustrations-1.svg");
const ABOUT_HERO = withBasePath("/images/about-hero.jpg");

const EYEBROW =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-blue";
const HEADLINE =
  "headline text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]";
const BODY = "text-[17px] leading-[1.5] text-ink/85 max-w-[65ch]";
const WRAP = "mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12";

/* Render order, matching the live site /foundation page */
const GROUP_LABELS: Array<{ key: TeamMember["role_type"]; label: string }> = [
  { key: "board",      label: "Board of Directors" },
  { key: "team",       label: "Foundation Team" },
  { key: "scientific", label: "Scientific Advisory Board" },
  { key: "medical",    label: "Medical Advisory Board" },
  { key: "patient",    label: "Patient Advisory Board" },
  { key: "advisory",   label: "Advisory Board" },
];

const PARTNERS: Array<{ name: string; logo: string; href: string }> = [
  { name: "PolyBio Research Foundation",     logo: "/brand/partners/polybio.png",                  href: "https://polybio.org/" },
  { name: "Open Medicine Foundation",         logo: "/brand/partners/open-medicine-foundation.png", href: "https://www.omf.ngo/" },
  { name: "OGME Österr. Gesellschaft f. ME/CFS", logo: "/brand/partners/ogmeofs.png",             href: "https://www.mecfs.at/" },
  { name: "Universität Würzburg",             logo: "/brand/partners/universitaet-wuerzburg.png",   href: "https://www.uni-wuerzburg.de/" },
  { name: "Dr. Michael Stingl (Praxis)",      logo: "/brand/partners/dr-michael-stingl.png",        href: "https://www.neurologe-stingl.at/" },
  { name: "NeuroLett",                        logo: "/brand/partners/neurolett.png",                 href: "https://www.neurolett.at/" },
  { name: "FWF — Austrian Science Fund",      logo: "/brand/partners/fwf.png",                      href: "https://www.fwf.ac.at/" },
  { name: "WWTF — Vienna Science & Tech Fund", logo: "/brand/partners/wwtf.jpg",                     href: "https://www.wwtf.at/" },
  { name: "Music ME",                         logo: "/brand/partners/music-me.png",                  href: "https://www.musicme.at/" },
  { name: "Nordlicht",                        logo: "/brand/partners/nordlicht.jpg",                 href: "https://www.nordlicht.co.at/" },
  { name: "Logo RZ",                          logo: "/brand/partners/logo-rz.png",                   href: "#" },
];

export default async function FoundationPage() {
  // Pull the team once for the board section. The /foundation page
  // is the public-facing home for the foundation's organisation —
  // mission, story, team, partners, transparency.
  const [team] = await Promise.all([getTeam()]);
  const byGroup: Record<string, TeamMember[]> = {};
  for (const m of team) {
    const k = m.role_type ?? "team";
    byGroup[k] = byGroup[k] ?? [];
    byGroup[k].push(m);
  }
  for (const k of Object.keys(byGroup)) {
    byGroup[k].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }

  return (
    <>
      {/* Hero */}
      <section id="mission" className="bg-white">
        <div className={WRAP}>
          <p className={EYEBROW}>About WE&amp;ME</p>
          <h1 className={`${HEADLINE} mt-3`}>
            Patient-driven.
            <br />
            Guided by science.
            <br />
            Focused on impact.
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-empathy text-ink">
        <div className={WRAP}>
          <p className={EYEBROW}>Our mission</p>
          <h2 className={`${HEADLINE} mt-3`}>Ending decades of neglect.</h2>
          <p className={`${BODY} mt-5`}>
            WE&amp;ME is an independent Austrian foundation advancing
            high-quality biomedical research, education and awareness,
            international collaboration, and lasting systemic change. The
            Ströck family finances the foundation&rsquo;s organizational
            structure and covers all overhead costs. This means that every
            euro donated goes directly into research.
          </p>
          <p className={`${BODY} mt-5`}>
            Our mission is to end the decades of neglect surrounding ME/CFS
            and accelerate both medical and social progress. This means
            better diagnosis, effective treatments, and ultimately a cure, as
            well as recognition and access to welfare benefits. The Ströck
            family&rsquo;s own experience with ME/CFS lends this mission a
            particular sense of urgency.
          </p>
          <p className={`${BODY} mt-5`}>
            Patients are active partners in this work. They help shape our
            strategy and decisions across the foundation, particularly the
            design of our research funding programme and its calls. Patient
            representatives serve as full voting members of the funding jury,
            assess proposals, and contribute directly to funding
            recommendations. We also require the projects we fund to involve
            patients meaningfully throughout the research process, not simply
            as study participants.
          </p>
          <Image
            src={ILLU}
            alt=""
            aria-hidden
            width={220}
            height={200}
            className="mt-10 hidden md:block w-[180px] h-auto"
          />
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-white">
        <div className={WRAP}>
          <p className={EYEBROW}>Our story</p>
          <h2 className={`${HEADLINE} mt-3`}>Founded in Vienna, 2020.</h2>
          <p className={`${BODY} mt-5`}>
            The WE&amp;ME Foundation, formerly the TEMPI Foundation, was
            founded in Vienna in 2020 by the Ströck family, known in Austria
            for its Ströck bakeries. It was established because several
            members of the family are affected by ME/CFS.
          </p>
          <p className={`${BODY} mt-5`}>
            Two brothers, Christoph and Philipp Ströck, are affected by the
            disease. Christoph was diagnosed in 2016, several years after the
            onset of his illness. Widespread misconceptions about ME/CFS
            contributed to a severe deterioration in his health during this
            period. Philipp was diagnosed in 2018.
          </p>
          <p className={`${BODY} mt-5`}>
            The family saw firsthand the serious gaps in medical knowledge,
            appropriate care, and reliable support. Patients are often left
            largely on their own when seeking diagnosis and treatment,
            managing the effects of the disease on their working lives, and
            securing the social support they need. These circumstances had a
            profound impact on the family and continue to shape WE&amp;ME&rsquo;s
            work today.
          </p>
        </div>
      </section>

      {/* Team & Advisory Boards */}
      <section id="team" className="bg-white">
        <div className={`${WRAP} py-10`}>
          <p className={EYEBROW}>Our team &amp; advisory boards</p>
          <h2 className={`${HEADLINE} mt-3`}>The people behind WE&amp;ME.</h2>

          <div className="mt-12 space-y-16">
            {GROUP_LABELS.map(({ key, label }) => {
              const group = byGroup[key ?? "team"] ?? [];
              if (group.length === 0) return null;
              return (
                <div key={key}>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-blue mb-6">
                    {label}
                  </h3>
                  <PersonGrid people={group} cols={label.includes("Foundation Team") ? 3 : label.includes("Medical") ? 4 : 3} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="bg-[#f0f6ef]">
        <div className={WRAP}>
          <p className={EYEBROW}>Partners</p>
          <h2 className={`${HEADLINE} mt-3`}>Who we work with.</h2>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.5] text-ink/80">
            We co-fund, co-design and co-steward research with a network
            of funders, clinicians and patient organisations across Europe
            and the US.
          </p>
          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PARTNERS.map((p) => (
              <li key={p.name} className="bg-white rounded-2xl p-5 flex items-center justify-center min-h-[100px]">
                {p.href !== "#" ? (
                  <a href={p.href} target="_blank" rel="noreferrer" className="block">
                    <Image
                      src={withBasePath(p.logo)}
                      alt={p.name}
                      width={200}
                      height={80}
                      unoptimized
                      className="h-12 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <Image
                    src={withBasePath(p.logo)}
                    alt={p.name}
                    width={200}
                    height={80}
                    unoptimized
                    className="h-12 w-auto object-contain"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Transparency */}
      <section id="transparency" className="bg-mint text-ink">
        <div className={WRAP}>
          <p className={EYEBROW}>Transparency</p>
          <h2 className={`${HEADLINE} mt-3`}>Reports.</h2>
          <p className={`${BODY} mt-5`}>
            Our annual activity and financial reports provide a clear account
            of the foundation&rsquo;s work and the use of donations.
          </p>
          <div className="mt-6 flex flex-wrap gap-8">
            <a
              href="https://www.weandmecfs.org/wp-content/uploads/2026/02/Jahresbericht_2024_WEME.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-[16px] font-semibold text-blue no-underline hover:opacity-80"
            >
              Activity Report →
            </a>
            <a
              href="https://www.weandmecfs.org/wp-content/uploads/2026/02/Jahresbericht_2024_WEME.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-[16px] font-semibold text-blue no-underline hover:opacity-80"
            >
              Financial Report →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function PersonGrid({ people, cols = 3 }: { people: TeamMember[]; cols?: 3 | 4 }) {
  return (
    <ul className={`grid grid-cols-2 sm:grid-cols-3 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-x-6 gap-y-10`}>
      {people.map((p) => {
        const photo =
          (p as TeamMember & { portrait?: string }).portrait
            ? withBasePath((p as TeamMember & { portrait?: string }).portrait!)
            : p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
        return (
          <li key={p.id} className="flex flex-col">
            {photo ? (
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-ink/5">
                <Image
                  src={photo}
                  alt={`Portrait of ${decodeHtml(p.title.rendered)}`}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square w-full rounded-2xl bg-ink/5" />
            )}
            <p className="mt-4 text-[17px] font-semibold leading-tight text-ink">
              {decodeHtml(p.title.rendered)}
            </p>
            {p.role && (
              <p className="mt-1 text-[14px] text-ink/70 leading-snug">
                {p.role}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
