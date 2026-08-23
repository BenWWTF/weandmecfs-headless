/**
 * Tiny helper for the few places we need to inline a WP-rendered string
 * (titles, bio). The WordPress REST API returns HTML-escaped strings
 * (e.g. `Akiko&#038;ME`). `decodeHtml` reverses that for the cases where
 * we don't want to dangerouslySetInnerHTML the value.
 */
export function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#038;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}
