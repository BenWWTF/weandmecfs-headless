"use client";

import { useEffect, useRef } from "react";

/**
 * A 3 px progress bar pinned to the top of the viewport that fills
 * left-to-right as the user scrolls through long-form content.
 *
 * Implementation note: we update the bar's width directly via a ref
 * inside a single rAF-throttled scroll handler instead of holding the
 * progress in React state. A stateful version re-renders the whole
 * component on every scroll frame, which on a slow mobile contributes
 * to a janky scroll. The bar's `transition: width 75ms` keeps the
 * movement smooth.
 */
export function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const pct = Math.max(0, Math.min(1, scrollTop / max));
      if (fillRef.current) {
        fillRef.current.style.width = `${pct * 100}%`;
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent pointer-events-none"
    >
      <div
        ref={fillRef}
        className="h-full bg-blue transition-[width] duration-75 ease-out"
        style={{ width: "0%" }}
      />
    </div>
  );
}
