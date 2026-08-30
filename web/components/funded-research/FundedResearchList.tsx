"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { formatEuro } from "@/lib/utils";

const INSTRUMENTS = [
  "WE&ME Projects Call",
  "Emerging Leader Award",
  "Consolidation Call",
  "Fellowships",
  "Partnership",
];

const STATUSES: NonNullable<Project["status"]>[] = ["running", "completed", "upcoming"];

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  running: "Running",
  completed: "Completed",
  upcoming: "Upcoming",
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-ink/20 text-ink hover:border-ink/45"
      }`}
    >
      {label}
    </button>
  );
}

export function FundedResearchList({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [instrument, setInstrument] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (instrument && p.instrument !== instrument) return false;
      if (status && p.status !== status) return false;
      if (!q) return true;
      const haystack = [
        decodeHtml(p.title.rendered),
        p.pi ?? "",
        p.institution ?? "",
        ...(p.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, instrument, status]);

  return (
    <div className="mt-8">
      <label htmlFor="fr-search" className="sr-only">
        Search funded research
      </label>
      <input
        id="fr-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, PI, institution, keyword"
        className="w-full rounded-full border border-ink/20 bg-white px-5 py-3 text-[16px] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {INSTRUMENTS.map((i) => (
          <Chip
            key={i}
            label={i}
            active={instrument === i}
            onClick={() => setInstrument(instrument === i ? null : i)}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Chip
            key={s}
            label={STATUS_LABEL[s]}
            active={status === s}
            onClick={() => setStatus(status === s ? null : s)}
          />
        ))}
      </div>

      {results.length === 0 ? (
        <p className="mt-10 text-[17px] leading-[1.45] text-ink/85">
          No projects match.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-ink/15 border-t border-b border-ink/15">
          {results.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-6 py-5 md:py-6"
            >
              <div className="min-w-0">
                <Link
                  href={`/funded-research/${p.slug}`}
                  className="text-[17px] font-bold leading-[1.35] text-ink hover:text-blue transition-colors"
                >
                  {decodeHtml(p.title.rendered)}
                </Link>
                <p className="mt-1 text-[13px] leading-[1.5] text-ink/55">
                  {[p.instrument, p.year != null ? String(p.year) : null, p.pi, p.institution]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-right text-[14px] tabular-nums text-ink">
                {p.amount != null ? formatEuro(p.amount).replace(".00", "") : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
