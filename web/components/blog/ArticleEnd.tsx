"use client";

import { useEffect, useRef, useState } from "react";
import { SigneMark } from "@/components/site/SigneMark";

/** Signature mark that walks into view once scrolled to, closing out an article. */
export function ArticleEnd() {
  const markRef = useRef<HTMLDivElement | null>(null);
  const [walk, setWalk] = useState(false);

  useEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setWalk(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-8 pb-20 text-center">
      <div ref={markRef} className={walk ? "signe-walk mx-auto w-fit" : "mx-auto w-fit"}>
        <SigneMark className="h-11 w-auto" />
      </div>
      <p className="mt-5 text-sm text-ink/55">
        Step by step. Thank you for walking with us.
      </p>
    </div>
  );
}
