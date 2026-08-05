import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { EmptyState } from "@/components/content/EmptyState";
import { CategoryFilter } from "@/components/content/CategoryFilter";
import { FeaturedColumns } from "@/components/content/FeaturedColumns";
import { Pagination } from "@/components/content/Pagination";
import { ColumnCard } from "@/components/cards/ColumnCard";
import type { ColumnEntry } from "@/lib/content/types";
import type { PaginationResult } from "@/lib/pagination";
import type { CategoryCount } from "@/lib/taxonomy";
import type { BreadcrumbItem } from "@/lib/types";

/**
 * Shared presentational shell for all four column listing routes
 * (/column, /column/page/[page], /column/category/[category],
 * /column/category/[category]/page/[page]) — each route page only differs
 * in which data it fetches (columnSource.getPublished() vs
 * columnSource.getByCategory()) and which page it paginates; the actual
 * markup/layout lives here once instead of being duplicated four times.
 *
 * `breadcrumbItems` is optional and only passed by the category routes
 * (stage 4-6) — /column itself is the top of this section's hierarchy, so
 * a "홈 > 원장 칼럼" trail there would just repeat the page's own H1 with
 * no added orientation value, and /column is in the stage's explicit
 * no-layout-change protected list. Category pages have no such
 * restriction and benefit from showing where "{category} 칼럼" sits
 * relative to the hub.
 */
export function ColumnListingView({
  eyebrow,
  title,
  description,
  breadcrumbItems,
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
  breadcrumbItems?: BreadcrumbItem[];
  categories: CategoryCount[];
  activeCategory?: string;
  featured?: ColumnEntry[];
  pagination: PaginationResult<ColumnEntry>;
  basePath: string;
  emptyMessage: string;
}) {
  return (
    <div className="column-page">
      {breadcrumbItems && (
        <div className="container">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}
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
