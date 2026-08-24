import type { Metadata } from "next";
import { getCalls, getProjects } from "@/lib/wp";
import { formatEuro } from "@/lib/utils";
import { decodeHtml } from "@/lib/decode";
import { Reveal } from "@/components/site/Reveal";
import { PageCTA } from "@/components/site/PageCTA";

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
  "text-[11px] font-bold uppercase tracking-[0.08em] text-blue";
const HEADLINE =
  "headline text-[34px] md:text-[52px] font-bold leading-[1] tracking-[-0.01em]";
const SUBHEAD = "headline text-[22px] font-bold leading-[1.1]";
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

function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="mt-6 border-t border-ink/15">
      {items.map((i) => (
        <details key={i.q} className="group border-b border-ink/15">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-[17px] font-medium leading-[1.35] text-ink marker:hidden">
            <span className="max-w-[60ch]">{i.q}</span>
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-ink/45 transition-transform group-open:rotate-180"
            >
              ⌄
            </span>
          </summary>
          <div className={`${BODY} max-w-[68ch] pb-5`}>{i.a}</div>
        </details>
      ))}
    </div>
  );
}

const S4ME_TEXT =
  "S4ME, an established and internationally active ME/CFS patient community, contributes to the WE&ME Research Funding Programme. Its core value lies in the credibility and patient-centred legitimacy that an established, independent community lends to the programme. It nominates three of the seven standing jury members (plus two back-ups), embedding patient expertise directly into proposal assessment and funding decisions with full voting rights. It also promotes the programme's calls and awards through its own channels, encourages donations, and brokers introductions to patient organisations abroad. For WE&ME, the participation of S4ME is absolutely vital for the success of the funding programme.";

const DISCLAIMER =
  "This call is jointly developed by the WE&ME Foundation and Science for ME, and is managed by the Vienna Science and Technology Fund (WWTF) GmbH. The call is funded entirely by the WE&ME Foundation.";

