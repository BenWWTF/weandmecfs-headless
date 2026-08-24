import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";

const FALLBACK_IMAGES = [
  withBasePath("/images/post-header.jpg"),
  withBasePath("/images/detail-hand.jpg"),
  withBasePath("/images/portrait-rest.jpg"),
  withBasePath("/images/portrait-look.jpg"),
];

/**
 * Latest posts. Pulls from the standard `post` CPT in WordPress.
 * The first item is treated as a featured post and gets a wider
 * treatment; the rest are list items.
 */
export async function Latest() {
  const items = (await getLatestPosts(4)).map((p, i) => ({
    slug:   p.slug,
    title:  decodeHtml(p.title.rendered),
    dek:    decodeHtml(stripTags(p.excerpt.rendered)),
    date:   p.date,
    img:    p._embedded?.["wp:featuredmedia"]?.[0]?.source_url
            ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
  }));

  if (items.length === 0) {
    return null;
  }

  const [featured, ...rest] = items;

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
          Latest
        </p>
        <h2 className="headline mt-3 text-[34px] md:text-[52px] leading-[1] tracking-[-0.01em]">
          Writing, news &amp; events
        </h2>

        <ol className="mt-8 divide-y divide-ink/15 border-t border-b border-ink/15">
          {/* Featured */}
          <li className="featured-breathe">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-[auto_88px_minmax(0,1fr)] md:grid-cols-[auto_160px_minmax(0,1fr)_auto] items-center gap-4 md:gap-8 py-5 md:py-7 px-3"
            >
              <span className="headline text-2xl md:text-4xl text-blue tabular-nums w-8 md:w-12">
                01
              </span>
              <div className="overflow-hidden rounded-[16px] shrink-0">
                <Image
                  src={featured.img}
                  alt={featured.title}
                  width={320}
                  height={220}
                  loading="lazy"
                  className="h-[72px] w-[88px] md:h-[110px] md:w-[160px] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
                  Featured
                </p>
                <h3 className="headline mt-1.5 text-[22px] leading-[1.1]">
                  {featured.title}
                </h3>
                <p className="mt-2 hidden md:block max-w-2xl text-[17px] leading-[1.45] text-ink/85">
                  {featured.dek}
                </p>
              </div>
              <span className="hidden md:inline text-[17px] font-semibold text-blue">
                Read →
              </span>
            </Link>
          </li>

          {/* Rest */}
          {rest.map((n, i) => (
            <li key={n.slug}>
              <Link
                href={`/blog/${n.slug}`}
                className="group grid grid-cols-[auto_88px_minmax(0,1fr)] md:grid-cols-[auto_160px_minmax(0,1fr)_auto] items-center gap-4 md:gap-8 py-5 md:py-7"
              >
                <span className="headline text-2xl md:text-4xl text-blue tabular-nums w-8 md:w-12">
                  0{i + 2}
                </span>
                <div className="overflow-hidden rounded-[16px] shrink-0">
                  <Image
                    src={n.img}
                    alt={n.title}
                    width={320}
                    height={220}
                    loading="lazy"
                    className="h-[72px] w-[88px] md:h-[110px] md:w-[160px] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
                    News
                  </p>
                  <h3 className="headline mt-1.5 text-[22px] leading-[1.1]">
                    {n.title}
                  </h3>
                </div>
                <span className="hidden md:inline text-[17px] font-semibold text-blue">
                  Read →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
