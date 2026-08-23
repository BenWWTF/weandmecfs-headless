"use client";

import { useEffect, useState } from "react";

/**
 * Floating "back to top" button that fades in once the user has
 * scrolled past one viewport. Replaces the behaviour the user used
 * to get from the dropdown nav (no real native browser back-to-top
 * on long pages).
 *
 * The scroll handler is rAF-throttled and only calls setState when
 * the visibility actually flips, so it never causes a re-render on
 * the frames where nothing changes (which is most of them).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const shouldShow = window.scrollY > window.innerHeight;
      setVisible((prev) => (prev === shouldShow ? prev : shouldShow));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={
        "fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper transition-opacity duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:brightness-110 " +
        (visible ? "opacity-100" : "opacity-0 pointer-events-none")
      }
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
