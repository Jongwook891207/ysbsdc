import { ContentListHeader } from "@/components/content/ContentListHeader";
import { EmptyState } from "@/components/content/EmptyState";
import { CategoryFilter } from "@/components/content/CategoryFilter";
import { FeaturedColumns } from "@/components/content/FeaturedColumns";
import { Pagination } from "@/components/content/Pagination";
import { ColumnCard } from "@/components/cards/ColumnCard";
import type { ColumnEntry } from "@/lib/content/types";
import type { PaginationResult } from "@/lib/pagination";
import type { CategoryCount } from "@/lib/taxonomy";

/**
 * Shared presentational shell for all four column listing routes
 * (/column, /column/page/[page], /column/category/[category],
 * /column/category/[category]/page/[page]) — each route page only differs
 * in which data it fetches (columnSource.getPublished() vs
 * columnSource.getByCategory()) and which page it paginates; the actual
 * markup/layout lives here once instead of being duplicated four times.
 */
export function ColumnListingView({
  eyebrow,
  title,
  description,
  categories,
  activeCategory,
  featured,
  pagination,
  basePath,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  categories: CategoryCount[];
  activeCategory?: string;
  featured?: ColumnEntry[];
  pagination: PaginationResult<ColumnEntry>;
  basePath: string;
  emptyMessage: string;
}) {
  return (
    <div className="column-page">
      <ContentListHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="column-list-section">
        <div className="container">
          <CategoryFilter categories={categories} activeCategory={activeCategory} />

          {featured && <FeaturedColumns columns={featured} />}

          {pagination.items.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <>
              <h2 className="column-list-section-title">{activeCategory ? "전체 글" : "최신 글"}</h2>
              <div className="column-list-grid">
                {pagination.items.map((column) => (
                  <ColumnCard key={column.frontmatter.slug} column={column} />
                ))}
              </div>
              <Pagination pagination={pagination} basePath={basePath} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
