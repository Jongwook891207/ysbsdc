import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ColumnListingView } from "@/components/content/ColumnListingView";
import { JsonLd } from "@/components/seo/JsonLd";
import { columnSource, COLUMN_PAGE_SIZE } from "@/lib/content/sources/columns";
import { decodeCategoryParam, getCategoryCounts, MIN_PUBLIC_CATEGORY_COUNT } from "@/lib/taxonomy";
import { paginate, parsePageParam } from "@/lib/pagination";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildColumnCollectionJsonLd, buildGraph } from "@/lib/jsonld";

/**
 * Page 2+ within a single category. With the current, small content set
 * no category has enough published entries to need a second page yet, so
 * this legitimately returns an empty array today — the structure is ready
 * for when a category grows past COLUMN_PAGE_SIZE.
 */
export async function generateStaticParams() {
  const published = columnSource.getPublished();
  const categories = getCategoryCounts(published);
  const params: { category: string; page: string }[] = [];

  for (const { category } of categories) {
    const totalItems = columnSource.getByCategory(category).length;
    const totalPages = Math.max(1, Math.ceil(totalItems / COLUMN_PAGE_SIZE));
    for (let page = 2; page <= totalPages; page++) {
      params.push({ category, page: String(page) });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category: rawCategory, page: pageParam } = await params;
  const category = decodeCategoryParam(rawCategory);
  const page = parsePageParam(pageParam);
  if (!page) return {};

  const match = getCategoryCounts(columnSource.getPublished()).find((c) => c.category === category);
  if (!match) return {};

  const title = `${category} 칼럼 ${page}페이지`;
  const description = `연세백세치과의원 원장 칼럼 중 "${category}" 카테고리 ${page}번째 페이지입니다.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/column/category/${encodeURIComponent(category)}/page/${page}`,
    },
    robots: {
      index: match.count >= MIN_PUBLIC_CATEGORY_COUNT,
      follow: true,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ColumnCategoryPagedPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category: rawCategory, page: pageParam } = await params;
  const category = decodeCategoryParam(rawCategory);
  const page = parsePageParam(pageParam);
  if (page === null) notFound();
  if (page === 1) redirect(`/column/category/${encodeURIComponent(category)}`);

  const published = columnSource.getPublished();
  const categories = getCategoryCounts(published);
  const match = categories.find((c) => c.category === category);
  if (!match) notFound();

  const entries = columnSource.getByCategory(category);
  const pagination = paginate(entries, page, COLUMN_PAGE_SIZE);
  if (!pagination) notFound();

  const canonicalUrl = absoluteUrl(`/column/category/${encodeURIComponent(category)}/page/${page}`);
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "원장 칼럼", href: "/column" },
    { label: `${category} 칼럼`, href: `/column/category/${encodeURIComponent(category)}` },
  ];
  const collection = buildColumnCollectionJsonLd({
    canonicalUrl,
    name: `${category} 칼럼 ${page}페이지`,
    columns: pagination.items.map((c) => c.frontmatter),
  });
  const graph = buildGraph(
    [buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl), collection].filter(
      (entity): entity is Record<string, unknown> => entity !== null,
    ),
  );

  return (
    <>
      <JsonLd data={graph} />
      <ColumnListingView
        eyebrow="카테고리"
        title={`${category} 칼럼`}
        breadcrumbItems={breadcrumbItems}
        categories={categories}
        activeCategory={category}
        pagination={pagination}
        basePath={`/column/category/${encodeURIComponent(category)}`}
        emptyMessage="아직 등록된 글이 없습니다."
      />
    </>
  );
}
