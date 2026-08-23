import Link from "next/link";
import { getCalls } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { formatEuro } from "@/lib/utils";

/**
 * Campaign / Shop slot.
 *
 * One section, never empty. Three states:
 *   1. A `call` CPT with status=open and featured=true  → the call
 *   2. A `call` CPT with status=upcoming               → the upcoming call
 *   3. None of the above                               → the WE&ME shop coming-soon card
 *
 * The current campaign (€2M WE&ME Projects 2026, deadline 25 Aug 2026)
 * is featured in the seed content, so editors get the campaign view
 * right after running scripts/seed-content.php.
 */
export async function Campaign() {
  const calls = await getCalls();
  const featured = calls.find((c) => c.featured && c.status === "open")
                ?? calls.find((c) => c.status === "upcoming")
                ?? null;

  if (featured && featured.status === "open") {
    return (
      <section className="w-full">
        <div className="bg-urgency text-ink">
          <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">
              Open call
            </p>
            <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]">
              {decodeHtml(featured.title.rendered)}
            </h2>
            {featured.amount_total && (
              <p className="mt-4 headline text-[20px] font-semibold text-ink">
                {formatEuro(featured.amount_total)} total funding pool
              </p>
            )}
            {featured.content?.rendered && (
              <div
                className="mt-6 max-w-[60ch] text-[17px] leading-[1.45] text-ink/85"
                dangerouslySetInnerHTML={{ __html: featured.content.rendered }}
              />
            )}
            {featured.deadline && (
              <p className="mt-4 text-[14px] font-semibold text-ink">
                Stage 1 deadline {new Date(featured.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/research"
                className="inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-semibold text-white transition hover:opacity-90"
              >
                Read the call
              </Link>
              {featured.external_url && (
                <a
                  href={featured.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full border border-ink px-7 text-[18px] font-semibold text-ink transition hover:bg-ink hover:text-white"
                >
                  Submit a proposal →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback: shop coming soon.
  return (
    <section className="w-full">
      <div className="bg-urgency text-ink">
        <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">
            Shop
          </p>
          <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]">
            The WE&ME shop is coming.
          </h2>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.45] text-ink/85">
            Everything sold here will fund research the same way a donation
            does: 100% to research, overhead covered by the Ströck family.
          </p>
          <Link
            href="/news#newsletter"
            className="mt-6 inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-semibold text-white transition hover:opacity-90"
          >
            Get the newsletter
          </Link>
        </div>
      </div>
    </section>
  );
}
