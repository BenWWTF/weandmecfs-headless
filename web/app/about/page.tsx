import Image from "next/image";
import Link from "next/link";
import { getPageBySlug, getTeam } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";
import type { TeamMember } from "@/lib/wp";

export const revalidate = 300;

export async function generateMetadata() {
  const page = await getPageBySlug("about");
  return {
    title: page ? decodeHtml(page.title.rendered) : "About Us",
    description:
      "The WE&ME Foundation was founded in 2020 by the Ströck family. Two of their three sons, Christoph and Philipp, live with ME/CFS. The family personally covers every operating cost so that 100% of donations fund research.",
  };
}

const ABOUT_HERO_IMAGE = withBasePath("/images/about-hero.jpg");

/* Story copy pulled from the live site (https://www.weandmecfs.org/about/#our-history).
 * Editors can override the body via the WordPress `about` page once it's set up —
 * for now we ship the live copy as the source of truth. */
const STORY_PARAGRAPHS = [
  "The WE&ME Foundation (formerly the TEMPI Foundation) was founded in 2020 by the Ströck family and is based in Vienna, Austria, where the family is known for its “Ströck” bakeries, which have been delighting customers with their baked goods for generations. The Ströck family’s journey has been profoundly shaped by the impact of ME/CFS, which has defined the nature and purpose of the WE&ME Foundation with unwavering determination.",
  "Two brothers, Christoph and Philipp Ströck, both of whom are affected by ME/CFS, lead the foundation’s mission. Christoph, the younger brother, was diagnosed in 2016 after years of illness, and his condition worsened due to misconceptions about ME/CFS. In 2018, Philipp, the older brother, was also diagnosed. The family learned firsthand that there are very few doctors who are knowledgeable about the diagnosis and treatment of ME/CFS. Over the years, the Ströck family became aware of the extent of the shortcomings in social security and support for the millions of ME/CFS patients.",
  "The ongoing shortage of qualified professionals in this field has left patients to fend for themselves when it comes to diagnosis and the necessary support — a situation that often leads to an irreversible deterioration in their health. In many cases, they are unable to return to work, which leads to a lack of social support. The situation in which patients and their families find themselves — on top of the reality of this cruel disease — is completely unacceptable.",
  "Originally self-funded, the foundation is now working to raise funds for research and raise awareness of the disease in order to improve the situation for patients and their families. The Ströck family and the dedicated WE&ME team are committed to funding groundbreaking research that unravels the complexity of ME/CFS and brings us closer to effective treatments and a cure. Join us on this journey to make a tangible difference in the lives of those affected by ME/CFS. Together, we can make progress and bring about positive change.",
];

/* Group labels in render order. Matches the live site. */
const GROUP_LABELS: Array<{ key: TeamMember["role_type"]; label: string }> = [
  { key: "board",      label: "Board of Directors" },
  { key: "team",       label: "Foundation Team" },
  { key: "scientific", label: "Scientific Advisory Board" },
  { key: "medical",    label: "Medical Advisory Board" },
  { key: "patient",    label: "Patient Advisory Board" },
  { key: "advisory",   label: "Advisory Board" },
];

/* Real partner logos from the live site. Editors can swap in
 * additional partners through the `partner` CPT in wp-admin. */
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

export default async function AboutPage() {
  const [page, team] = await Promise.all([
    getPageBySlug("about"),
    getTeam(),
  ]);

  // Group the team by role_type. Fall back to display_order so the
  // grid reflects the order the live site uses.
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
      <section id="our-history" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 py-14 md:px-12 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Our story
          </p>
          <h1 className="headline mt-4 text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            Welcome to the<br />WE&amp;ME Foundation.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.5] text-ink/85">
            The WE&amp;ME Foundation was founded in 2020 by the Ströck family.
            Two of their three sons, Christoph and Philipp, live with ME/CFS.
            The family personally covers every operating cost so that{" "}
            <span className="bg-urgency px-1 font-semibold">100% of donations fund research</span>.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl">
            <Image
              src={ABOUT_HERO_IMAGE}
              alt="WE&ME Foundation – the Ströck family and the foundation team"
              width={1352}
              height={700}
              priority
              className="aspect-[1400/700] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-empathy">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12 md:grid md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
              Our history
            </p>
            <h2 className="headline mt-3 text-[34px] md:text-[42px] font-semibold leading-[1.05] tracking-[-0.01em]">
              How a family became a foundation.
            </h2>
          </div>
          <div className="md:col-span-8 mt-5 md:mt-0 space-y-5 text-[17px] leading-[1.6] text-ink/85">
            {STORY_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="our-mission" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Our mission
          </p>
          <h2 className="headline mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.01em] max-w-[36ch]">
            We are committed to ensuring that people with ME/CFS are recognized, taken seriously, and well cared for.
          </h2>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
            That is why we support education and research with the goal of
            making effective treatments and a cure possible.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="bg-[#f0f6ef]">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Vision
          </p>
          <h2 className="headline mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.01em] max-w-[36ch]">
            We envision a future in which every person with ME/CFS is diagnosed early and has access to effective treatments and a cure.
          </h2>
        </div>
      </section>

      {/* Board & advisory boards */}
      <section id="about-board" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Organization
          </p>
          <h2 className="headline mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.01em]">
            United by a single goal.
          </h2>

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
      <section id="our-partners" className="bg-[#f0f6ef]">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Our partners
          </p>
          <h2 className="headline mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.01em] max-w-[24ch]">
            No one changes the world alone.
          </h2>
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

      {/* Annual reports / transparency — for now just a placeholder
       * pointing editors at the WordPress side. */}
      <section id="annual-reports" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Annual reports
          </p>
          <h2 className="headline mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
            Our work in review.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="https://www.weandmecfs.org/wp-content/uploads/2026/02/Jahresbericht_2024_WEME.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-ink/10 px-6 py-5 transition hover:border-blue hover:bg-blue/5"
            >
              <div>
                <p className="text-[14px] font-semibold text-ink/55 uppercase tracking-[0.08em]">2024</p>
                <p className="mt-1 text-[18px] font-semibold text-ink">Annual Report 2024</p>
              </div>
              <span className="text-[15px] font-semibold text-blue">Open PDF →</span>
            </a>
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-ink/15 px-6 py-5">
              <div>
                <p className="text-[14px] font-semibold text-ink/55 uppercase tracking-[0.08em]">2025</p>
                <p className="mt-1 text-[18px] font-semibold text-ink/55">Annual Report 2025 — in review</p>
              </div>
              <span className="text-[14px] text-ink/55">Coming soon</span>
            </div>
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
