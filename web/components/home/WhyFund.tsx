"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Call, Project } from "@/lib/wp";
import { decodeHtml } from "@/lib/decode";
import { formatEuro } from "@/lib/utils";
import { withBasePath } from "@/lib/basePath";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);
}

const INK = "#0a0a0a";
const RAIL_LINE = "#D9DDDB";
const MUTED = "#6B6B6B";
const NODE_LABEL = "text-[11px] uppercase tracking-[0.08em] text-[#6B6B6B]";
const NODE_STATEMENT =
  "mt-2 text-[22px] font-semibold leading-[1.2] tabular-nums text-[#0a0a0a]";
const NODE_DETAIL = "mt-2 text-[16px] leading-[1.5] text-[#0a0a0a]/80 max-w-[46ch]";
const NODE_LINK = "mt-4 inline-flex text-[16px] text-blue font-semibold no-underline";
const RULE = "border-[#0a0a0a]/12";

const AMOUNTS = [25, 50, 100];
const donateUrl = (amount: number) =>
  `https://donate.weandmecfs.org/en-us/?rnw-amount=${amount}`;

const NODES = [
  { id: "donation", label: "Your donation" },
  { id: "goes",     label: "Where it goes" },
  { id: "decides",  label: "Who decides" },
  { id: "went",     label: "Impact so far" },
  { id: "tax",      label: "Your tax return" },
] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Details({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((o) => !o);
    const ping = () => window.dispatchEvent(new Event("whyfund:remeasure"));
    ping();
    const t1 = window.setTimeout(ping, 140);
    const t2 = window.setTimeout(ping, 300);
    window.setTimeout(() => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    }, 320);
  };
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-[14px] text-[#6B6B6B]"
      >
        Details
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden
          className="transition-transform duration-250"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-250 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PartnerLogo({
  src,
  alt,
  href,
  className,
}: {
  src: string;
  alt: string;
  href: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center opacity-90 transition hover:opacity-100"
    >
      <Image
        src={src}
        alt={alt}
        width={200}
        height={60}
        unoptimized
        className={`w-auto h-auto ${className}`}
      />
    </a>
  );
}

/* Partner logos. Science for ME logo still pending — plain text stands in.
   Sources: fwf.ac.at/en/news/press/logos · wwtf.at · s4me.info */
function LogoPlaceholder({ name }: { name: string }) {
  return (
    <span className="text-[13px] text-[#0a0a0a]/55" title={`${name} logo — asset pending`}>
      {name}
    </span>
  );
}

function CountUpFourM({ reduced, total }: { reduced: boolean; total: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [text, setText] = useState("€0");

  const target = Math.max(0, total);

  useEffect(() => {
    if (reduced) {
      setText(formatEuro(target).replace(".00", "").replace("€", "€").replace(/\u00a0/g, ""));
      return;
    }
    const el = ref.current;
    if (!el) return;
    setText("€0");
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () =>
            setText(`€${Math.round(obj.v).toLocaleString("en-US")}`),
          onComplete: () =>
            setText(formatEuro(target).replace(".00", "").replace(/\u00a0/g, " ")),
        });
      },
    });
    return () => st.kill();
  }, [reduced, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

function NodeContent({
  id,
  amount,
  setAmount,
  reduced,
  projects,
  totalM,
}: {
  id: string;
  amount: number;
  setAmount: (n: number) => void;
  reduced: boolean;
  projects: Project[];
  totalM: number;
}) {
  if (id === "donation") {
    return (
      <>
        <p className={NODE_STATEMENT}>Starts here.</p>
        <div
          role="group"
          aria-label="Donation amount"
          className="mt-4 inline-flex h-[44px] gap-2"
        >
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              aria-pressed={amount === a}
              className={`h-full rounded-[8px] px-5 text-[16px] tabular-nums transition-colors ${
                amount === a
                  ? "bg-blue font-semibold text-white"
                  : "border border-[#0a0a0a] bg-white text-[#0a0a0a]"
              }`}
            >
              €{a}
            </button>
          ))}
        </div>
        <div>
          <a
            href={donateUrl(amount)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-[52px] items-center justify-center rounded-full bg-blue px-7 text-[17px] font-semibold tabular-nums text-white no-underline transition hover:opacity-90"
          >
            Give €{amount}
          </a>
        </div>
      </>
    );
  }

  if (id === "goes") {
    return (
      <>
        <p className={NODE_STATEMENT}>
          100% to research.
          <br />
          0% to WE&amp;ME overhead.
        </p>
        <p className={NODE_DETAIL}>
          The Ströck family covers all running costs of WE&amp;ME.
        </p>
        <Details>
          <p className="text-[16px] leading-[1.5] text-[#0a0a0a]/80 max-w-[46ch]">
            The Ströck family personally covers every operating cost of the
            foundation: staff, administration, accounting and legal, IT,
            communications. The family founded WE&amp;ME in 2020; two of their
            three sons, Christoph and Philipp, live with ME/CFS. Having seen how
            little research and care exist, they fund the foundation&rsquo;s
            entire operation so that every donation goes to research in full.
          </p>
        </Details>
        <Link href="/about" className={NODE_LINK}>
          Our story →
        </Link>
      </>
    );
  }

  if (id === "decides") {
    return (
      <>
        <p className={NODE_STATEMENT}>
          Rigorous process. Independent decisions.
        </p>
        <p className={NODE_DETAIL}>
          Our funding calls are run with the FWF and the WWTF. Patients sit on
          the jury of our largest calls and are involved at every step.
        </p>
        <Details>
          <p className="text-[16px] leading-[1.5] text-[#0a0a0a]/80 max-w-[46ch]">
            The FWF and the WWTF are two of Central Europe&rsquo;s most rigorous
            research funders. Decisions stay independent and are made by a jury
            of international ME/CFS researchers, patients on our team and patient
            experts from the Science for ME forum.
          </p>
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <p className={NODE_LABEL}>Process</p>
              <div className="mt-3 flex flex-nowrap items-center gap-x-6">
                <PartnerLogo
                  src={withBasePath("/brand/fwf-logo.svg")}
                  alt="FWF — Der Wissenschaftsfonds"
                  href="https://www.fwf.ac.at/en/"
                  className="h-[38px] md:h-11"
                />
                <PartnerLogo
                  src={withBasePath("/brand/wwtf-logo.svg")}
                  alt="WWTF — Vienna Science and Technology Fund"
                  href="https://wwtf.at/"
                  className="h-[26px] md:h-[30px]"
                />
              </div>
            </div>
            <div>
              <p className={NODE_LABEL}>Jury</p>
              <div className="mt-2 flex items-center gap-8">
                <LogoPlaceholder name="Science for ME" />
              </div>
            </div>
          </div>
        </Details>
        <a
          href="https://www.weandmecfs.org/projects/"
          target="_blank"
          rel="noreferrer"
          className={NODE_LINK}
        >
          How we decide →
        </a>
      </>
    );
  }

  if (id === "went") {
    return (
      <>
        <p className={NODE_STATEMENT}>
          <CountUpFourM reduced={reduced} total={totalM} /> mobilised.
          <br />
          All of it biomedical.
        </p>
        <p className={NODE_DETAIL}>A selection of three funded calls and awards.</p>
        <Details>
          <ul className={`divide-y border-t border-b ${RULE} divide-[#0a0a0a]/12`}>
            {projects.slice(0, 3).map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-6 py-4">
                <div className="min-w-0">
                  <a
                    href={p.external_url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[16px] font-semibold leading-[1.3] text-blue no-underline"
                  >
                    {decodeHtml(p.title.rendered)}
                  </a>
                  {p.institution && (
                    <p className="mt-1 text-[13px] leading-[1.5] text-[#0a0a0a]/55">
                      {p.institution}
                    </p>
                  )}
                </div>
                {p.amount != null && (
                  <span className="shrink-0 whitespace-nowrap text-right text-[14px] tabular-nums text-[#0a0a0a]">
                    {formatEuro(p.amount).replace(".00", "")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Details>
        <Link href="/research" className={NODE_LINK}>
          Our research strategy →
        </Link>
      </>
    );
  }

  return (
    <>
      <p className={NODE_STATEMENT}>
        Deductible.
        <br />
        In three countries.
      </p>
      <p className={NODE_DETAIL}>
        In Austria and Germany. U.S. donors give through Myriad USA. Large
        donors outside these regions are welcome to get in touch.
      </p>
      <a
        href="mailto:contact@weandmecfs.org"
        className={NODE_LINK}
      >
        Contact us →
      </a>
    </>
  );
}

function EndDot({
  reduced,
  active,
  className = "",
  style,
}: {
  reduced: boolean;
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (reduced || !active) return;
    const rings = ref.current?.querySelectorAll<SVGCircleElement>("[data-ring]");
    if (!rings || rings.length === 0) return;
    const tweens = Array.from(rings).map((r) =>
      gsap.fromTo(
        r,
        { attr: { r: 6 }, opacity: 0.8 },
        { attr: { r: 72 }, opacity: 0, duration: 1.8, ease: "power1.out" },
      ),
    );
    return () => tweens.forEach((t) => t.kill());
  }, [reduced, active]);

  return (
    <span
      ref={ref}
      aria-hidden
      style={style}
      className={`pointer-events-none absolute block h-2.5 w-2.5 ${className}`}
    >
      <span className="absolute inset-0 rounded-full bg-[#0a0a0a]" />
      <svg
        width="100"
        height="100"
        viewBox="-50 -50 100 100"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
      >
        {!reduced && active && (
          <circle
            data-ring
            cx="0"
            cy="0"
            r={6}
            fill="none"
            stroke="#2e73db"
            strokeWidth="1.5"
            opacity={0}
          />
        )}
      </svg>
    </span>
  );
}

export function WhyFund({ projects }: { projects: Project[] }) {
  const reduced = usePrefersReducedMotion();
  const [amount, setAmount] = useState(50);

  const root = useRef<HTMLElement | null>(null);
  const mobileSpine = useRef<SVGPathElement | null>(null);
  const mobileWrap = useRef<HTMLDivElement | null>(null);
  const mobileColumn = useRef<HTMLDivElement | null>(null);
  const [spine, setSpine] = useState({ top: 9, height: 0 });
  const [activeMobile, setActiveMobile] = useState(reduced ? 4 : -1);
  const [active, setActive] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const rippleFired = useRef(false);

  // The "mobilised" figure is a brand statement — the cumulative
  // amount WE&ME has committed to ME/CFS research — not the sum of
  // the current project list. Hardcoded at €4M (matches the live
  // weandmecfs.org figure and the CountUpFourM component name).
  // The project list itself is sourced from the `project` CPT in
  // WordPress so editors can update the actual awards without
  // touching this number.
  const TOTAL_MOBILISED = 4_000_000;
  const totalM = TOTAL_MOBILISED;

  useEffect(() => {
    const measure = () => {
      const wrap = mobileWrap.current;
      const col = mobileColumn.current;
      if (!wrap || !col) return;
      const dot = col.querySelector<HTMLElement>("[data-dot]");
      if (!dot) return;
      const base = wrap.getBoundingClientRect().top;
      const d = dot.getBoundingClientRect();
      const top = d.top - base + d.height / 2;
      const dots = col.querySelectorAll<HTMLElement>("[data-dot]");
      const lastDot = dots[dots.length - 1];
      const e = lastDot?.getBoundingClientRect();
      const bottom = e
        ? e.top - base + e.height / 2
        : col.getBoundingClientRect().bottom - base + 24;
      setSpine((prev) => {
        const next = { top, height: Math.max(0, bottom - top) };
        return Math.abs(prev.top - next.top) < 0.5 &&
          Math.abs(prev.height - next.height) < 0.5
          ? prev
          : next;
      });
      ScrollTrigger.refresh();
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 300);
    const t2 = window.setTimeout(measure, 1200);
    window.addEventListener("load", measure);
    const ro = new ResizeObserver(measure);
    if (mobileColumn.current) ro.observe(mobileColumn.current);
    if (mobileWrap.current?.parentElement) ro.observe(mobileWrap.current.parentElement);
    let ticking = false;
    const onScrollMeasure = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };
    window.addEventListener("scroll", onScrollMeasure, { passive: true });
    window.addEventListener("whyfund:remeasure", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", measure);
      window.removeEventListener("scroll", onScrollMeasure);
      window.removeEventListener("whyfund:remeasure", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const peakRef = useRef(0);
  useGSAP(
    () => {
      if (reduced) {
        if (mobileSpine.current) gsap.set(mobileSpine.current, { drawSVG: "100%" });
        setActiveMobile(4);
        setEndReached(true);
        return;
      }
      const path = mobileSpine.current;
      if (!path) return;
      gsap.set(path, { drawSVG: `${peakRef.current * 100}%` });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        end: "bottom 60%",
        scrub: true,
        onUpdate: (self) => {
          const peak = Math.max(peakRef.current, self.progress);
          peakRef.current = peak;
          gsap.set(path, { drawSVG: `${peak * 100}%` });
          const wrap = path.closest("[data-spine-wrap]") as HTMLElement | null;
          if (peak >= 0.999 && !rippleFired.current) {
            rippleFired.current = true;
            setEndReached(true);
          }
          const dots = Array.from(
            wrap?.parentElement?.querySelectorAll<HTMLElement>("[data-dot]") ?? [],
          );
          if (!wrap || dots.length === 0) return;
          const total = wrap.getBoundingClientRect().height;
          const drawn = peak * total;
          const top = wrap.getBoundingClientRect().top;
          let last = -1;
          dots.forEach((d, i) => {
            const y = d.getBoundingClientRect().top - top;
            if (y <= drawn) last = i;
          });
          setActiveMobile((prev) => Math.max(prev, last));
        },
      });
      return () => st.kill();
    },
    { scope: root, dependencies: [reduced, spine.height] },
  );

  useGSAP(
    () => {
      if (reduced) return;
      const blocks = gsap.utils.toArray<HTMLElement>("[data-node-block]");
      blocks.forEach((b) => {
        gsap.fromTo(
          b.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08,
            immediateRender: false,
            scrollTrigger: { trigger: b, start: "top 95%", once: true },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={root} className="w-full bg-white text-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1080px] px-7 pt-16 pb-16 lg:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
          At a glance
        </p>
        <h2 className="headline mt-3 text-[34px] font-semibold leading-[1] tracking-[-0.02em] lg:text-[52px]">
          Why fund WE&amp;ME?
        </h2>

        {/* Mobile / tablet */}
        <div ref={mobileWrap} className="relative mt-10 lg:hidden">
          <div
            data-spine-wrap
            aria-hidden
            className="pointer-events-none absolute left-0 w-[1px]"
            style={{ top: spine.top, height: spine.height }}
          >
            <svg
              width="1"
              height={Math.max(1, spine.height)}
              viewBox={`0 0 1 ${Math.max(1, spine.height)}`}
              className="overflow-visible"
            >
              <path
                ref={mobileSpine}
                d={`M0.5 0 V${Math.max(1, spine.height)}`}
                stroke={RAIL_LINE}
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          <EndDot
            reduced={reduced}
            active={endReached}
            className="-left-[4.5px]"
            style={{ top: spine.top + spine.height - 5 }}
          />

          <div ref={mobileColumn} className="flex flex-col gap-10 pl-[24px]">
            {NODES.map(({ id, label }, i) => (
              <div key={label} className="relative">
                <span
                  data-dot
                  aria-hidden
                  className="absolute -left-[24px] top-[4px] h-2.5 w-2.5 -translate-x-[4.5px] rounded-full bg-[#0a0a0a] transition-opacity duration-300"
                  style={{ opacity: i <= activeMobile ? 1 : 0.2 }}
                />
                <div data-node-block>
                  <p className={NODE_LABEL}>{label}</p>
                  <NodeContent
                    id={id}
                    amount={amount}
                    setAmount={setAmount}
                    reduced={reduced}
                    projects={projects}
                    totalM={totalM}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="mt-12 hidden lg:flex lg:gap-12">
          <div className="w-[40%]">
            <div className="sticky top-[120px]">
              <div className="relative pl-[26px]">
                <span
                  aria-hidden
                  className="absolute left-0 top-[8px] h-[calc(100%-16px)] w-px bg-[#D9DDDB]"
                />
                <ul className="flex flex-col gap-8">
                  {NODES.map(({ label }, i) => (
                    <li key={label} className="relative">
                      <span
                        aria-hidden
                        className="absolute -left-[26px] top-[4px] h-2.5 w-2.5 -translate-x-[4.5px] rounded-full bg-[#0a0a0a] transition-opacity duration-300"
                        style={{ opacity: active === i ? 1 : 0.3 }}
                      />
                      <span
                        className="text-[11px] uppercase tracking-[0.08em] transition-colors duration-300"
                        style={{ color: active === i ? INK : MUTED }}
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-[60%]">
            <div className="flex flex-col gap-24">
              {NODES.map(({ id, label }, i) => (
                <div
                  key={label}
                  ref={(el) => {
                    blockRefs.current[i] = el;
                  }}
                >
                  <div data-node-block>
                    <p className={NODE_LABEL}>{label}</p>
                    <NodeContent
                      id={id}
                      amount={amount}
                      setAmount={setAmount}
                      reduced={reduced}
                      projects={projects}
                      totalM={totalM}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
