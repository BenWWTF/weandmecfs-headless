import type { ReactNode } from "react";

/**
 * Desktop-only two-column split: sticky heading column on the left,
 * body column on the right. On mobile it renders two plain stacked
 * blocks, so mobile output is unchanged.
 */
export function Split({
  left,
  children,
  className = "",
  sticky = true,
}: {
  left: ReactNode;
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <div className={`lg:grid lg:grid-cols-12 lg:gap-x-16 ${className}`}>
      <div
        className={`lg:col-span-4 lg:col-start-1 ${
          sticky ? "lg:sticky lg:top-24 lg:self-start" : ""
        }`}
      >
        {left}
      </div>
      <div className="lg:col-span-7 lg:col-start-6">{children}</div>
    </div>
  );
}
