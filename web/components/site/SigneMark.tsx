/**
 * The signed "ampersand" mark that goes between WE and ME in the wordmark.
 * Three pieces:
 *   1. A black dot (the "head")
 *   2. A cobalt-blue ampersand (the "body")
 *   3. Two black triangular feet
 *
 * SVG path data is extracted from the master logo. Tone is controlled via
 * `footFill` / `dotFill` so the mark works on light and dark backgrounds.
 */
export function SigneMark({
  className,
  title = "WE&ME",
  footFill = "#050606",
  dotFill,
}: {
  className?: string;
  title?: string;
  footFill?: string;
  dotFill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="160 55 100 145"
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Dot above the ampersand */}
      <path
        fill={dotFill ?? footFill}
        d="M208.4,67c0,3.9-3.1,7-7,7s-7-3.1-7-7s3.1-7,7-7S208.4,63.1,208.4,67z"
      />
      {/* Blue ampersand */}
      <path
        fill="#2e73db"
        d="M221.4,159.3L195.1,122c-13.2,5.5-21,14.1-21,26.3c0,11.9,9.4,21.6,22.8,21.6
        C207.3,169.8,215.3,166.3,221.4,159.3z M234.5,177.6l-7.1-10c-7.8,8.1-18.2,12-31,12c-18.2,0-33-12.7-33-31.4
        c0-16.3,10.5-26.8,26.1-34.2L171,88v-9.4h59.3l-3,9.3h-43.9l43.9,62.2c3.5-7.1,5.8-16.4,7.3-27.7l9.4,5.3
        c-2,13.1-5.4,23.6-10.4,31.7l12.9,18.3H234.5z"
      />
      {/* Two triangular feet */}
      <path className="signe-foot signe-foot-r" fill={footFill} d="M231.7,193.1l25.8-0.1l-21.9-11.8L231.7,193.1z" />
      <path className="signe-foot signe-foot-l" fill={footFill} d="M166.5,193.1l25.8-0.1l-21.9-11.8L166.5,193.1z" />
    </svg>
  );
}
