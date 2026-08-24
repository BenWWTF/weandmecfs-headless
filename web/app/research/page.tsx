import type { Metadata } from "next";
import { getCalls, getProjects } from "@/lib/wp";
import { formatEuro } from "@/lib/utils";
import { decodeHtml } from "@/lib/decode";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Research — WE&ME Foundation",
  description:
    "How the WE&ME Foundation funds biomedical ME/CFS research: five principles, rigorous processes, patients embedded at every step.",
  openGraph: {
    type: "website",
    title: "Research — WE&ME Foundation",
    description:
      "How the WE&ME Foundation funds biomedical ME/CFS research: five principles, rigorous processes, patients embedded at every step.",
  },
  alternates: { canonical: "/research" },
};

const EYEBROW =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-blue";
const HEADLINE =
  "headline text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em]";
const SUBHEAD = "headline text-[22px] font-semibold leading-[1.1]";
const BODY = "text-[17px] leading-[1.45] text-ink/85";
const WRAP = "mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12";

/* ---------- five principles (mirrors the latest GitHub mockup) -------- */

const principles = [
  {
    n: "01",
    title: "People",
    body: "Bringing the best talents and established researchers from relevant fields into ME/CFS research",
  },
  {
    n: "02",
    title: "Allocation",
    body: "Mix of reactive and proactive funding to support local and international communities",
  },
  {
    n: "03",
    title: "Patient experts",
    body: "All funding and research processes have deeply embedded patient experts",
  },
  {
    n: "04",
    title: "Topics",
    body: "All topics addressed in funding activities are derived from a thorough scoping process",
  },
  {
    n: "05",
    title: "Highest quality standards",
    body: "Competitive and innovative selection process",
  },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((t) => (
        <li
          key={t}
          className={`${BODY} grid grid-cols-[10px_1fr] gap-x-3`}
        >
          <span
            aria-hidden="true"
            className="mt-[10px] h-[5px] w-[5px] rounded-full bg-blue"
          />
          <span className="max-w-[68ch]">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h3 className={SUBHEAD}>{title}</h3>
      {children}
    </div>
  );
}

function DocLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-full border border-ink/20 px-4 py-2 text-[14px] font-medium text-ink hover:border-blue hover:text-blue transition-colors"
    >
      {label} →
    </a>
  );
}

/* ---------- ME/CFS Fellowships 2026 ---------- *
 * Mirrors the public announcement on the live site. Editors can
 * extend this list with each new cohort; once the WP Fellowship
 * CPT exists (session 4) these constants become the demo fallback. */
const FELLOWSHIPS_2026 = [
  {
    name: "Karen Giménez Orenga",
    org: "Universidad Católica de Valencia",
    title: "Uncovering the Genetic Contribution of Human Endogenous Retroviruses to ME/CFS",
    amount: "€39,504",
  },
  {
    name: "Leonardo Vincenzi",
    org: "Medical University of Vienna",
    title: "Mendelian Randomization for Evaluating Medicines and Approved Pharmacotherapies in ME/CFS",
    amount: "€37,884",
  },
  {
    name: "Daniel Garcia De Otazo Hernandez",
    org: "TU Vienna",
    title: "The sweet side of ME/CFS treatment: Glycan analysis in Korean medicine",
    amount: "€40,000",
  },
  {
    name: "Maria Ljungström",
    org: "Medical University of Vienna",
    title: "Persistent Platelet-Monocyte CrossTalk Underlies Failure to Resolve Inflammation and Symptoms in ME/CFS",
    amount: "—",
  },
  {
    name: "Franziska Schoenknecht",
    org: "Medical University of Vienna",
    title: "Decoding B-cell repertoires in ME/CFS and post-acute infection syndromes",
    amount: "€38,283",
  },
  {
    name: "Léa Hoarau",
    org: "Universidad Católica de Valencia",
    title: "Blood-based epigenetic biomarkers for ME/CFS endotypes",
    amount: "€37,500",
  },
  {
    name: "Mireia Bañuls",
    org: "Universidad Católica de Valencia",
    title: "Mitochondrial function and metabolomic signatures in ME/CFS patient-derived cells",
    amount: "€40,000",
  },
];

