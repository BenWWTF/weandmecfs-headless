"use client";

import { useEffect, useRef, useState } from "react";

export type ChartDatum = { label: string; value: number; suffix?: string };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const on = () => setReduced(mql.matches);
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return { ref, inView };
}

export function ArticleChart({
  data,
  caption,
  color = "#2e73db",
}: {
  data: ChartDatum[];
  caption?: string;
  color?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const max = Math.max(...data.map((d) => d.value));
  const active = reduced || inView;

  return (
    <figure ref={ref} className="my-12">
      <div className="rounded-xl border border-ink/15 bg-card p-6 sm:p-8">
        <ul className="flex flex-col gap-4">
          {data.map((d, i) => {
            const pct = (d.value / max) * 100;
            const width = active ? pct : 0;
            return (
              <li key={d.label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-ink/60">
                  {d.label}
                </span>
                <span className="relative block h-3 rounded-full bg-ink/10 overflow-hidden group">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${width}%`,
                      backgroundColor: color,
                      transition: reduced
                        ? "none"
                        : `width 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms`,
                    }}
                  />
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink text-paper px-2 py-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {d.value.toLocaleString()}{d.suffix ?? ""}
                  </span>
                </span>
                <span className="text-sm tabular-nums text-ink/80">
                  {d.value.toLocaleString()}{d.suffix ?? ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {caption && (
        <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
