import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColumnListingView } from "@/components/content/ColumnListingView";
import { columnSource, COLUMN_PAGE_SIZE } from "@/lib/content/sources/columns";
import { getCategoryCounts, MIN_PUBLIC_CATEGORY_COUNT } from "@/lib/taxonomy";
import { paginate } from "@/lib/pagination";
import { SITE_NAME } from "@/lib/seo";

/**
 * generateStaticParams uses the raw (undecoded) category string as the
 * param value — Next encodes it into the URL itself and decodes it back
 * out of params on render, so this doesn't need its own encode/decode step.
 */
export async function generateStaticParams() {
  const categories = getCategoryCounts(columnSource.getPublished());
  return categories.map((c) => ({ category: c.category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const match = getCategoryCounts(columnSource.getPublished()).find((c) => c.category === category);
  if (!match) return {};

  const title = `${category} 칼럼 - ${SITE_NAME}`;
  const description = `연세백세치과의원 원장 칼럼 중 "${category}" 카테고리 글을 모아 보여드립니다.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/column/category/${encodeURIComponent(category)}`,
    },
    // A category with too few published entries isn't a broken page — it's
    // just too thin to be worth indexing yet. See MIN_PUBLIC_CATEGORY_COUNT
    // in lib/taxonomy.ts.
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

export default async function ColumnCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const published = columnSource.getPublished();
  const categories = getCategoryCounts(published);
  const match = categories.find((c) => c.category === category);
  if (!match) notFound();

  const entries = columnSource.getByCategory(category);
  // Page 1 of a non-empty (match found ⇒ count ≥ 1) list is always valid.
  const pagination = paginate(entries, 1, COLUMN_PAGE_SIZE)!;

  return (
    <ColumnListingView
      eyebrow="카테고리"
      title={`${category} 칼럼`}
      categories={categories}
      activeCategory={category}
      pagination={pagination}
      basePath={`/column/category/${encodeURIComponent(category)}`}
      emptyMessage="아직 등록된 글이 없습니다."
    />
  );
}