const FELLOWSHIP_JURY = [
  "Chris Ponting (Chair) · University of Edinburgh, UK",
  "Alba Azola · Johns Hopkins Hospital, US",
  "Resia Pretorius · Stellenbosch University, SA",
  "Elisa Oltra · Catholic University of Valencia, ES",
  "David Putrino · Icahn School of Medicine, Mount Sinai, US",
  "Keith Geraghty · University of Manchester, UK",
];

export default async function ResearchPage() {
  // Pull live data for the funded projects and open calls so the
  // editors can update the WP admin and the page reflects it.
  const [calls, projects] = await Promise.all([getCalls(), getProjects()]);
  const featuredCall = calls.find((c) => c.featured && c.status === "open");
  const featuredProjects = projects.slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-ink">
      <main>
        {/* ------------------------------------------------------ strategy */}
        <section id="strategy" className="scroll-mt-24 bg-white">
          <div className={WRAP}>
            <p className={EYEBROW}>Research strategy</p>
            <h1 className={`${HEADLINE} mt-3`}>
              Five principles.
              <br />
              One goal.
            </h1>
            <div className={`mt-6 ${BODY} max-w-[65ch] space-y-5`}>
              <p>
                ME/CFS remains one of the most underfunded diseases in medicine
                relative to its burden: few dedicated centres, no approved
                treatments, researchers working in isolation on scattered
                grants. Only now is that beginning to change. Public funders,
                above all in Germany, are investing at a scale the field has
                never seen, and the DACH region is becoming a centre of gravity
                for ME/CFS research.
              </p>
              <p>
                New institutional money, though, flows into old structures.
                Research funding is organised country by country: every fund
                is bounded by national tax rules and mandates, every
                university and region decides for itself what to build, and
                even EU-level projects must serve many constituencies at once.
                Each level of the system optimises for its own goals. None is
                accountable for the one measure that matters to patients: how
                fast this disease gets solved.
              </p>
              <p>
                That measure is ours. WE&amp;ME optimises for time to a cure:
                not for any country&rsquo;s research budget, not for any
                institution&rsquo;s standing. Institutional and private
                funding are different routes to that goal, neither better nor
                worse, and strongest when they complement each other.
                Institutional programmes bring scale and continuity, and must
                balance many interests to do so. Private funding can
                concentrate, move across borders, and place the bets the
                system leaves open. We are built to use that freedom: our
                running costs are covered, our calls are operated by the FWF
                and the WWTF, two of the most prestigious research funding
                organisations in Central Europe, with patient experts embedded
                throughout, and we are bound to no border. There is no optimal
                strategy for a disease this incompletely understood, so we
                hold ourselves to the next best thing: five principles that
                govern every euro we allocate.
              </p>
            </div>

            <ol className="mt-8 divide-y divide-ink/15 border-t border-b border-ink/15">
              {principles.map((p) => (
                <li
                  key={p.n}
                  className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-8 py-5 md:py-7"
                >
                  <span className="headline text-2xl md:text-4xl text-blue tabular-nums">
                    {p.n}
                  </span>
                  <div>
                    <h2 className={SUBHEAD}>{p.title}</h2>
                    <p className={`mt-2 ${BODY} max-w-[60ch]`}>{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ projects */}
        <section id="projects" className="scroll-mt-24 bg-empathy">
          <div className={WRAP}>
            <p className={EYEBROW}>WE&amp;ME Projects</p>
            <h2 className={`${HEADLINE} mt-3`}>
              What we fund.
              <br />
              And how.
            </h2>
            <p className={`mt-5 ${BODY} max-w-[60ch]`}>
              This call is open to research teams that aim to advance our
              understanding of the biological mechanisms of Myalgic
              Encephalomyelitis/Chronic Fatigue Syndrome (ME/CFS). Projects must
              focus on ME/CFS and demonstrate a clear innovation in methodology
              or clinical approach. Meaningful involvement of patients and/or
              patient representatives is mandatory.
            </p>
            <p className={`mt-4 ${BODY} max-w-[60ch]`}>
              Projects investigating patients from other post-acute infection
              contexts are eligible provided participants fulfil established
              ME/CFS diagnostic criteria. This call explicitly welcomes
              applications from researchers new to the ME/CFS field, including
              those transitioning from related research areas.
            </p>

            {featuredCall && (
              <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
                  Currently open
                </p>
                <h3 className="headline mt-2 text-[26px] font-semibold leading-[1.1]">
                  {decodeHtml(featuredCall.title.rendered)}
                </h3>
                {featuredCall.amount_total && (
                  <p className="mt-2 text-[14px] font-semibold text-ink">
                    {formatEuro(featuredCall.amount_total)} total funding pool
                    {featuredCall.deadline && (
                      <> · deadline {new Date(featuredCall.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</>
                    )}
                  </p>
                )}
                {featuredCall.content?.rendered && (
                  <div
                    className="mt-3 text-[15px] leading-[1.5] text-ink/85"
                    dangerouslySetInnerHTML={{ __html: featuredCall.content.rendered }}
                  />
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <DocLink
                    href={featuredCall.external_url ?? "#"}
                    label="Read the full call"
                  />
                  {featuredCall.external_url && (
                    <DocLink
                      href="https://funding.weandmecfs.org.jpeto.brunner.at/"
                      label="Submit application"
                    />
                  )}
                </div>
              </div>
            )}

            <Block title="Who can apply?">
              <Bullets
                items={[
                  "Core team of two or three Principal Investigators (PIs)",
                  "All PIs must be based at a university, non-university research institution, or other eligible non-profit research organisation",
                  "Open internationally; no geographic restrictions on the host institution",
                  "Industry partners may collaborate in-kind but cannot be funded",
                  "Early-career researchers and applicants with career breaks are explicitly encouraged",
                  "Project duration: 18 to 24 months",
                ]}
              />
            </Block>

            <Block title="Funding">
              <Bullets
                items={[
                  "Indicative call volume: approx. 7 projects funded, subject to quality",
                  "Project budget: EUR 120,000 to EUR 180,000 per project",
                  "Personnel and non-personnel costs eligible (max. 40% non-personnel costs)",
                ]}
              />
            </Block>

            <Block title="Process">
              <Bullets
                items={[
                  "Two-stage submission: open Stage 1 short proposal, followed by invited Stage 2 full proposal",
                  "Application online via the WWTF Funding Portal",
                  "Selection by an international jury appointed by the WE&ME Foundation; funding decision by the WE&ME Foundation",
                  "Written feedback provided to all Stage 2 applicants",
                  "Funded teams will have the opportunity to apply for a consolidation call planned for 2028/2029",
                ]}
              />
            </Block>

            <Block title="Collaboration with Science for ME (S4ME)">
              <p className={`mt-3 ${BODY} max-w-[68ch]`}>
                S4ME, an established and internationally active ME/CFS patient
                community, contributes to the WE&amp;ME Research Funding
                Programme. It nominates three of the seven standing jury
                members (plus two back-ups), embedding patient expertise
                directly into proposal assessment and funding decisions with
                full voting rights. It also promotes the programme&apos;s
                calls and awards through its own channels, encourages
                donations, and brokers introductions to patient organisations
                abroad.
              </p>
            </Block>
          </div>
        </section>

        {/* ---------------------------------------------- funded research */}
        {featuredProjects.length > 0 && (
          <section id="funded" className="scroll-mt-24 bg-white">
            <div className={WRAP}>
              <p className={EYEBROW}>Funded research</p>
              <h2 className={`${HEADLINE} mt-3`}>
                What we&apos;ve
                <br />
                already funded.
              </h2>
              <p className={`mt-5 ${BODY} max-w-[60ch]`}>
                Every euro we grant is published. The list below is editable in
                wp-admin under <code>Funded Projects</code> and shows up here
                the moment an editor saves a change.
              </p>
              <ul className="mt-8 divide-y divide-ink/15 border-t border-b border-ink/15">
                {featuredProjects.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-start justify-between gap-6 py-4"
                  >
                    <div className="min-w-0">
                      <a
                        href={p.external_url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[18px] font-semibold leading-[1.3] text-blue no-underline hover:underline"
                      >
                        {decodeHtml(p.title.rendered)}
                      </a>
                      {p.institution && (
                        <p className="mt-1 text-[13px] leading-[1.5] text-ink/55">
                          {p.institution}
                        </p>
                      )}
                    </div>
                    {p.amount != null && (
                      <span className="shrink-0 whitespace-nowrap text-right text-[14px] tabular-nums text-ink">
                        {formatEuro(p.amount).replace(".00", "")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* --------------------------------------------------- award */}
        <section id="award" className="scroll-mt-24 bg-empathy">
          <div className={WRAP}>
            <p className={EYEBROW}>WE&amp;ME Emerging Leader Award</p>
            <h2 className={`${HEADLINE} mt-3`}>
              New leaders
              <br />
              for ME/CFS.
            </h2>
            <p className={`mt-5 ${BODY} max-w-[60ch]`}>
              The WE&amp;ME Emerging Leader Award recognises outstanding
              early-career researchers who combine scientific excellence with
              meaningful engagement in ME/CFS and related post-acute infectious
              disease research. Two awards of €5,000 each are granted annually
              to support conference attendance, research visits, and lasting
              integration into the international ME/CFS research community.
            </p>
            <Block title="Eligibility">
              <Bullets
                items={[
                  "PhD candidates or researchers who completed their PhD within 8 years of the nomination deadline",
                  "Active engagement in ME/CFS or post-acute infectious disease research",
                  "Nominated by a senior researcher or by a patient / patient organisation",
                  "Career breaks for parental leave, care duties, or prolonged illness (including ME/CFS) are taken into account",
                ]}
              />
            </Block>
            <div className="mt-8 flex flex-wrap gap-3">
              <DocLink
                href="https://www.weandmecfs.org/emerging-leader-award/"
                label="Award details"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- fellowships */}
        <section id="fellowships" className="scroll-mt-24 bg-empathy">
          <div className={WRAP}>
            <p className={EYEBROW}>ME/CFS Fellowships</p>
            <h2 className={`${HEADLINE} mt-3`}>
              Time to do
              <br />
              the science.
            </h2>
            <p className={`mt-5 ${BODY} max-w-[60ch]`}>
              With this funding instrument, the WE&amp;ME Foundation and the
              WWTF support accompanying projects on a smaller scale, primarily
              within existing programmes. The &ldquo;ME/CFS Call 2026 –
              Fellowships&rdquo; was published on 14 October 2025 by the WWTF
              together with the WE&amp;ME Foundation and is aimed at young
              scientists in the field of ME/CFS who would like to complete
              a six-month research stay at a research institution in Vienna,
              Lower Austria or abroad. The aim of the programme is to
              strengthen the international ME/CFS community, promote
              excellent young scientists and further expand professional
              exchange.
            </p>
            <p className={`mt-4 ${BODY} max-w-[60ch]`}>
              Funded by WE&amp;ME and the WWTF, supported among others by
              the Vienna Philharmonic Orchestra. A total of €233,171 was
              awarded across 7 submissions. The international jury met on 11
              March 2026; the formal decision by the WWTF Board followed on
              31 March 2026.
            </p>

            <Block title="Funded projects 2026">
              <ul className="mt-4 divide-y divide-ink/15 border-t border-b border-ink/15">
                {FELLOWSHIPS_2026.map((f) => (
                  <li key={f.name} className="py-5">
                    <p className="text-[17px] font-semibold leading-[1.3]">
                      {f.name}
                      <span className="font-normal text-ink/60">
                        {" "}· {f.org}
                      </span>
                    </p>
                    <p className={`mt-1 ${BODY} max-w-[68ch] italic`}>
                      {f.title}
                    </p>
                    {f.amount !== "—" && (
                      <p className="mt-1 text-[14px] tabular-nums text-ink/60">
                        Funding amount: {f.amount}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Jury">
              <Bullets items={FELLOWSHIP_JURY} />
            </Block>

            <div className="mt-8 flex flex-wrap gap-3">
              <DocLink
                href="https://www.weandmecfs.org/me-cfs-fellowships-2026-vergeben/"
                label="Fellowships announcement"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
