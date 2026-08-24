import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";
import { SpotFigure } from "@/components/blog/SpotFigure";

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: "Blog · WE&ME Foundation",
    description:
      "Research, patient voices and foundation updates from the WE&ME Foundation on ME/CFS.",
  };
}

const FEATURED_IMG = withBasePath("/images/blog-featured.jpg");
const LENA_AVATAR = withBasePath("/images/author-lena.jpg");

const CATEGORY_COLORS: Record<string, string> = {
  Research: "#2e73db",
  Voices: "#ccba96",
  Foundation: "#abd4ba",
  Events: "#ceef0a",
  Policy: "#1a1a18",
};

function CategoryDot({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? "#0e1a10";
  return (
    <span
      aria-hidden
      className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
      style={{ backgroundColor: color }}
    />
  );
}

const categories = ["All", "Research", "Voices", "Foundation", "Policy"];

const FEATURED = {
  category: "Research",
  title: "Inside the search for a biomarker",
  dek: "For the first time, teams in Vienna, Stanford, Berlin and Melbourne pooled their data. A year of quiet collaboration, and the first honest picture of where the science actually stands.",
  date: "Jul 2, 2026",
  readTime: "9 min read",
  author: "Lena Mayrhofer",
  authorRole: "Research Director, WE&ME Foundation",
  slug: "inside-the-search-for-a-biomarker",
};

const START_HERE = [
  {
    title: "Pacing, plainly: a beginner's guide that isn't condescending",
    readTime: "8 min",
    slug: FEATURED.slug,
  },
  {
    title: "How your €5 monthly donation moves through the lab",
    readTime: "6 min",
    slug: FEATURED.slug,
  },
  {
    title: "Inside the search for a biomarker",
    readTime: "9 min",
    slug: FEATURED.slug,
  },
];

const POSTS = [
  {
    category: "Voices",
    title: '"I miss who I was before." Three patients on the years in between',
    dek: "A long conversation about identity, grief, and the small rooms where life gets lived.",
    date: "Jun 18, 2026",
    readTime: "12 min read",
    author: "Lena Mayrhofer",
    img: withBasePath("/images/portrait-rest.jpg"),
    slug: "i-miss-who-i-was-before",
  },
  {
    category: "Foundation",
    title: "WE&ME Award 2026: the winning project, in plain language",
    dek: "Matthias Wielscher at the Medical University of Vienna is looking for the metabolic fingerprints of ME/CFS. Here is what that means in practice.",
    date: "Jun 10, 2026",
    readTime: "7 min read",
    author: "Lena Mayrhofer",
    img: withBasePath("/images/detail-hand.jpg"),
    slug: "weandme-award-2026",
  },
  {
    category: "Events",
    title: "Charity Gala for ME/CFS at Kittsee Castle",
    dek: "Save the date: 14 September 2026, Kittsee Castle, Burgenland. The first gala of its kind, and a moment for the community to be in one room.",
    date: "May 30, 2026",
    readTime: "3 min read",
    author: "Lena Mayrhofer",
    img: withBasePath("/images/portrait-look.jpg"),
    slug: "charity-gala-kittsee",
  },
  {
    category: "Research",
    title: "What the 2026 mitochondrial study actually says",
    dek: "Most of the press missed the headline. We read the paper so you don't have to.",
    date: "Jun 6, 2026",
    readTime: "8 min read",
    author: "Lena Mayrhofer",
    img: withBasePath("/images/portrait-rest.jpg"),
    slug: "mitochondrial-study-2026",
  },
  {
    category: "Policy",
    title: "Why NIH funding for ME/CFS keeps falling",
    dek: "The numbers, the politics, and what the Foundation is doing about it.",
    date: "May 22, 2026",
    readTime: "10 min read",
    author: "Lena Mayrhofer",
    img: withBasePath("/images/portrait-look.jpg"),
    slug: "nih-funding-mecfs",
  },
  {
    category: "Foundation",
    title: "ME/CFS Fellowships 2026: the seven funded projects",
    dek: "From glycan analysis to Mendelian randomisation: a tour of the seven research stays WE&ME and the WWTF are funding this year.",
    date: "Apr 14, 2026",
    readTime: "6 min read",
    author: "Lena Mayrhofer",
    img: withBasePath("/images/detail-hand.jpg"),
    slug: "fellowships-2026",
  },
];

const DONATE_URL = "https://weandmecfs.org/donate";

export default function BlogIndex() {
  return (
    <>
      {/* ————————— Blog hero ————————— */}
      <section id="notes" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 pt-14 pb-10 md:px-8 md:pt-20 md:pb-14">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink/55 mb-6">
            The WE&amp;ME Blog
          </p>
          <h1 className="headline text-[clamp(3.5rem,15vw,9rem)] text-ink">
            Notes on
            <br />
            ME/CFS.
          </h1>
          <p className="mt-8 max-w-xl text-[18px] leading-snug text-ink/70">
            Research, patient voices and foundation updates. Published
            fortnightly, edited carefully, by and for people who take this
            illness seriously.
          </p>
        </div>
      </section>

      {/* ————————— Featured ————————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 md:px-8">
          <SectionRule label="Featured" />
          <Link
            href={`/blog/${FEATURED.slug}`}
            className="featured-breathe group grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 items-center rounded-2xl p-6 sm:p-10 lg:p-14"
          >
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink/70 mb-5">
                <CategoryDot category={FEATURED.category} />
                {FEATURED.category}
              </div>
              <h2 className="headline text-[clamp(1.8rem,5vw,3.5rem)] text-ink">
                {FEATURED.title}
              </h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/80">
                {FEATURED.dek}
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2.5">
                  <img
                    src={LENA_AVATAR}
                    alt={FEATURED.author}
                    width={36}
                    height={36}
                    loading="lazy"
                    className="h-9 w-9 rounded-full object-cover grayscale"
                  />
                  <span className="text-ink">{FEATURED.author}</span>
                </span>
                <span className="text-ink/40">·</span>
                <span className="text-ink/70">
                  {FEATURED.date} · {FEATURED.readTime}
                </span>
                <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-sm font-medium text-ink group-hover:gap-2 transition-all">
                  Read <span aria-hidden>↗</span>
                </span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <figure className="aspect-square w-full overflow-hidden rounded-xl bg-paper">
                <Image
                  src={FEATURED_IMG}
                  alt={FEATURED.title}
                  width={1400}
                  height={1000}
                  priority
                  className="h-full w-full object-cover"
                />
              </figure>
              <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/60">
                Illustration · WE&amp;ME Studio
              </figcaption>
            </div>
          </Link>
        </div>
      </section>

      {/* ————————— Start here ————————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 md:px-8 mt-10">
          <div className="border-t border-ink/10 pt-6 pb-6 border-b">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink/55">
              Start here
            </p>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/65">
              New to ME/CFS or to this blog? These three pieces are a good
              place to begin.
            </p>
            <ul className="mt-6 divide-y divide-ink/10">
              {START_HERE.map((p) => (
                <li key={p.title}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex items-center justify-between gap-4 py-6"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-ink leading-snug group-hover:text-blue transition-colors">
                        {p.title}
                      </span>
                      <span aria-hidden className="text-blue text-lg shrink-0">
                        ↗
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-ink/50">
                      {p.readTime}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————————— Recent ————————— */}
      <section id="news" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 md:px-8 mt-20">
          <CategoryFilter active="All" />
          <SectionRule label="Recent" trailing="Archive →" />
          <ul className="divide-y divide-ink/10">
            {POSTS.map((p) => {
              const isVoices = p.category === "Voices";
              return (
                <li key={p.title}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className={
                      "group grid gap-4 py-8 md:grid-cols-[200px_1fr_auto] md:items-start md:gap-8 rounded-xl -mx-3 px-3 transition-colors " +
                      (isVoices ? "hover:bg-empathy/50" : "")
                    }
                  >
                    <div className="hidden md:block aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink/5">
                      <Image
                        src={p.img}
                        alt=""
                        width={400}
                        height={300}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink/55 mb-3">
                        <span className="font-medium text-ink">
                          <CategoryDot category={p.category} />
                          {p.category}
                        </span>
                        <span aria-hidden className="text-ink/25">·</span>
                        <span>{p.date}</span>
                      </div>
                      <h3 className="text-[20px] sm:text-[22px] md:text-[26px] font-bold tracking-tight text-ink leading-[1.18] group-hover:text-blue transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/65">
                        {p.dek}
                      </p>
                      <div className="mt-5 flex items-center gap-2.5 text-sm text-ink/70">
                        <span className="inline-flex items-center gap-2.5">
                          <img
                            src={LENA_AVATAR}
                            alt={p.author}
                            width={28}
                            height={28}
                            loading="lazy"
                            className="h-7 w-7 rounded-full object-cover grayscale"
                          />
                          <span className="text-ink">{p.author}</span>
                        </span>
                        <span className="text-ink/40">·</span>
                        <span className="text-ink/70">{p.readTime}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center pt-1 text-ink/50 group-hover:text-blue group-hover:translate-x-0.5 transition-all">
                      <span aria-hidden className="text-xl">↗</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-center py-14">
            <span className="inline-flex items-center rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink/55">
              Load more posts
            </span>
          </div>
        </div>
      </section>

      {/* ————————— Newsletter ————————— */}
      <section id="newsletter" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 md:px-8 mt-8">
          <div className="rounded-2xl border border-ink/10 bg-card p-8 sm:p-12 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
            <div>
              <SpotFigure
                variant="a"
                className="mb-6 h-24 w-auto"
                title="WE&ME spot illustration"
              />
              <h2 className="headline text-[clamp(1.8rem,4vw,3rem)] text-ink">
                The best of the blog,
                <br />
                in your inbox.
              </h2>
              <p className="mt-4 max-w-md text-ink/70">
                The strongest posts make it into our quarterly newsletter,
                alongside foundation news. Sign up here.
              </p>
            </div>
            <form
              className="flex flex-col gap-3"
              action="#newsletter"
            >
              <label
                className="text-[11px] uppercase tracking-[0.22em] text-ink/60"
                htmlFor="email"
              >
                Email
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-3xl sm:rounded-full border border-ink/20 bg-background p-1.5 sm:pl-5 focus-within:border-ink transition-colors">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent px-4 sm:px-0 py-2.5 text-base outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:bg-blue transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-ink/50">
                A few emails a year. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ————————— Foundation bridge ————————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 md:px-8 pb-16 md:pb-20 pt-10">
          <div className="max-w-2xl border-t border-ink/15 pt-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink/55 mb-5">
              The foundation behind this blog
            </p>
            <p className="text-[18px] sm:text-[20px] leading-relaxed text-ink/80 max-w-[34em]">
              The WE&amp;ME Foundation funds biomedical ME/CFS research. Our
              family covers all overhead, so 100% of every donation goes to
              research.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-urgency px-4 py-2 text-sm font-medium text-ink hover:brightness-95 transition"
              >
                Donate
              </a>
              <Link
                href="/foundation"
                className="text-sm font-medium text-blue underline underline-offset-4 decoration-blue/60 hover:decoration-blue"
              >
                About the foundation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryFilter({ active }: { active: string }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2" aria-label="Filter by category">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            type="button"
            className={
              "inline-flex items-center rounded-full px-4 py-1.5 text-sm transition-colors " +
              (isActive
                ? "bg-ink text-paper"
                : "border border-ink/15 text-ink/80 hover:border-ink hover:text-ink")
            }
          >
            {c !== "All" && <CategoryDot category={c} />}
            {c}
          </button>
        );
      })}
    </nav>
  );
}

function SectionRule({
  label,
  trailing,
}: {
  label: string;
  trailing?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between border-b border-ink/25 pb-3">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-ink/70">
        {label}
      </h2>
      {trailing && (
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/60">
          {trailing}
        </span>
      )}
    </div>
  );
}
