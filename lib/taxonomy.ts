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
