import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjects, getProjectBySlug, type Project } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { formatEuro } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";

export const revalidate = 300;

const EYEBROW = "text-[11px] font-bold uppercase tracking-[0.08em] text-blue";
const HEADLINE =
  "headline text-[34px] md:text-[52px] lg:text-[40px] font-bold leading-[1] tracking-[-0.01em]";
const BODY = "text-[17px] leading-[1.45] text-ink/85";
const WRAP = "mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12";

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  running: "Running",
  completed: "Completed",
  upcoming: "Upcoming",
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = `${decodeHtml(project.title.rendered)} — WE&ME Foundation`;
  return {
    title,
    openGraph: { type: "article", title },
    alternates: { canonical: `/funded-research/${slug}` },
  };
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-ink/15 pt-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45">
        {label}
      </dt>
      <dd className="mt-1 text-[16px] leading-[1.4] text-ink">{value}</dd>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <section className="scroll-mt-24 bg-white">
      <div className={WRAP}>
        <Reveal>
          <p className={EYEBROW}>
            {[project.instrument, project.year != null ? String(project.year) : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className={`${HEADLINE} mt-3 max-w-[20ch]`}>
            {decodeHtml(project.title.rendered)}
          </h1>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:max-w-[46rem] lg:grid-cols-4">
            <Meta label="Principal investigator" value={project.pi ?? "—"} />
            <Meta label="Institution" value={project.institution ?? "—"} />
            <Meta
              label="Volume"
              value={project.amount != null ? formatEuro(project.amount).replace(".00", "") : "—"}
            />
            <Meta
              label="Status"
              value={project.status ? STATUS_LABEL[project.status] : "—"}
            />
          </dl>

          {project.keywords && project.keywords.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-ink/8 px-3 py-1 text-[12px] text-ink/65"
                >
                  {k}
                </span>
              ))}
            </div>
          )}

          {project.content?.rendered && (
            <div
              className={`mt-8 ${BODY} max-w-[60ch]`}
              dangerouslySetInnerHTML={{ __html: project.content.rendered }}
            />
          )}

          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center text-[16px] font-semibold text-blue no-underline hover:opacity-80"
            >
              More on this project →
            </a>
          )}

          <div className="mt-10">
            <Link
              href="/funded-research"
              className="inline-flex items-center text-[16px] font-semibold text-blue no-underline hover:opacity-80"
            >
              ← All funded research
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
