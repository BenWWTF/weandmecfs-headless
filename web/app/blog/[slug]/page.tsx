import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getLatestPosts } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { estimateReadingTime } from "@/lib/utils";
import { withBasePath } from "@/lib/basePath";
import { ArticleChart } from "@/components/blog/ArticleChart";
import { PostBodyWithVersions } from "@/components/blog/PostBodyWithVersions";
import { ArticleEnd } from "@/components/blog/ArticleEnd";

export const revalidate = 300;

// The one post the mockup wrote a full illustrated treatment for — audio
// narration, a short/full toggle, a chart and a fact bar. Every other post
// renders its WP body plainly. See DEMO_POSTS in lib/demo-data.ts.
const FEATURED_SLUG = "inside-the-search-for-a-biomarker";
const DEMO_AUDIO_URL = "https://cdn.jsdelivr.net/gh/anars/blank-audio/5-minutes-of-silence.mp3";

const SHORT_VERSION = `The first meeting was unremarkable: four principal investigators, three time zones, one video call. What made it different was quiet. For the first time, they were sharing their raw data.

ME/CFS research has been fragmented for forty years. Small labs, small cohorts, small budgets, and a biomarker that never quite replicated. The WE&ME initiative began in early 2025 with a shared protocol, standardised freezers, and one statistician on retainer for all four teams. The Foundation removed the reasons the science could not be shared.

A year later, across 1,847 patients and 892 matched controls, a previously suggestive metabolic signature now looks robust. It is not a diagnostic test. It is a shared starting line. A follow-up study of 4,000 patients over three years, already funded, could not have been designed a year ago.

Not a cure. For this field, a shared starting line is not a small thing.`;

const LENA_AVATAR = withBasePath("/images/author-lena.jpg");
const HERO_IMAGES = [
  withBasePath("/images/post-header.jpg"),
  withBasePath("/images/detail-hand.jpg"),
  withBasePath("/images/portrait-rest.jpg"),
  withBasePath("/images/portrait-look.jpg"),
  withBasePath("/images/blog-featured.jpg"),
];

export async function generateStaticParams() {
  const posts = await getLatestPosts(100);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = decodeHtml(post.title.rendered);
  const description = decodeHtml(stripTags(post.excerpt.rendered));
  return {
    title,
    description,
    openGraph: { type: "article", title, description },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getLatestPosts(100),
  ]);
  if (!post) notFound();

  const isFeatured = post.slug === FEATURED_SLUG;
  const title = decodeHtml(post.title.rendered);
  const dek = decodeHtml(stripTags(post.excerpt.rendered));
  const readTime = estimateReadingTime(post.content.rendered);
  const publishedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const heroImg =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    HERO_IMAGES[post.id % HERO_IMAGES.length];

  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-14 sm:pt-20 pb-8 text-center">
        <Link
          href="/blog"
          className="inline-block text-xs text-ink/55 hover:text-blue transition-colors mb-4"
        >
          ← Notes on ME/CFS
        </Link>

        <h1 className="headline text-4xl sm:text-6xl lg:text-7xl font-bold text-ink">
          {title}
        </h1>

        {dek && (
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-snug text-ink/70">
            {dek}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm">
          <img
            src={LENA_AVATAR}
            alt="Lena Mayrhofer"
            width={36}
            height={36}
            loading="lazy"
            className="h-9 w-9 rounded-full object-cover grayscale mr-2.5"
          />
          <span className="whitespace-nowrap text-ink">Lena Mayrhofer</span>
          <span className="whitespace-nowrap text-ink/40">·&nbsp;{readTime}</span>
        </div>
      </section>

      <figure className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-2xl bg-mint">
          <Image
            src={heroImg}
            alt={title}
            width={1800}
            height={1100}
            className="h-auto w-full object-cover"
          />
        </div>
        <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/60">
          Illustration · WE&amp;ME Studio, 2026
        </figcaption>
      </figure>

      <PostBodyWithVersions
        fullHtml={post.content.rendered}
        shortText={isFeatured ? SHORT_VERSION : undefined}
        audioUrl={isFeatured ? DEMO_AUDIO_URL : undefined}
        audioDuration={isFeatured ? "9:12" : undefined}
      >
        {isFeatured && <BiomarkerSupplement />}
      </PostBodyWithVersions>

      <ArticleEnd />

      <div className="mx-auto max-w-2xl px-5 sm:px-8 pb-16">
        <div className="border-t border-ink/15 pt-8 flex items-start gap-4">
          <img
            src={LENA_AVATAR}
            alt="Lena Mayrhofer"
            width={96}
            height={96}
            loading="lazy"
            className="h-12 w-12 rounded-full object-cover grayscale"
          />
          <div className="text-sm">
            <div className="text-ink font-bold">Lena Mayrhofer</div>
            <div className="text-ink/60">Research Director, WE&ME Foundation</div>
            <div className="text-ink/50">Published {publishedDate}</div>
            <p className="mt-3 max-w-md text-ink/75 leading-relaxed">
              Lena leads the Foundation&rsquo;s research programme. She writes
              here occasionally when the science needs plain language.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-ink/15 bg-paper">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
            <div className="mb-8 flex items-end justify-between border-b border-ink/25 pb-3">
              <h2 className="text-[11px] uppercase tracking-[0.22em] text-ink/70">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="text-[11px] uppercase tracking-[0.22em] text-ink/60 hover:text-blue"
              >
                All posts →
              </Link>
            </div>
            <ul className="grid gap-8 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
              {related.map((p, i) => (
                <li key={p.slug} className={i > 0 ? "md:pl-8 pt-8 md:pt-0" : "md:pr-8"}>
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-ink/55 mb-3">
                      {new Date(p.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-ink leading-[1.2] group-hover:text-blue transition-colors">
                      {decodeHtml(p.title.rendered)}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-ink/60 group-hover:text-blue group-hover:gap-2 transition-all">
                      Read <span aria-hidden>↗</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}

function BiomarkerSupplement() {
  return (
    <div className="mx-auto max-w-[720px] px-5 sm:px-8">
      <ArticleChart
        caption="Samples contributed per lab · pooled cohort, 2025 to 2026"
        data={[
          { label: "Vienna", value: 612 },
          { label: "Stanford", value: 498 },
          { label: "Berlin", value: 437 },
          { label: "Melbourne", value: 300 },
        ]}
      />
      <div className="my-12 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-ink/15 bg-ink/15">
        <Fact label="Patients pooled" value="1,847" />
        <Fact label="Matched controls" value="892" />
        <Fact label="Labs collaborating" value="4" />
        <Fact label="Follow-up cohort" value="4,000" />
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-mint p-5">
      <div className="headline text-3xl text-ink">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink/70">
        {label}
      </div>
    </div>
  );
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
