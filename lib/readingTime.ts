/**
 * Korean-aware reading time (stage 4-4).
 *
 * Replaces the `reading-time` npm package's result in
 * `lib/content/loader.ts` — that package counts English words at a fixed
 * ~200 WPM, which doesn't map onto Korean text (space-separated 어절, not
 * English "words," and a very different reading cadence) and produced
 * numbers with no real basis for this site's content. The package is
 * removed from package.json since nothing else used it.
 *
 * Policy:
 *  - Strip fenced code blocks and inline code — code isn't prose.
 *  - Strip MDX/JSX tags (`<Callout ...>`, `<br />`, etc.) — component
 *    markup isn't prose either; only children text between tags counts.
 *  - Strip markdown link/image/heading/list/blockquote/emphasis syntax
 *    markers, keeping the visible text.
 *  - Count 어절 (whitespace-separated tokens) in what's left.
 *  - 분당 300어절 — a middle-of-the-road estimate for adult Korean prose
 *    reading speed (commonly cited ranges run roughly 200–400 어절/분
 *    depending on content difficulty and reader); no per-site data exists
 *    yet to tune this further.
 *  - Round up, minimum 1 minute (a very short piece still reads as "약
 *    1분," never "0분").
 *
 * Known limitations (regex-based, not a real MDX/JSX parser — same
 * category of limitation as lib/content/mdxGuards.ts's H1 guard):
 *  - JSX tag stripping is a blunt `<[^>]+>` removal. A prop value that
 *    itself contains ">" (rare, but possible inside a JSX expression like
 *    `items={[">"]}`) could truncate a tag match early. Not a concern for
 *    this project's current MDX component set.
 *  - 어절 count is a proxy for reading load, not a linguistically precise
 *    measure — particle-heavy short 어절 and long compound-noun 어절 are
 *    counted the same.
 *  - Doesn't account for extra time spent on images/tables/code the
 *    reader skims rather than reads word-for-word.
 */

const KOREAN_WORDS_PER_MINUTE = 300;

function stripNonProseContent(mdxBody: string): string {
  let text = mdxBody;

  // Fenced code blocks.
  text = text.replace(/```[\s\S]*?```/g, " ");
  // Inline code.
  text = text.replace(/`[^`]*`/g, " ");
  // JSX/HTML tags (components, <br/>, etc.) — best-effort, see limitations above.
  text = text.replace(/<[^>]+>/g, " ");
  // Markdown images/links — keep the visible label, drop the syntax/URL.
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Heading/list/blockquote markers at line start.
  text = text.replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "");
  // Emphasis/strikethrough markers.
  text = text.replace(/[*_~]{1,3}/g, "");

  return text;
}

/** Estimates reading time in whole minutes (minimum 1) from a raw MDX body (frontmatter already stripped by the caller). */
export function estimateReadingTimeMinutes(mdxBody: string): number {
  const prose = stripNonProseContent(mdxBody);
  const wordCount = prose.trim().split(/\s+/).filter(Boolean).length;
  const minutes = wordCount / KOREAN_WORDS_PER_MINUTE;
  return Math.max(1, Math.ceil(minutes));
}
