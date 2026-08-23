import Link from "next/link";
import { SliderImage } from "@/components/ui/SliderImage";
import { getStories } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";

/**
 * Patient stories rail. Pulls the `story` CPT from WordPress and
 * renders the first three as full cards and the rest as a horizontal
 * scroll on mobile (matches the mockup's behaviour).
 *
 * Until the WE&ME team has uploaded the Brent Stirton photos to the
 * media library, the photos fall back to the live weandmecfs.org
 * domain so the rail looks correct in local dev.
 */
// Local fallbacks — the real mockup story photos, downloaded from
// the Lovable CDN during the rebuild. The story rail on the mockup
// only shows the first 3 stories; we have fallbacks for all 5 we
// seeded so the rail is full even before editors upload their own.
const STORY_FALLBACKS: Record<string, string> = {
  "mila-hermisson":            withBasePath("/images/stories/mila.jpg"),
  "carmen-rinnhofer":          withBasePath("/images/stories/carmen.jpg"),
  "yvonne-anreitter":          withBasePath("/images/stories/yvonne.jpg"),
  "madeleine-martos":          withBasePath("/images/stories/madeleine.jpg"),
  "petra-schaschl-petersmann": withBasePath("/images/stories/petra.jpg"),
};

export async function Stories() {
  const stories = (await getStories())
    .map((s) => ({
      name:       decodeHtml(s.title.rendered),
      loc:        s.location ?? "",
      line:       s.short_bio ?? decodeHtml(s.excerpt?.rendered ?? ""),
      img:        s._embedded?.["wp:featuredmedia"]?.[0]?.source_url
                  ?? STORY_FALLBACKS[s.slug]
                  ?? withBasePath("/images/stories/mila.jpg"),
      href:       s.long_story_url ?? `https://www.weandmecfs.org/${s.slug}/`,
    }));

  if (stories.length === 0) {
    return null; // graceful: nothing to show, hide the section
  }

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
          Life with ME/CFS
        </p>
        <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]">
          Real people. Real stakes.
        </h2>
        <p className="mt-5 text-[17px] leading-[1.45] text-ink/85 max-w-[34ch]">
          Ten days, ten families: award-winning press photographer Brent
          Stirton travelled through four Austrian provinces to document life
          with ME/CFS.
        </p>

        <div className="-mx-7 mt-8 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 pl-7 pr-7 [scroll-padding-left:28px] [scroll-padding-right:28px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:p-0">
          {stories.map((s, i) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={`group block flex-none basis-[calc(100vw-56px)] snap-center [scroll-snap-stop:always] lg:basis-auto ${i > 2 ? "md:hidden" : ""}`}
            >
              <SliderImage
                src={s.img}
                alt={`${s.name} — photographed by Brent Stirton for the WE&ME Foundation`}
                aspect="aspect-[4/3]"
                eager={i < 3}
                imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <p className="headline mt-4 text-[22px] font-semibold leading-[1.1]">
                {s.name}
              </p>
              <p className="mt-1 text-[14px] text-ink/55">{s.loc}</p>
              <p className="mt-2 text-[17px] leading-[1.45] text-ink/85">
                {s.line}
              </p>
              <p className="mt-3 text-[17px] font-semibold text-blue">
                Read the story →
              </p>
            </a>
          ))}
          <div aria-hidden className="flex-none basis-4 lg:hidden" />
        </div>

        <Link
          href="/stories"
          className="mt-6 inline-flex items-center gap-1.5 text-[17px] font-semibold text-blue"
        >
          Living with ME/CFS →
        </Link>

        <p className="mt-4 text-[14px] text-ink/55">
          Photos: Brent Stirton · Texts: Rudolf Anschober &amp; Emilia Garbsch
        </p>
      </div>
    </section>
  );
}
