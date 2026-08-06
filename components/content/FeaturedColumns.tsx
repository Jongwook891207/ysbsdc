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
      <h2 className="column-featured-title" data-aos="fade-up">
        추천 칼럼
      </h2>
      <div className="column-featured-grid">
        {columns.map((column, index) => (
          // Wrapper carries the reveal animation instead of ColumnCard's own
          // root element — .column-list-card already owns `transform` for
          // its hover effect, and stacking [data-aos]'s own transform/
          // transition on the same element would make hover inherit the
          // reveal's 0.7s transition (via higher selector specificity) once
          // revealed. Keeping data-aos on this wrapper avoids that entirely.
          <div key={column.frontmatter.slug} data-aos="fade-up" data-aos-delay={Math.min(index, 4) * 80}>
            <ColumnCard column={column} />
          </div>
        ))}
      </div>
    </section>
  );
}
