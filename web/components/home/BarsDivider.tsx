"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/basePath";

// The "Step by step" walker animation, downloaded from the Lovable
// CDN during the rebuild. The mockup uses this as a single self-
// contained webm that scrubs with scroll position.
const BARS_VIDEO = withBasePath("/videos/divider-bars.webm");

/**
 * "Step by step" — the figure walks along a baseline as the user scrolls.
 *
 * Implementation:
 *   - One invisible <video> sets the stage height (natural aspect ratio).
 *   - One visible <video> is positioned absolutely. We translate it
 *     horizontally on every scroll frame by writing `style.transform`
 *     directly via a ref — no React state, so no per-frame re-render
 *     and no jank.
 *   - On mobile (or prefers-reduced-motion) we skip the per-frame
 *     update and freeze the walker at 50% so the section is still
 *     visible but the page doesn't hitch.
 */
export function BarsDivider() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const walkerRef = useRef<HTMLDivElement | null>(null);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    const mqMobile = window.matchMedia("(max-width: 767px)");
    const onMobile = () => setIsMobile(mqMobile.matches);
    onMobile();
    mqMobile.addEventListener("change", onMobile);

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      const walker = walkerRef.current;
      if (!el || !walker) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const p = (window.innerHeight - rect.top) / total;
      const clamped = Math.min(1, Math.max(0, p));
      // Mutate the transform directly — no React re-render.
      walker.style.transform = `translateX(calc(${(clamped * 100).toFixed(2)}% - 50%))`;
    };
    const onScroll = () => {
      if (isMobile || reduced) return;
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", onChange);
      mqMobile.removeEventListener("change", onMobile);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isMobile, reduced]);

  // On mobile / reduced-motion, the walker stays at 50% via the inline
  // style below. On desktop, the rAF callback above rewrites the
  // transform every frame.
  const staticTransform = reduced || isMobile
    ? "translateX(calc(50% - 50%))"
    : "translateX(calc(0% - 50%))";

  return (
    <section ref={sectionRef} className="bg-empathy text-ink">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12 md:grid md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
              Step by step
            </p>
            <h2 className="headline mt-3 text-[34px] md:text-[52px] leading-[1] tracking-[-0.01em]">
              No shortcuts.
              <br />
              Together,
              <br />
              step by step.
            </h2>
            <p className="mt-5 max-w-[34ch] text-[17px] leading-[1.45] text-ink/85">
              Every call we fund and every lab we bring in is one step. We keep
              going.
            </p>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="relative mt-8 overflow-hidden md:mt-0">
            {/* invisible spacer for the stage height */}
            <video
              src={BARS_VIDEO}
              aria-hidden
              muted
              playsInline
              preload="none"
              className="invisible block h-auto w-[312px] md:w-[429px]"
            />
            <div className="absolute inset-x-0 bottom-0 h-px bg-ink/20" />
            <div
              ref={walkerRef}
              className="absolute bottom-px w-[250px] md:w-[343px]"
              style={{ transform: staticTransform, willChange: "transform" }}
            >
              <video
                src={BARS_VIDEO}
                aria-hidden
                autoPlay={!isMobile && !reduced}
                loop={!isMobile && !reduced}
                muted
                playsInline
                preload={isMobile ? "none" : "metadata"}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
