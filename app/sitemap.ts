import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { columnSource, COLUMN_PAGE_SIZE } from "@/lib/content/sources/columns";
import { authorSource } from "@/lib/content/sources/authors";
import { getIndexableCategories } from "@/lib/taxonomy";
import { FAQ_CATEGORIES } from "@/lib/faqCategories";
import type { ColumnEntry } from "@/lib/content/types";

/**
 * Stage 4-5: extended from the stage-1 static-only placeholder to include
 * real column content. Stage 5-1: added /doctor/[slug] (now a real page),
 * and fixed `lastModified` — every entry used to get `new Date()` on
 * every build/request, which claimed the entire site changed on every
 * deploy regardless of whether anything actually did. Static pages with
 * no real "last modified" data source (/, /doctor, /treatment, /mission,
 * /column hub, pagination/category listing pages — their content is
 * whatever the underlying articles are, not a dated entity itself) now
 * omit `lastModified` entirely rather than guess. Only `/column/[slug]`
 * entries get a real one, from the article's own `updatedAt ?? publishedAt`.
 *
 * Excluded on purpose:
 *  - draft columns (never in columnSource.getPublished())
 *  - /column/page/1 (not a real route — /column itself is page 1)
 *  - category pages under lib/taxonomy.ts's MIN_PUBLIC_CATEGORY_COUNT
 *    (they exist and render, but carry `robots: noindex` — a sitemap
 *    entry for a noindex page is a contradiction search engines flag)
 *  - inactive authors (authorSource entries with `active: false`,
 *    matching /doctor/[slug]'s own notFound()/noindex policy)
 *
 * No query-param or preview/admin/deployment-specific URLs exist anywhere
 * in this app to accidentally include — nothing here reads request
 * headers or `VERCEL_URL`; every URL is built from the fixed `SITE_URL`
 * constant (lib/seo.ts) plus real content slugs.
 */
function lastModifiedOf(entry: ColumnEntry): Date {
  return new Date(entry.frontmatter.updatedAt ?? entry.frontmatter.publishedAt);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/doctor", "/treatment", "/mission", "/column", "/faq", "/price"];
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  for (const author of authorSource.getAll()) {
    if (!author.frontmatter.active) continue;
    entries.push({ url: `${SITE_URL}/doctor/${author.frontmatter.slug}` });
  }

  const published = columnSource.getPublished();

  for (const column of published) {
    entries.push({
      url: `${SITE_URL}/column/${column.frontmatter.slug}`,
      lastModified: lastModifiedOf(column),
    });
  }

  const totalPages = Math.max(1, Math.ceil(published.length / COLUMN_PAGE_SIZE));
  for (let page = 2; page <= totalPages; page++) {
    entries.push({ url: `${SITE_URL}/column/page/${page}` });
  }

  // Phase 3-B: all 9 FAQ category pages are always index (they're
  // aggregate/hub pages, same policy as /column's static routes above) —
  // unlike columns, no individual /faq/[category]/[slug] URL exists yet
  // (every FAQ launches Hub-only, design doc §F/§T), so there is nothing
  // to gate by promote/MIN_PUBLIC_CATEGORY_COUNT here.
  for (const { slug } of FAQ_CATEGORIES) {
    entries.push({ url: `${SITE_URL}/faq/${slug}` });
  }

  for (const { category } of getIndexableCategories(published)) {
    const encodedCategory = encodeURIComponent(category);
    entries.push({ url: `${SITE_URL}/column/category/${encodedCategory}` });

    const categoryTotalPages = Math.max(1, Math.ceil(columnSource.getByCategory(category).length / COLUMN_PAGE_SIZE));
    for (let page = 2; page <= categoryTotalPages; page++) {
      entries.push({ url: `${SITE_URL}/column/category/${encodedCategory}/page/${page}` });
    }
  }

  return entries;
}
