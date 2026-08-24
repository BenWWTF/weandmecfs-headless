import Link from "next/link";
import type { Metadata } from "next";
import { getStories } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Life with ME/CFS — Stories | WE&ME Foundation",
  description:
    "Real portraits of people living with ME/CFS across Austria — their stories, in their own words.",
  openGraph: {
    type: "website",
    title: "Life with ME/CFS — Stories",
    description: "Portraits of people living with ME/CFS in Austria.",
  },
  alternates: { canonical: "/stories" },
};

// Local fallbacks until every story's photo is uploaded to the WP media
// library — mirrors the map in components/home/Stories.tsx.
const STORY_FALLBACKS: Record<string, string> = {
  "mila-hermisson":            withBasePath("/images/stories/mila.jpg"),
  "carmen-rinnhofer":          withBasePath("/images/stories/carmen.jpg"),
  "yvonne-anreitter":          withBasePath("/images/stories/yvonne.jpg"),
  "madeleine-martos":          withBasePath("/images/stories/madeleine.jpg"),
  "petra-schaschl-petersmann": withBasePath("/images/stories/petra.jpg"),
};

const FIGURE_COLORS = ["bg-empathy", "bg-mint"];

export default async function StoriesPage() {
  const allStories = await getStories();
  const featured = allStories.filter((s) => s.featured);
  const more = allStories.filter((s) => !s.featured);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <main>
        <section className="mx-auto max-w-[1400px] px-5 pt-10 pb-10 md:px-10 md:pt-16">
          <p className="sticker bg-empathy mb-6">Stories of people affected</p>
          <h1 className="headline text-[clamp(3rem,10vw,9rem)]">
            LIFE WITH
            <br />
            <span className="text-blue">ME/CFS.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl leading-snug text-ink/80">
            Real people. Real days. No stock photos, no staged material — the
            honest reality of a disease that reshapes everything.
          </p>
        </section>

        {featured.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24 space-y-16 md:space-y-28">
            {featured.map((s, i) => {
              const name = decodeHtml(s.title.rendered);
              const firstName = name.split(" ")[0];
              const statement = s.short_bio ?? decodeHtml(s.excerpt?.rendered ?? "");
              const img =
                s._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
                STORY_FALLBACKS[s.slug] ??
                withBasePath("/images/stories/mila.jpg");
              const href = s.long_story_url ?? `https://www.weandmecfs.org/${s.slug}/`;

              return (
                <article
                  key={s.id}
                  className={`grid gap-6 md:grid-cols-12 md:gap-10 ${i % 2 === 1 ? "md:[&>figure]:order-2" : ""}`}
                >
                  <figure className="md:col-span-6">
                    <div
                      className={`relative overflow-hidden rounded-[2rem] border border-ink ${FIGURE_COLORS[i % FIGURE_COLORS.length]}`}
                    >
                      <img
                        src={img}
                        alt={`Portrait of ${name}`}
                        width={1200}
                        height={1500}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover"
                      />
                      <span className="absolute left-5 top-5 sticker bg-paper text-[11px]">
                        &amp; {name}
                      </span>
                    </div>
                  </figure>
                  <div className="md:col-span-6 flex flex-col justify-center">
                    <p className="headline text-xs text-ink/50">
                      Story No. 0{i + 1}
                    </p>
                    <h2 className="headline mt-3 text-[clamp(2rem,5vw,4rem)]">
                      {name}
                    </h2>
                    {s.location && (
                      <p className="mt-2 text-sm uppercase tracking-widest text-ink/60">
                        {s.location}
                      </p>
                    )}
                    {statement && (
                      <blockquote className="mt-6 border-l-4 border-blue pl-5">
                        <p className="headline text-2xl md:text-3xl leading-tight">
                          {statement}
                        </p>
                      </blockquote>
                    )}
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 sticker w-fit bg-transparent hover:bg-mint"
                    >
                      Read {firstName}&rsquo;s story →
                    </a>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {more.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
            <h2 className="headline text-[clamp(1.75rem,4vw,3rem)] mb-6">
              More stories
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {more.map((s) => {
                const name = decodeHtml(s.title.rendered);
                const href = s.long_story_url ?? `https://www.weandmecfs.org/${s.slug}/`;
                return (
                  <a
                    key={s.id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-ink bg-paper p-5 hover:bg-mint transition-colors"
                  >
                    <p className="headline text-lg">{name}</p>
                    {s.location && (
                      <p className="mt-1 text-sm text-ink/70">{s.location}</p>
                    )}
                    <p className="mt-3 text-sm">Read the story →</p>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
          <div className="rounded-[2rem] border border-ink bg-blue p-8 text-white md:p-14 flex flex-wrap items-end justify-between gap-6">
            <h2 className="headline text-[clamp(2rem,5vw,3.5rem)] max-w-xl">
              Share your story.
            </h2>
            <div className="flex gap-3">
              <a
                href="https://www.weandmecfs.org/contact/"
                target="_blank"
                rel="noreferrer"
                className="sticker bg-white text-ink border-ink"
              >
                Get in touch
              </a>
              <Link
                href="/support"
                className="sticker bg-transparent border-white text-white hover:bg-white hover:text-ink"
              >
                Support us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
