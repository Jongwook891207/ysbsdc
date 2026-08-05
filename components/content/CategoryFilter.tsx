import Link from "next/link";
import type { CategoryCount } from "@/lib/taxonomy";

/**
 * Every category is linked, including ones under lib/taxonomy.ts's
 * MIN_PUBLIC_CATEGORY_COUNT threshold — those pages still render (just
 * `robots: noindex`, see app/column/category/[category]/page.tsx), so
 * this never points at a 404.
 */
export function CategoryFilter({
  categories,
  activeCategory,
}: {
  categories: CategoryCount[];
  activeCategory?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav className="column-category-filter" aria-label="카테고리">
      <ul>
        <li>
          <Link href="/column" aria-current={activeCategory === undefined ? "page" : undefined}>
            전체
          </Link>
        </li>
        {categories.map(({ category, count }) => (
          <li key={category}>
            <Link
              href={`/column/category/${encodeURIComponent(category)}`}
              aria-current={activeCategory === category ? "page" : undefined}
            >
              {category} <span className="column-category-count">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
