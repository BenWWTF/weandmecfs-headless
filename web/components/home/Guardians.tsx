import Image from "next/image";
import { getGuardians } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { withBasePath } from "@/lib/basePath";

const GUARDIAN_URL = "https://donate.weandmecfs.org/de-at/?rnw-payment_type=recurring&rnw-recurring_interval=monthly";

/**
 * "Guardians4ME" rail. Pulls the `guardian` CPT from WordPress.
 * The seed script seeds three placeholder guardians; editors swap in
 * real quotes + portraits in wp-admin.
 */
export async function Guardians() {
  const guardians = (await getGuardians())
    .map((g) => {
      const demoPortrait = (g as typeof g & { portrait?: string }).portrait;
      return {
        name:     decodeHtml(g.title.rendered),
        quote:    g.quote ?? "",
        since:    g.since ?? new Date().getFullYear(),
        portrait: g._embedded?.["wp:featuredmedia"]?.[0]?.source_url
          ?? (demoPortrait ? withBasePath(demoPortrait) : null),
        href:     g.external_url ?? "#",
      };
    });

  if (guardians.length === 0) {
    return null;
  }

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-12 md:px-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
          Guardians4ME
        </p>
        <h2 className="headline mt-3 text-[34px] md:text-[52px] leading-[1] tracking-[-0.01em]">
          They&rsquo;re out
          <br />
          of energy.
          <br />
          You&rsquo;re not.
        </h2>
        <p className="mt-4 max-w-[34ch] text-[17px] leading-[1.45] text-ink/85">
          Guardians lend theirs. They show up, speak up and keep ME/CFS visible
          where patients can&rsquo;t.
        </p>
        <a
          href={GUARDIAN_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-bold text-white transition hover:opacity-90"
        >
          Become a Guardian
        </a>

        <div className="-mx-7 mt-8 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 pl-7 pr-7 [scroll-padding-left:28px] [scroll-padding-right:28px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:p-0 items-stretch">
          {guardians.map((g) => {
            const initials = g.name
              .split(/\s+/)
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <figure
                key={g.name}
                className="flex-none basis-[calc(100vw-56px)] snap-center [scroll-snap-stop:always] lg:basis-auto flex flex-col rounded-2xl bg-[#f0f6ef] p-6 lg:p-7"
              >
                <blockquote className="text-[15px] leading-[1.4] text-ink/85 font-medium">
                  &ldquo;{g.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-5">
                  {g.portrait ? (
                    <Image
                      src={g.portrait}
                      alt={`Portrait of ${g.name}`}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="h-12 w-12 shrink-0 rounded-full bg-blue/15 inline-flex items-center justify-center text-[12px] font-bold text-blue"
                    >
                      {initials}
                    </span>
                  )}
                  <span className="text-[13px] leading-[1.3]">
                    <span className="block text-ink font-bold">{g.name}</span>
                    <span className="block text-ink/55">Guardian since {g.since}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
          <div aria-hidden className="flex-none basis-4 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
