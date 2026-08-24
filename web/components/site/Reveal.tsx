"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Element tag to render, defaults to a div */
  as?: "div" | "ol" | "ul";
};

/**
 * Page section reveal: direct children fade in and rise 12px,
 * staggered 0.08s, once, triggered at "top 95%".
 * Respects prefers-reduced-motion (content simply stays visible).
 */
export function Reveal({ children, className, as = "div" }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      gsap.fromTo(
        root.current.children,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.08,
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        },
      );
    },
    { dependencies: [reduced] },
  );

  const Tag = as as React.ElementType;
  return (
    <Tag ref={root} className={cn(className)}>
      {children}
    </Tag>
  );
}
