/**
 * WE&ME spot illustration: a walking figure built from stacked circles and
 * semicircles in flat brand colors, standing on two black triangular feet,
 * with a small black dot floating above. Two composition variants.
 */

type Variant = "a" | "b";

const BRAND = {
  sage: "#abd4ba",
  blue: "#2e73db",
  lime: "#ceef0a",
  beige: "#ccba96",
  ink: "#0e1a10",
};

export function SpotFigure({
  variant = "a",
  className,
  title = "WE&ME illustration",
}: {
  variant?: Variant;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 160"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* floating dot */}
      <circle cx="60" cy="10" r="3.2" fill={BRAND.ink} />

      {variant === "a" ? (
        <g>
          {/* body: stacked shapes */}
          <circle cx="60" cy="52" r="26" fill={BRAND.sage} />
          {/* upper semicircle (flat side down) */}
          <path d="M36 52 A24 24 0 0 1 84 52 Z" fill={BRAND.blue} />
          {/* small accent circle */}
          <circle cx="60" cy="40" r="7" fill={BRAND.lime} />
          {/* lower band */}
          <rect x="38" y="82" width="44" height="16" rx="8" fill={BRAND.beige} />
          {/* neck / stem */}
          <rect x="56" y="98" width="8" height="24" fill={BRAND.ink} />
        </g>
      ) : (
        <g>
          {/* lower large circle */}
          <circle cx="60" cy="70" r="30" fill={BRAND.beige} />
          {/* upper semicircle (flat side up) */}
          <path d="M36 70 A24 24 0 0 0 84 70 Z" fill={BRAND.sage} />
          {/* small blue circle head */}
          <circle cx="60" cy="34" r="10" fill={BRAND.blue} />
          {/* lime dot accent */}
          <circle cx="72" cy="70" r="5" fill={BRAND.lime} />
          {/* stem */}
          <rect x="56" y="100" width="8" height="22" fill={BRAND.ink} />
        </g>
      )}

      {/* two triangular feet */}
      <polygon points="46,122 58,122 52,140" fill={BRAND.ink} />
      <polygon points="62,122 74,122 68,140" fill={BRAND.ink} />
    </svg>
  );
}
