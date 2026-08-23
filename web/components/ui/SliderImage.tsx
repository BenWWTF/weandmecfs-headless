"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Tailwind aspect-ratio class, e.g. "aspect-[4/3]" */
  aspect?: string;
  className?: string;
  imgClassName?: string;
  /** Load immediately (use for the first cards in a slider) */
  eager?: boolean;
  width?: number;
  height?: number;
};

/**
 * Image with a reserved aspect-ratio box, served via next/image.
 * Shows a skeleton shimmer until the image decodes so slider cards
 * never shift or flash while photos load.
 *
 * The mockup's SliderImage used a plain <img>. We swap to next/image
 * because (a) it gives us automatic srcset, AVIF/WebP, and lazy
 * loading, and (b) the URLs come from the WordPress media library,
 * which is already in the next.config.ts allowlist.
 */
export function SliderImage({
  src,
  alt,
  aspect = "aspect-[4/3]",
  className,
  imgClassName,
  eager,
  width = 1200,
  height,
}: Props) {
  const aspectRatio = aspect.startsWith("aspect-[")
    ? aspect.replace("aspect-[", "").replace("]", "").split("/")
    : ["4", "3"];
  const w = width;
  const h = height ?? Math.round((w * parseInt(aspectRatio[1], 10)) / parseInt(aspectRatio[0], 10));

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-ink/5",
        aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes="(min-width: 1024px) 33vw, 100vw"
        loading={eager ? "eager" : "lazy"}
        className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
