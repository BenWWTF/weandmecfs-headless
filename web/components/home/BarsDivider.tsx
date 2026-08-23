"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/basePath";

// The "Step by step" walker animation, downloaded from the Lovable
// CDN during the rebuild. The mockup uses this as a single self-
// contained webm that scrubs with scroll position.
const BARS_VIDEO = withBasePath("/videos/divider-bars.webm");

/**
 * "Step by step" — the figure walks along a baseline as the user scrolls.
 * In the mockup this is a video that scrubs with scroll position. We
 * reproduce the same effect by:
 *   1. Loading a static invisible <video> just to learn the natural
 *      aspect ratio of the asset, so the layout reserves the right
 *      height before the video is in view.
 *   2. Absolutely positioning the visible video and translating it
 *      horizontally on scroll so it tracks the baseline.
 *
 * The asset is hosted on the live weandmecfs.org for now — once the
 * team uploads it to the local WP install the URL flips to the same
 * host as the site.
 */
export function BarsDivider() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const p = (window.innerHeight - rect.top) / total;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const walk = reduced ? 0.333 : progress;

  return (
    <section ref={sectionRef} className="bg-empathy text-ink">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12 md:grid md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
              Step by step
            </p>
            <h2 className="headline mt-3 text-[34px] md:text-[52px] font-semibold leading-[1] tracking-[-0.01em] uppercase">
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
              preload="metadata"
              className="invisible block h-auto w-[312px] md:w-[429px]"
            />
            <div className="absolute inset-x-0 bottom-0 h-px bg-ink/20" />
            <div
              className="absolute bottom-px w-[250px] md:w-[343px]"
              style={{
                left: `${walk * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              <video
                src={BARS_VIDEO}
                aria-hidden
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