const PROJECT_FAQS: { q: string; a: string }[] = [
  {
    q: "Is this call open to researchers outside of Europe?",
    a: "Yes. The call is open internationally, with no geographic restrictions on the host institution. The PI and Coordinator (PI&C) and all co-PIs must be based at a university, non-university research institution, or other eligible non-profit research organisation.",
  },
  {
    q: "I work primarily on long COVID or another post-acute infection syndrome. Can I apply?",
    a: "Projects investigating patients from other post-acute infection contexts are eligible provided participants fulfill established ME/CFS diagnostic criteria. Projects that mix participants with post-COVID organ damage, for example cardiac or pulmonary injury, into ME/CFS cohorts without clear separation are out of scope.",
  },
  {
    q: "I am new to ME/CFS research but bring methods from an adjacent field. Can I apply?",
    a: "Yes, and applications of this kind are highly encouraged. Research teams are strongly encouraged to pair ME/CFS expertise with complementary skills from adjacent disciplines such as immunology, neuroscience, mitochondrial biology, autonomic physiology, sleep research, computational biology, data science or other disciplines.",
  },
  {
    q: "Can I apply as PI on more than one proposal in this call?",
    a: "A researcher may appear as PI and Coordinator or co-PI in a maximum of two proposals in this call.",
  },
  {
    q: "Can industry partners be part of the consortium?",
    a: "Yes, as in-kind collaborators. Industry partners are not eligible to receive funding but may contribute to the project.",
  },
  {
    q: "Will career breaks be taken into account in the evaluation?",
    a: "Yes. Career breaks for parental leave, care duties, or prolonged illness, including ME/CFS itself, will be considered when assessing academic age and track record. Applicants should provide the relevant time periods so this can be calculated fairly.",
  },
  {
    q: "Do I need a formal ME/CFS diagnosis for every participant?",
    a: "Yes. Clearly state the criteria for participant selection, using a definition of ME/CFS that includes Post-Exertional Malaise (PEM).",
  },
  {
    q: "Do I have to include severely affected (housebound or bedbound) patients?",
    a: "Inclusion is not mandatory, but where feasible it is strongly encouraged. Options include home visits, remote measurements, or use of existing data collected from this group.",
  },
  {
    q: "What counts as meaningful patient involvement?",
    a: "Involvement that goes beyond participation as study subjects. Examples include co-design of research questions and protocols, advisory roles during the project, contribution to dissemination, and co-authorship where appropriate. Tokenistic involvement, for example listing a patient on an advisory board without a concrete role, will be assessed negatively.",
  },
  {
    q: "Can patient experts be paid from the project budget?",
    a: "Yes. Compensation for patient experts and patient organisations contributing substantively (e.g. co-design, advisory roles, dissemination) is an eligible cost, either as personnel or non-personnel costs.",
  },
  {
    q: "Can I submit a full proposal directly without going through Stage 1?",
    a: "No. The call uses a mandatory two-stage process. Only teams invited after Stage 1 may submit a full proposal at Stage 2. Approximately three times as many teams as funding allows will be invited to Stage 2.",
  },
  {
    q: "Is there a rebuttal stage?",
    a: "No. There is no rebuttal at either Stage 1 or Stage 2. The jury decision and the formal funding decision by the WE&ME Foundation are final. All Stage 2 applicants receive written feedback summarising the main reasons for the decision.",
  },
  {
    q: "Are overhead costs covered?",
    a: "As the WE&ME Foundation is a private non-profit foundation, financing of university infrastructure cannot be at the core of this highly focused call. However, the WE&ME Foundation acknowledges that research institutions carry substantial infrastructure costs to provide cutting-edge technology and workspace for scientists. Therefore, a maximum of 10% overhead costs of the project budget may be covered by the WE&ME Foundation.",
  },
  {
    q: "What is the cap on non-personnel costs?",
    a: "Non-personnel costs may not exceed 40% of the project budget. Smaller equipment items are eligible up to EUR 1,500 per item, but the WE&ME Foundation encourages the applicants to keep the non-personnel costs at a low level and finance personnel via the funding.",
  },
  {
    q: "Are publication costs eligible?",
    a: "Yes. Article Processing Charges (APCs) for open access publications are eligible as non-personnel costs. All peer-reviewed publications from funded projects must be published open access.",
  },
  {
    q: "When must ethics approval be in place?",
    a: "An acknowledgement of receipt from the relevant ethics committee should be submitted with the full proposal. Final ethics approval (Votum) must be submitted to the WE&ME Foundation before project start.",
  },
  {
    q: "What are the expectations regarding open research data?",
    a: "Data must be FAIR (Findable, Accessible, Interoperable, Reusable), machine-readable, and deposited in a trusted, discipline-appropriate repository such as MAP ME/CFS or a comparable alternative. Data should be released no later than the publication of corresponding results, and no later than twelve months after project end where no publication results. Justified exceptions, for example for patient privacy or sensitive cohorts, must be well argued in the Open Science Statement.",
  },
  {
    q: "Is the follow-up consolidation call in 2028/2029 guaranteed?",
    a: "No, not at this point. A consolidation call is envisioned, and successful WE&ME Projects might be invited to apply, if the consolidation call is confirmed.",
  },
  {
    q: "What is S4ME's role?",
    a: "Two things: governance and outreach. S4ME nominates patient representatives to the funding jury, and it promotes the programme to the international ME/CFS patient and research community.",
  },
];

