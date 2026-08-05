import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { columnSource, COLUMN_PAGE_SIZE } from "@/lib/content/sources/columns";
import { getIndexableCategories } from "@/lib/taxonomy";
import type { ColumnEntry } from "@/lib/content/types";

/**
 * Stage 4-5: extended from the stage-1 static-only placeholder to include
 * real column content. Deliberately still doesn't include /doctor/[slug] —
 * that route isn't part of this stage's scope (only /column's hub is).
 *
 * Excluded on purpose:
 *  - draft columns (never in columnSource.getPublished())
 *  - /column/page/1 (not a real route — /column itself is page 1)
 *  - category pages under lib/taxonomy.ts's MIN_PUBLIC_CATEGORY_COUNT
 *    (they exist and render, but carry `robots: noindex` — a sitemap
 *    entry for a noindex page is a contradiction search engines flag)
 */
function lastModifiedOf(entry: ColumnEntry): Date {
  return new Date(entry.frontmatter.updatedAt ?? entry.frontmatter.publishedAt);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/doctor", "/treatment", "/mission", "/column"];
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));

  const published = columnSource.getPublished();

  for (const column of published) {
    entries.push({
      url: `${SITE_URL}/column/${column.frontmatter.slug}`,
      lastModified: lastModifiedOf(column),
    });
  }

  const totalPages = Math.max(1, Math.ceil(published.length / COLUMN_PAGE_SIZE));
  for (let page = 2; page <= totalPages; page++) {
    entries.push({ url: `${SITE_URL}/column/page/${page}`, lastModified: now });
  }

  for (const { category } of getIndexableCategories(published)) {
    const encodedCategory = encodeURIComponent(category);
    entries.push({ url: `${SITE_URL}/column/category/${encodedCategory}`, lastModified: now });

    const categoryTotalPages = Math.max(1, Math.ceil(columnSource.getByCategory(category).length / COLUMN_PAGE_SIZE));
    for (let page = 2; page <= categoryTotalPages; page++) {
      entries.push({ url: `${SITE_URL}/column/category/${encodedCategory}/page/${page}`, lastModified: now });
    }
  }

  return entries;
}
