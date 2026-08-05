import { ColumnCard } from "@/components/cards/ColumnCard";
import type { ColumnEntry } from "@/lib/content/types";

/**
 * Renders exactly the featured+published entries it's given — never
 * backfilled with non-featured articles to hit a target count (see the
 * callers in app/column/page.tsx / ColumnTeaserSection.tsx, which already
 * cap the list before it gets here). Zero featured entries means this
 * section simply doesn't render.
 */
export function FeaturedColumns({ columns }: { columns: ColumnEntry[] }) {
  if (columns.length === 0) return null;

  return (
    <section className="column-featured">
      <h2 className="column-featured-title">추천 칼럼</h2>
      <div className="column-featured-grid">
        {columns.map((column) => (
          <ColumnCard key={column.frontmatter.slug} column={column} />
        ))}
      </div>
    </section>
  );
}
