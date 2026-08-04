import type { Column, Doctor } from "@/lib/types";
import { ColumnCard } from "./ColumnCard";

/**
 * Stage 1: placeholder. Stage 4 wires this to
 * lib/columns.ts#getRelatedColumns(slug) (same category first, then same
 * author, newest first) — used at the bottom of /column/[slug] for internal
 * linking / AEO topical clustering.
 */
export function RelatedColumns({
  columns,
  authorsBySlug,
}: {
  columns: Column[];
  authorsBySlug: Record<string, Doctor>;
}) {
  if (columns.length === 0) return null;

  return (
    <aside aria-label="관련 컬럼">
      <h2>관련 컬럼</h2>
      {columns.map((column) => {
        const author = authorsBySlug[column.author];
        return author ? (
          <ColumnCard key={column.slug} column={column} author={author} />
        ) : null;
      })}
    </aside>
  );
}