const AWARD_DETAILS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Purpose and objectives",
    a: (
      <>
        <p>
          ME/CFS and related post-acute infectious diseases remain severely
          underfunded and underrepresented in biomedical research. Early-career
          researchers who commit to this field often face greater uncertainties
          and less support than their peers. Many are drawn to ME/CFS research
          through personal experience with the disease, navigating a difficult
          trade-off between career security and research conviction.
        </p>
        <p className="mt-3">
          The WE&amp;ME Emerging Leader Award recognises this commitment. It
          signals to the scientific community that dedication to this field is
          valued and sustained. Through these activities, we aim to transform
          what might otherwise be a high-risk career choice into a high-gain
          endeavour, supporting researchers whose work advances our
          understanding of ME/CFS. Beyond financial support, we aim to provide
          visibility and career recognition to exceptional early-career
          researchers, create lasting connections between awardees and the
          broader ME/CFS community, and amplify the voices of researchers who
          bridge science and patient communities.
        </p>
      </>
    ),
  },
  {
    q: "Eligibility",
    a: (
      <>
        <p>
          <strong>Career stage.</strong> Nominees must be either PhD candidates
          or have completed their PhD within 8 years of the nomination deadline.
          Career breaks for parental leave, care duties, or prolonged illness
          are taken into account in eligibility assessment. Applicants should
          document any such periods in their submission.
        </p>
        <p className="mt-3">
          <strong>Research focus.</strong> Nominees must be actively working in
          ME/CFS or related post-acute infectious disease research. We value
          researchers who take innovative approaches to address the complex
          challenges of these diseases. Applicants with deep domain expertise in
          a particular field are equally welcome.
        </p>
        <p className="mt-3">
          <strong>Nomination.</strong> Every nominee must be recommended by
          either (a) a senior researcher at faculty level or equivalent, or (b) a
          patient, patient representative, or patient organisation/charity.
          Joint nominations are eligible. Each nominator may put forward a
          maximum of two candidates. Submissions without a nominator will not be
          accepted.
        </p>
      </>
    ),
  },
  {
    q: "Application process",
    a: (
      <>
        <p>
          Applications are submitted via{" "}
          <a
            href="mailto:funding@weandmecfs.org"
            className="underline underline-offset-4 hover:text-blue"
          >
            funding@weandmecfs.org
          </a>{" "}
          and consist of a single document of no more than 2 pages, structured
          in two parts (template will be provided).
        </p>
        <p className="mt-3">
          <strong>Candidate section (approx. 1.5 pages):</strong> short bio
          (current position, year of PhD completion, host institution, and a
          one-sentence description of your current research focus; links to a
          research portfolio are highly encouraged); your engagement with ME/CFS
          or post-acute infectious diseases: when and how did you start working
          in this area, and what sustains your commitment; your most significant
          scientific contribution to date (publication, method, dataset, tool or
          finding) and why you consider it significant, and how your work
          connects with or benefits the patient community, with concrete
          examples rather than general statements; use of the award funds:
          which conference(s) or research visit(s) you would attend and what you
          would present (a rough estimate is sufficient; activities should take
          place within the next 12–24 months); and the research question in this
          field you most want to see answered in the next five years, and the
          role you see yourself playing in answering it.
        </p>
        <p className="mt-3">
          <strong>Nominator section (approx. 0.5 pages):</strong> short bio of
          the nominator (2 sentences max); why this candidate, why now, and what
          sets them apart from peers at the same career stage; and what specific
          opportunities the award would unlock for this candidate. When two
          nominators are involved, ensure both nominators are represented
          adequately.
        </p>
      </>
    ),
  },
  {
    q: "Evaluation criteria",
    a: (
      <>
        <p>
          Applications are assessed by an independent jury against the following
          criteria:
        </p>
        <ul className="mt-3 space-y-2">
          <li>
            <strong>Research quality and significance:</strong> demonstrated
            scientific contribution (publication, method, dataset, tool) from
            the candidate with measurable or anticipated impact in ME/CFS or
            post-acute infectious disease research.
          </li>
          <li>
            <strong>Sustained commitment to the field:</strong> clear evidence
            of deliberate engagement with ME/CFS research and articulation of
            why this commitment matters to the researcher.
          </li>
          <li>
            <strong>Patient-centered research:</strong> concrete examples of how
            the candidate&apos;s research connects with or benefits patient
            communities.
          </li>
          <li>
            <strong>Career development potential:</strong> clarity on how the
            award would catalyse the next phase of the candidate&apos;s career.
          </li>
          <li>
            <strong>Distinctiveness:</strong> distinction of the candidate
            relative to their career stage and cohort, as described by
            nominators.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "Selection and decision process",
    a: (
      <p>
        An independent jury appointed by the WE&amp;ME Foundation evaluates all
        applications. The jury provides a recommendation to the WE&amp;ME
        Executive Board, which takes the formal funding decision. There is no
        rebuttal stage. The jury recommendation and the funding decision by the
        WE&amp;ME Executive Board are final.
      </p>
    ),
  },
  {
    q: "Funding contract",
    a: (
      <p>
        The contract will be between the WE&amp;ME Foundation and the respective
        affiliation of the awardee. In case of a positive funding decision, the
        WE&amp;ME Foundation will draw up the funding contract.
      </p>
    ),
  },
  {
    q: "Award benefits",
    a: (
      <p>
        In addition to the financial award, recipients benefit from integration
        into the network of WE&amp;ME-funded projects and the ME/CFS community,
        a platform to present their work to an international scientific and
        patient audience, and a lasting connection to the WE&amp;ME Foundation
        and its awardee community.
      </p>
    ),
  },
  {
    q: "Communication and acknowledgement",
    a: (
      <p>
        Awardees must acknowledge the WE&amp;ME Foundation in all publications,
        presentations, and public communications relating to the project. Funded
        awardees agree to contribute, where reasonable, to WE&amp;ME Foundation
        communications activities, for example by providing lay summaries,
        interviews, or images. The WE&amp;ME Foundation may publicise funded
        awardees via its own channels.
      </p>
    ),
  },
];

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

