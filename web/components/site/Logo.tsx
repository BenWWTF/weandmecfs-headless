import { SigneMark } from "./SigneMark";

/**
 * The full WE&ME wordmark.
 *
 * Three variants:
 *   - "stacked"  → main logo (WE/ME + signed, "Foundation" below)
 *   - "written"  → secondary (WE & ME inline + "Foundation" below)
 *   - "mark"     → just the signed, for favicons / tight spaces
 *
 * Two tones:
 *   - "light" (default) — black wordmark for light backgrounds
 *   - "dark"            — white wordmark for dark backgrounds
 *
 * The signed always stays brand blue; its feet flip with the tone.
 */
type Variant = "stacked" | "written" | "mark";
type Tone = "light" | "dark";

export function Logo({
  variant = "written",
  tone = "light",
  className,
  markClassName,
}: {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  markClassName?: string;
}) {
  const word = tone === "dark" ? "text-white" : "text-ink";
  const footFill = tone === "dark" ? "#ffffff" : "#050606";

  if (variant === "mark") {
    return (
      <SigneMark className={className} footFill={footFill} dotFill={footFill} />
    );
  }

  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col ${className ?? ""}`}>
        <span className="flex items-center gap-[0.12em]">
          <span
            className={`font-display font-medium leading-[0.86] tracking-[-0.03em] text-[1em] ${word}`}
          >
            WE
            <br />
            ME
          </span>
          <SigneMark
            className={`h-[1.9em] w-auto ${markClassName ?? ""}`}
            footFill={footFill}
            dotFill={footFill}
          />
        </span>
        <span className="mt-[0.08em] font-display font-medium leading-none tracking-[-0.03em] text-[0.62em] text-blue">
          Foundation
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col ${className ?? ""}`}>
      <span className="flex items-baseline gap-[0.04em]">
        <span className={`font-display font-medium leading-none tracking-[-0.02em] text-[1em] ${word}`}>
          WE
        </span>
        <SigneMark
          className={`h-[1.12em] w-auto self-center translate-y-[0.06em] ${markClassName ?? ""}`}
          footFill={footFill}
          dotFill={footFill}
        />
        <span className={`font-display font-medium leading-none tracking-[-0.02em] text-[1em] ${word}`}>
          ME
        </span>
      </span>
      <span className="mt-[0.12em] font-display font-medium leading-none tracking-[-0.02em] text-[0.44em] text-blue">
        Foundation
      </span>
    </span>
  );
}
