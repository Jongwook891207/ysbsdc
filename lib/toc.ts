/**
 * Table-of-contents extraction (stage 4-4).
 *
 * Regex-based static scan of the raw MDX body — same category of approach
 * as lib/content/mdxGuards.ts's H1 guard, and for the same reason: no MDX
 * AST is available at this point in the pipeline (extractToc() runs on the
 * plain string before MDXRemote compiles it). H1 is excluded by
 * construction: mdxGuards.ts already rejects any H1 at content-load time,
 * so only H2/H3 ever legitimately appear in a body this function sees.
 *
 * Heading ids generated here MUST correspond 1:1, in document order, with
 * the ids ArticleBody.tsx's heading components assign to the *rendered*
 * h2/h3 elements — see components/content/mdx/createHeadingComponents.tsx.
 * That correspondence is positional (the Nth TocItem here pairs with the
 * Nth h2-or-h3 MDXRemote renders), not re-derived by slugifying the
 * rendered text a second time — two independent slugify passes could
 * drift apart (e.g. over inline formatting); one array walked twice in
 * the same order can't.
 */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const CODE_FENCE_PATTERN = /^\s*```/;
const H2_PATTERN = /^##(?!#)\s+(.+)$/;
const H3_PATTERN = /^###(?!#)\s+(.+)$/;

/** Strips inline markdown syntax (emphasis/code/links) so heading text reads as plain text in the TOC. Exported for lib/extractShortAnswer.ts, which needs the same stripping for a paragraph instead of a heading. */
export function toPlainText(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

/** Kebab-ish id, Unicode-letter-aware so Korean headings don't slugify to an empty string. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extracts H2/H3 headings (only, in document order) with stable, unique ids. */
export function extractToc(mdxBody: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of mdxBody.split(/\r?\n/)) {
    if (CODE_FENCE_PATTERN.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const h2Match = H2_PATTERN.exec(line);
    const h3Match = !h2Match ? H3_PATTERN.exec(line) : null;
    const match = h2Match ?? h3Match;
    if (!match) continue;

    const level: 2 | 3 = h2Match ? 2 : 3;
    const rawHeading = match[1];
    if (!rawHeading) continue;
    const text = toPlainText(rawHeading);
    if (!text) continue;

    const base = slugify(text) || `section-${items.length + 1}`;
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);
    const id = occurrence === 0 ? base : `${base}-${occurrence + 1}`;

    items.push({ id, text, level });
  }

  return items;
}