/* ---------- Full funded-research archive (press releases on the live
 * blog). Distinct from the WP `project` CPT rendered below, which
 * tracks amounts/institutions for the flagship instruments — this is
 * the complete historical list of announcements. ---------- */
const FUNDED_ARCHIVE = [
  {
    title: "WE&ME Award – The Winning Project",
    href: "https://www.weandmecfs.org/weme-award-the-winning-project/",
  },
  {
    title: "Sequence ME & Long Covid",
    href: "https://www.weandmecfs.org/sequence-me-long-covid/",
  },
  {
    title: "ME/CFS Fellowships 2026",
    href: "https://www.weandmecfs.org/me-cfs-fellowships-2026-vergeben/",
  },
  {
    title:
      "WWTF call: research projects on post-acute infectious diseases (focus on ME/CFS)",
    href: "https://www.weandmecfs.org/wwtf-call-for-proposals-research-projects-on-post-acute-infectious-diseases-focus-on-me-cfs/",
  },
  {
    title: "WWTF and WE&ME Foundation fund seven innovative research projects",
    href: "https://www.weandmecfs.org/wwtf-and-weme-foundation-fund-seven-innovative-research-projects/",
  },
  {
    title: "Joint promotion of ME/CFS research in Innsbruck",
    href: "https://www.weandmecfs.org/joint-promotion-of-me-cfs-research-in-innsbruck/",
  },
  {
    title: "Care4PAIS & ME/CFS",
    href: "https://www.weandmecfs.org/care4paisme-cfs/",
  },
  {
    title: "The gut virome in ME/CFS",
    href: "https://www.weandmecfs.org/the-gut-virome-in-me-cfs/",
  },
  {
    title: "Johadami ME/CFS Research Grant 2023",
    href: "https://www.weandmecfs.org/johadami-me-cfs-research-grant-2023/",
  },
  {
    title:
      "ME/CFS Biobank Austria: Austria's first biobank for samples from ME/CFS patients",
    href: "https://www.weandmecfs.org/me-cfs-biobank-austria-establishment-of-austrias-first-biobank-for-samples-from-me-cfs-patients/",
  },
  {
    title: "The role of psychotherapy in the treatment of ME/CFS patients",
    href: "https://www.weandmecfs.org/the-role-of-psychotherapy-in-the-treatment-of-me-cfs-patients/",
  },
  {
    title: "Johadami's ME/CFS Research Grant 2022",
    href: "https://www.weandmecfs.org/johadamis-me-cfs-research-grant-2022/",
  },
  {
    title:
      "Link between EBV reactivation and the development of long-lasting COVID fatigue",
    href: "https://www.weandmecfs.org/link-between-ebv-reactivation-and-the-development-of-long-lasting-covid-fatigue/",
  },
  {
    title:
      "The occurrence of hyperactivated platelets and fibrin microclots in ME/CFS",
    href: "https://www.weandmecfs.org/the-occurrence-of-hyperactivated-platelets-and-fibrin-microclots-in-me-cfs/",
  },
  {
    title:
      "Understanding potential infectious triggers and mitochondrial dysfunction in ME/CFS",
    href: "https://www.weandmecfs.org/understanding-potential-infectious-triggers-and-mitochondrial-dysfunction-in-me-cfs/",
  },
  {
    title:
      "Investigation of genes expressed in immune cells of patients and control subjects",
    href: "https://www.weandmecfs.org/investigation-of-genes-expressed-in-immune-cells-of-patients-and-control-subjects/",
  },
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
          <Reveal className={WRAP}>
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

            <Reveal as="ol" className="mt-8 divide-y divide-ink/15 border-t border-b border-ink/15">
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
            </Reveal>

            <div className="mt-10 max-w-[65ch] text-[17px] leading-[1.5] text-ink/85 space-y-5">
              <p>
                Our work runs in three strands. The first is allocation across
                borders, in both directions. Outward, we allocate pooled private
                funding internationally, to the strongest centres of expertise
                wherever they are, through a selection process operated by the
                WWTF, with patient experts from Science for ME on the jury.
                Inward, we are building Vienna into a centre of expertise
                together with the WWTF and the City of Vienna, where incoming
                international funding can be doubled through local co-financing.
                Our named instruments span both directions. The{" "}
                <a href="#projects" className="text-blue no-underline hover:opacity-80">
                  WE&amp;ME Projects
                </a>
                , the{" "}
                <a href="#award" className="text-blue no-underline hover:opacity-80">
                  WE&amp;ME Emerging Leader Award
                </a>{" "}
                and the{" "}
                <a href="#fellowships" className="text-blue no-underline hover:opacity-80">
                  ME/CFS Fellowships
                </a>{" "}
                allocate internationally; the ME/CFS Consolidation Call with the
                WWTF and the{" "}
                <a href="#weme-award" className="text-blue no-underline hover:opacity-80">
                  WE&amp;ME Award
                </a>{" "}
                with the FWF strengthen the national base.
              </p>
              <p>
                The second is coordination. Germany, Austria and Switzerland are
                becoming a new force in ME/CFS research; our work is to make the
                region act like one, connecting programmes and infrastructure
                so they scale instead of duplicating. But no region solves this
                alone: a cure will also need far greater investment in the United
                States and China. So we coordinate with partners in the US where
                it helps, and we are beginning to build ties within the research
                field in China.
              </p>
              <p>
                The third is the frontier. We are setting up working groups to
                map where ME/CFS research should go next: which scopes deserve
                funding, and the questions of strategy, geographical and
                constituency scales, incentives and coordination that come with
                them.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ------------------------------------------------ strategy closing */}
        <section className="bg-empathy text-ink">
          <Reveal className={WRAP}>
            <p className="headline text-[28px] md:text-[44px] font-bold uppercase leading-[1] tracking-[-0.01em] max-w-[24ch]">
              Everything we allocate and everything we coordinate serves one
              clock: time to a cure.
            </p>
          </Reveal>
        </section>

        {/* ------------------------------------------------------ projects */}
        <section id="projects" className="scroll-mt-24 bg-empathy">
          <Reveal className={WRAP}>
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
              patient representatives is mandatory. Teams must demonstrate
              adequate understanding of ME/CFS and show that participant
              selection and study design are appropriate according to
              state-of-the-art criteria.
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
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
                  Currently open
                </p>
                <h3 className="headline mt-2 text-[26px] font-bold leading-[1.1]">
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

            <Block title="Timeline">
              <Bullets
                items={[
                  "Call launch: 15 June 2026",
                  "Stage 1 short proposal deadline: 25 August 2026, 2pm CET",
                  "Stage 2 full proposal deadline (by invitation): 10 November 2026, 2pm CET",
                  "Expected funding decision: mid-December 2026",
                  "Project start: from January 2027",
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
              <p className={`mt-3 ${BODY} max-w-[68ch]`}>{S4ME_TEXT}</p>
            </Block>

            <div className="mt-8 flex flex-wrap gap-3">
              <DocLink
                href="https://www.weandmecfs.org/wp-content/uploads/2026/06/2026_05_WE-ME_Projects-Call_A4-2.pdf"
                label="Full call specifications"
              />
              <DocLink
                href="https://www.weandmecfs.org/wp-content/uploads/2026/06/2026_05_WE-ME_Projects_Guide-to-Submission.pdf"
                label="Guide to submission"
              />
              <DocLink
                href="https://funding.weandmecfs.org.jpeto.brunner.at/"
                label="Submit application"
              />
              <DocLink
                href="https://www.weandmecfs.org/wp-content/uploads/2026/07/WE_ME_InfoSession_Slides_final-1.pdf"
                label="Info session slides"
              />
            </div>

            <Block title="Frequently asked questions">
              <Accordion
                items={PROJECT_FAQS.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))}
              />
            </Block>

            <p className="mt-6 text-[14px] leading-[1.5] text-ink/55 max-w-[68ch]">
              {DISCLAIMER}
            </p>
          </Reveal>
        </section>

        {/* ------------------------------------------------------- award */}
        <section id="award" className="scroll-mt-24 bg-white">
          <Reveal className={WRAP}>
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
              disease research. It provides financial support, visibility, and
              lasting integration into the internationally growing ME/CFS
              research and stakeholder community.
            </p>
            <p className={`mt-4 ${BODY} max-w-[60ch]`}>
              The jury includes leading ME/CFS researchers alongside patient
              representatives. This joint selection model ensures that awardees
              are recognised not only for scientific rigour but also for their
              genuine commitment to patient-centred research and community
              engagement. The award is jointly developed and supported by
              Science for ME.
            </p>

            <Block title="Who can be nominated?">
              <Bullets
                items={[
                  "Researchers at an early stage of their career, including those who completed their PhD within the past 8 years and current PhD students (career breaks such as parental leave, illness or care duties are taken into account)",
                  "Researchers currently active in ME/CFS or related post-acute infectious disease research",
                  "Open to researchers from all countries",
                ]}
              />
            </Block>

            <Block title="Who nominates?">
              <p className={`mt-3 ${BODY} max-w-[68ch]`}>
                Every nominee must be recommended by a senior researcher
                (faculty-level or equivalent), patients, patient representatives
                or charities. Joint nominations are eligible. Submissions
                without a nominator will not be accepted.
              </p>
            </Block>

            <Block title="Award amount">
              <Bullets
                items={[
                  "Two awards per year, EUR 5,000 each",
                  "Funds may be used for conference travel, research stays, and presenting work at international conferences",
                ]}
              />
            </Block>

            <Block title="Process and timeline">
              <Bullets
                items={[
                  "Application submitted via email to funding@weandmecfs.org",
                  "Jury evaluation and recommendation to the WE&ME Board of Directors",
                  "Funding decision by the WE&ME Board of Directors",
                  "Nomination window opens: 15 June 2026",
                  "Application deadline: 15 October 2026",
                  "Announcement of award: December 2026",
                ]}
              />
            </Block>

            <div className="mt-8 flex flex-wrap gap-3">
              <DocLink
                href="https://www.weandmecfs.org/wp-content/uploads/2026/06/2025_06_WE-ME_Emerging-Leader-Award-1.pdf"
                label="Full call specifications"
              />
              <DocLink
                href="https://www.weandmecfs.org/wp-content/uploads/2026/06/award_template.docx"
                label="Download application template"
              />
              <DocLink
                href="https://www.weandmecfs.org/wp-content/uploads/2026/07/WE_ME_InfoSession_Slides_final-1.pdf"
                label="Info session slides"
              />
            </div>

            <Block title="All details">
              <Accordion items={AWARD_DETAILS} />
            </Block>

            <p className="mt-6 text-[14px] leading-[1.5] text-ink/55 max-w-[68ch]">
              {DISCLAIMER}
            </p>
          </Reveal>
        </section>

        {/* ------------------------------------------------- weme-award */}
        <section id="weme-award" className="scroll-mt-24 bg-white">
          <Reveal className={WRAP}>
            <p className={EYEBROW}>WE&amp;ME Award</p>
            <h2 className={`${HEADLINE} mt-3`}>Excellence in ME/CFS research.</h2>
            <p className={`mt-4 ${BODY} max-w-[60ch]`}>
              Awarded with the FWF through its alpha+ Foundation. The 2026 award
              of €450,000 goes to Matthias Wielscher of the Medical University
              of Vienna for &ldquo;Mechanistic endotypes in ME/CFS&rdquo;.
            </p>
            <a
              href="https://www.weandmecfs.org/weme-award-the-winning-project/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center text-[16px] font-semibold text-blue no-underline hover:opacity-80"
            >
              The winning project →
            </a>
          </Reveal>
        </section>

        {/* ------------------------------------------------- fellowships */}
        <section id="fellowships" className="scroll-mt-24 bg-empathy">
          <Reveal className={WRAP}>
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
          </Reveal>
        </section>

        {/* ---------------------------------------------- funded research */}
        <section id="funded" className="scroll-mt-24 bg-white">
          <Reveal className={WRAP}>
            <p className={EYEBROW}>Funded research</p>
            <h2 className={`${HEADLINE} mt-3`}>
              Every project.
              <br />
              One list.
            </h2>

            {featuredProjects.length > 0 && (
              <>
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
              </>
            )}

            <Block title="Full project archive">
              <p className={`mt-3 ${BODY} max-w-[46ch]`}>
                Research funded with your donations. Every project below is
                ongoing.
              </p>
              <ol className="mt-6 divide-y divide-ink/15 border-t border-b border-ink/15">
                {FUNDED_ARCHIVE.map((p, i) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="grid grid-cols-[auto_1fr_auto] items-start gap-x-5 py-5 md:gap-x-8 md:py-6 group"
                    >
                      <span className="headline text-lg md:text-2xl text-blue tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[17px] leading-[1.35] font-medium max-w-[60ch] group-hover:text-blue transition-colors">
                        {p.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-ink/40 group-hover:text-blue transition-colors"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </Block>
          </Reveal>
        </section>

        {/* --------------------------------------------------- proposals */}
        <section id="proposals" className="scroll-mt-24 bg-mint">
          <Reveal className={WRAP}>
            <p className={EYEBROW}>Call for proposals</p>
            <h2 className={`${HEADLINE} mt-3`}>
              Open calls.
              <br />
              Get in touch.
            </h2>
            <p className={`mt-5 ${BODY} max-w-[60ch]`}>
              WE&amp;ME Projects and the WE&amp;ME Emerging Leader Award are
              currently open. If you are planning a proposal, have a question
              that the FAQs do not answer, or want to discuss a research idea
              with us, write to us, we answer every enquiry.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12 max-w-[900px]">
              <div>
                <h3 className={SUBHEAD}>General enquiries</h3>
                <p className={`mt-3 ${BODY}`}>
                  WE&amp;ME Foundation
                  <br />
                  <a
                    href="mailto:funding@weandmecfs.org"
                    className="underline underline-offset-4 hover:text-blue"
                  >
                    funding@weandmecfs.org
                  </a>
                </p>
              </div>
              <div>
                <h3 className={SUBHEAD}>Call manager</h3>
                <p className={`mt-3 ${BODY}`}>
                  Dr. Benjamin Missbach
                  <br />
                  Vienna Science and Technology Fund (WWTF GmbH)
                  <br />
                  <a
                    href="mailto:benjamin.missbach@wwtf.at"
                    className="underline underline-offset-4 hover:text-blue"
                  >
                    benjamin.missbach@wwtf.at
                  </a>
                  <br />
                  <a
                    href="tel:+431402314319"
                    className="underline underline-offset-4 hover:text-blue"
                  >
                    +43 1 402 31 43 19
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="mailto:funding@weandmecfs.org"
                className="inline-flex items-center rounded-full bg-blue px-5 py-3 text-[15px] font-semibold text-white hover:opacity-90 transition"
              >
                Email us about a proposal
              </a>
              <DocLink
                href="https://funding.weandmecfs.org.jpeto.brunner.at/"
                label="Submit an application"
              />
            </div>
          </Reveal>
        </section>
      </main>

      <PageCTA />
    </div>
  );
}
