import Image from "next/image";
import Link from "next/link";
import { getTeam } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";

/**
 * "From the lab" — the researcher quote section. We pull the first
 * Scientific Advisory Board member (`role_type = "scientific"`) with a
 * non-empty bio, sorted by display_order. If none is set up yet, we
 * fall back to a placeholder (Maureen Hanson, since she's at the top
 * of the live site's SAB).
 */
export async function Researcher() {
  const team = await getTeam();
  const featured = team
    .filter((m) => m.role_type === "scientific" && m.content?.rendered)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]
    ?? null;

  const name     = featured?.title.rendered ?? "Prof. Maureen Hanson";
  const role     = featured?.role ?? "Professor of Molecular Biology and Genetics, Cornell University";
  const bio      = featured?.content?.rendered
    ? decodeHtml(stripTags(featured.content.rendered))
    : "ME/CFS research has been starved of funding for decades. WE&ME is helping to close that gap by putting serious resources behind the work, and that changes what is possible in this field.";

  // Portrait resolution order:
  //   1. Featured media from the WP REST `_embedded` payload
  //   2. `portrait` field on the demo data (local /public/people/...)
  //   3. Local Maureen Hanson portrait as last-resort fallback
  //      (was previously the Akiko Iwasaki mockup photo, which
  //      mismatched the name)
  const x_handle = featured?.x_handle ?? null;
  const featuredPortrait = (featured as (typeof featured) & { portrait?: string } | null)?.portrait
    ? withBasePath((featured as { portrait: string }).portrait)
    : null;
  const photo    = featured?._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    ?? featuredPortrait
    ?? withBasePath("/people/maureen-hanson.jpg");

  return (
    <section className="bg-[#f0f6ef]">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-12 md:px-12">
        <div className="md:flex md:items-center md:gap-12">
          <div className="md:order-2 md:flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue md:hidden">
              From the lab
            </p>
            <div className="mt-5 w-[260px] max-w-full overflow-hidden rounded-2xl md:hidden">
              <Image
                src={photo}
                alt={`Portrait of ${name}`}
                width={520}
                height={650}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </div>

            <figure>
              <p className="hidden md:block text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
                From the lab
              </p>
              <blockquote className="mt-8 md:mt-4">
                <p className="headline text-[24px] md:text-[32px] font-semibold normal-case leading-[1.3] tracking-[-0.01em] text-ink">
                  &ldquo;{bio}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-5">
                <span className="block text-[17px] font-normal leading-[1.4] text-ink">
                  {name}
                </span>
                <span className="block text-[15px] leading-[1.4] text-ink/55">
                  {decodeHtml(role)}
                </span>
              </figcaption>
              {x_handle ? (
                <Link
                  href={`https://x.com/${x_handle}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex items-center gap-2 text-ink"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                    <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.4-5.7L6 21H2.9l7.3-8.3L2.5 3h6.4l4 5.3L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
                  </svg>
                  <span className="text-[15px] leading-[1.4] text-ink/55">@{x_handle}</span>
                </Link>
              ) : null}
            </figure>
          </div>

          <div className="hidden md:block md:order-1 md:w-[380px] md:shrink-0">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={photo}
                alt={`Portrait of ${name}`}
                width={760}
                height={950}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
