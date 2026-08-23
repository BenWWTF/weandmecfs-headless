import { getPageBySlug, getTeam } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import Image from "next/image";

export const revalidate = 300;

export async function generateMetadata() {
  const page = await getPageBySlug("about");
  return {
    title: page ? decodeHtml(page.title.rendered) : "About",
    description:
      "The WE&ME Foundation was founded in 2020 by the Ströck family. Two of their three sons, Christoph and Philipp, live with ME/CFS. The family personally covers every operating cost so that 100% of donations fund research.",
  };
}

export default async function AboutPage() {
  const [page, team] = await Promise.all([
    getPageBySlug("about"),
    getTeam(),
  ]);

  // Split team by role_type so the page can show them in groups.
  const teamOnly    = team.filter((m) => m.role_type === "team");
  const advisors    = team.filter((m) => m.role_type === "advisor");
  const jury        = team.filter((m) => m.role_type === "jury");

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-ink/8">
        <div className="mx-auto max-w-[1200px] px-7 py-20 md:px-12 md:py-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            About
          </p>
          <h1 className="headline mt-4 text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            {page ? decodeHtml(page.title.rendered) : "About the WE&ME Foundation"}
          </h1>
          <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.5] text-ink/85">
            The WE&amp;ME Foundation was founded in 2020 by the Ströck family.
            Two of their three sons, Christoph and Philipp, live with ME/CFS.
            The family personally covers every operating cost so that{" "}
            <span className="bg-urgency px-1 font-semibold">100% of donations fund research</span>.
          </p>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-empathy">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12 md:grid md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
              Our story
            </p>
            <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]">
              How a family became a foundation.
            </h2>
          </div>
          <div className="md:col-span-7 mt-5 md:mt-0">
            {page ? (
              <div
                className="prose prose-lg max-w-[60ch] text-[17px] leading-[1.55] text-ink/85"
                dangerouslySetInnerHTML={{ __html: page.content.rendered }}
              />
            ) : (
              <p className="text-[17px] leading-[1.55] text-ink/85">
                Add an "about" page in WordPress to edit this content.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Team &amp; advisory board
          </p>
          <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]">
            The people behind the work.
          </h2>

          {teamOnly.length > 0 && (
            <PersonGrid title="Team" people={teamOnly} />
          )}
          {advisors.length > 0 && (
            <PersonGrid title="Scientific Advisory Board" people={advisors} />
          )}
          {jury.length > 0 && (
            <PersonGrid title="Jury" people={jury} />
          )}
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="bg-[#f0f6ef]">
        <div className="mx-auto max-w-[1200px] px-7 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
            Partners
          </p>
          <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]">
            Rigorous process. Independent decisions.
          </h2>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.45] text-ink/85">
            Our funding calls are run with the FWF (Austrian Science Fund)
            and the WWTF (Vienna Science and Technology Fund). Patients sit on
            the jury of our largest calls and are involved at every step.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-6">
            <li className="text-[15px] font-semibold tracking-wide text-ink">
              FWF
            </li>
            <li className="text-[15px] font-semibold tracking-wide text-ink">
              WWTF
            </li>
            <li className="text-[15px] font-semibold tracking-wide text-ink">
              Science for ME
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

function PersonGrid({ title, people }: { title: string; people: Awaited<ReturnType<typeof getTeam>> }) {
  return (
    <div className="mt-12">
      <h3 className="headline text-[20px] font-semibold text-ink/70 mb-6">
        {title}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {people.map((p) => {
          const photo = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
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
              <p className="mt-4 text-[18px] font-semibold leading-tight text-ink">
                {decodeHtml(p.title.rendered)}
              </p>
              {p.role && (
                <p className="mt-1 text-[14px] text-ink/70 leading-snug">
                  {decodeHtml(p.role)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
