import type { ColumnEntry } from "@/lib/content/types";

/**
 * Category/tag aggregation for the column hub (stage 4-5). Pure functions
 * over an already-loaded entry array (callers pass `columnSource.getPublished()`
 * — nothing here reads the filesystem or re-parses frontmatter, same
 * discipline as lib/related.ts).
 *
 * Slug policy: `frontmatter.category`/`tags[]` values ARE the URL slugs —
 * no separate slug<->label mapping table. Every real category value in
 * this project today is already a lowercase-hyphen word ("implant",
 * "denture", "general", ...), and the schema doesn't forbid a Korean
 * category if an author ever writes one — either way, `encodeURIComponent`
 * on write and Next's automatic dynamic-segment decoding on read handle it
 * correctly with zero extra mapping. Building a slug<->label table now
 * would be speculative complexity for a distinction (slug != display name)
 * that doesn't exist in this content yet — exactly what stage 4-5's brief
 * asked not to do.
 */
export const MIN_PUBLIC_CATEGORY_COUNT = 3;

export interface CategoryCount {
  category: string;
  count: number;
}

/** Counts published entries per category, most-populous first (category name as tiebreaker). */
export function getCategoryCounts(entries: ColumnEntry[]): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const { category } = entry.frontmatter;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "ko"));
}

/**
 * Categories with enough published entries to justify an indexable page —
 * see the `robots.index` policy in app/column/category/[category]/page.tsx
 * for why 1-2-entry categories still get a page (just noindex) instead of
 * being skipped outright.
 */
export function getIndexableCategories(entries: ColumnEntry[]): CategoryCount[] {
  return getCategoryCounts(entries).filter((c) => c.count >= MIN_PUBLIC_CATEGORY_COUNT);
}

/**
 * Decodes a `[category]` dynamic-route param before comparing it against
 * `getCategoryCounts()`/`getByCategory()` values.
 *
 * Confirmed via a local build trace (Next 15.5.22, App Router): for a
 * non-ASCII category, `generateStaticParams` returns the raw string (e.g.
 * "임플란트"), but at prerender time `params.category` arrives as the
 * *still percent-encoded* form ("%EC%9E%84%ED%94%8C%EB%9E%80%ED%8A%B8")
 * instead of the decoded string. A direct `params.category === category`
 * comparison against the raw frontmatter value then always fails for
 * every non-ASCII category, and Next bakes a 404 into the static page at
 * build time — reproduced locally, not a Vercel-only quirk. (The stale
 * assumption this replaces — "Next decodes params back out for us" — used
 * to live as a comment on the category page; it was wrong.)
 *
 * Falls back to the raw string if decoding throws, so a genuinely
 * malformed segment still 404s through the normal "no match found" path
 * instead of throwing here.
 */
export function decodeCategoryParam(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export interface TagCount {
  tag: string;
  count: number;
}

/**
 * Counts published entries per tag. Not wired to any route yet — tag
 * detail pages are deferred to a future stage (see stage 4-5 notes); this
 * exists so TagList/future taxonomy UI has real counts to work from
 * without re-deriving them ad hoc.
 */
export function getTagCounts(entries: ColumnEntry[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.frontmatter.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
}
