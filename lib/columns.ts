import type { Column, ColumnListFilters, ColumnSlug, PaginatedResult } from "./types";

/**
 * Data access layer for columns.
 *
 * Stage 1: signatures only, so every page/component built in stages 2-3 can
 * import against a stable contract. Stage 4 implements these against
 * /content/columns/*.mdx (gray-matter for frontmatter + reading-time).
 *
 * Parameters are prefixed with `_` and unused for now — that's intentional:
 * the signature is the stage-1 deliverable, the body is stage 4's. Once
 * stage 4 implements each function, drop the `_` prefix as each parameter
 * starts being read.
 *
 * IMPORTANT for the future Sanity migration: nothing outside this file
 * should ever touch the filesystem or parse frontmatter directly — every
 * caller (pages, sitemap, RSS, related-columns) goes through these
 * functions. Swapping to Sanity later means rewriting only this file's
 * function bodies; the exported signatures below should not need to change.
 */

export async function getAllColumns(): Promise<Column[]> {
  throw new Error("Not implemented until stage 4 (MDX loader).");
}

export async function getPublishedColumns(
  _filters: ColumnListFilters = {},
): Promise<PaginatedResult<Column>> {
  throw new Error("Not implemented until stage 4 (MDX loader).");
}

export async function getColumnBySlug(_slug: ColumnSlug): Promise<Column | null> {
  throw new Error("Not implemented until stage 4 (MDX loader).");
}

export async function getAdjacentColumns(
  _slug: ColumnSlug,
): Promise<{ previous: Column | null; next: Column | null }> {
  throw new Error("Not implemented until stage 4 (MDX loader).");
}

export async function getRelatedColumns(
  _slug: ColumnSlug,
  _limit = 3,
): Promise<Column[]> {
  throw new Error("Not implemented until stage 4 (MDX loader).");
}

export async function getAllColumnSlugs(): Promise<ColumnSlug[]> {
  throw new Error("Not implemented until stage 4 (MDX loader).");
}
