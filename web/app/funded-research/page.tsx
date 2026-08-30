import type { Metadata } from "next";
import { getProjects } from "@/lib/wp";
import { FundedResearchList } from "@/components/funded-research/FundedResearchList";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Funded Research — WE&ME Foundation",
  description:
    "Every research project funded by the WE&ME Foundation: instruments, principal investigators, institutions and volumes in one searchable list.",
  openGraph: {
    type: "website",
    title: "Funded Research — WE&ME Foundation",
    description:
      "Every research project funded by the WE&ME Foundation, in one searchable list.",
  },
  alternates: { canonical: "/funded-research" },
};

const EYEBROW = "text-[11px] font-bold uppercase tracking-[0.08em] text-blue";
const HEADLINE =
  "headline text-[34px] md:text-[52px] lg:text-[40px] font-bold leading-[1] tracking-[-0.01em]";
const BODY = "text-[17px] leading-[1.45] text-ink/85";
const WRAP = "mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12";

export default async function FundedResearchPage() {
  const projects = await getProjects();

  return (
    <section id="list" className="scroll-mt-24 bg-white">
      <div className={WRAP}>
        <Reveal>
          <p className={EYEBROW}>Funded Research</p>
          <h1 className={`${HEADLINE} mt-3`}>
            Every project.
            <br />
            One list.
          </h1>
          <p className={`mt-5 ${BODY} max-w-[52ch]`}>
            Search and filter every project the WE&amp;ME Foundation funds,
            across all funding instruments.
          </p>
        </Reveal>

        <FundedResearchList projects={projects} />
      </div>
    </section>
  );
}
