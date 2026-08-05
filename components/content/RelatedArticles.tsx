import { ColumnCard } from "@/components/cards/ColumnCard";
import type { ColumnEntry } from "@/lib/content/types";

/** Reuses stage 4-3's ColumnCard so related-article cards match the list page exactly. */
export function RelatedArticles({ columns }: { columns: ColumnEntry[] }) {
  if (columns.length === 0) return null;

  return (
    <section className="column-related-articles">
      <h2>함께 보면 좋은 글</h2>
      <div className="column-related-articles-grid">
        {columns.map((column) => (
          <ColumnCard key={column.frontmatter.slug} column={column} />
        ))}
      </div>
    </section>
  );
}
