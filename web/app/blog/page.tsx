import { getLatestPosts } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: "News & Events — WE&ME Foundation",
    description:
      "Latest research updates, news from the foundation, and upcoming events from WE&ME.",
  };
}

const FALLBACK_IMAGES = [
  withBasePath("/images/post-header.jpg"),
  withBasePath("/images/detail-hand.jpg"),
  withBasePath("/images/portrait-rest.jpg"),
  withBasePath("/images/portrait-look.jpg"),
];

export default async function BlogIndex() {
  const items = (await getLatestPosts(8)).map((p, i) => ({
    slug: p.slug,
    title: decodeHtml(p.title.rendered),
    dek: decodeHtml(stripTags(p.excerpt?.rendered ?? "")),
    date: p.date,
    img: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
  }));

  return (
    <section id="notes" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
          Notes on ME/CFS
        </p>
        <h1 className="headline mt-3 text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
          Writing, news &amp; events.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.5] text-ink/85">
          Research updates, foundation news, and upcoming events. Editors
          maintain this in WordPress under <code>News &amp; Events</code>.
        </p>

        {items.length === 0 ? (
          <p className="mt-10 text-[15px] text-ink/55">
            No posts published yet. Once editors publish in WordPress, they
            appear here automatically.
          </p>
        ) : (
          <ol id="news" className="mt-10 divide-y divide-ink/15 border-t border-b border-ink/15">
            {items.map((p, i) => (
              <li key={p.slug} className={i === 0 ? "featured-breathe" : ""}>
                <Link
                  href={`/news/${p.slug}`}
                  className="group grid grid-cols-[auto_88px_minmax(0,1fr)] md:grid-cols-[auto_160px_minmax(0,1fr)_auto] items-center gap-4 md:gap-8 py-5 md:py-7 px-3"
                >
                  <span className="headline text-2xl md:text-4xl text-blue tabular-nums w-8 md:w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="overflow-hidden rounded-[16px] shrink-0">
                    <img
                      src={p.img}
                      alt=""
                      loading="lazy"
                      width={320}
                      height={220}
                      decoding="async"
                      className="h-[72px] w-[88px] md:h-[110px] md:w-[160px] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="headline mt-1.5 text-[22px] font-semibold leading-[1.1]">
                      {p.title}
                    </h2>
                    {p.dek && (
                      <p className="mt-2 hidden md:block max-w-2xl text-[17px] leading-[1.45] text-ink/85">
                        {p.dek}
                      </p>
                    )}
                  </div>
                  <span className="hidden md:inline text-[17px] font-semibold text-blue">
                    Read →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
