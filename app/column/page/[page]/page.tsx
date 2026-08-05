import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ColumnListingView } from "@/components/content/ColumnListingView";
import { columnSource, COLUMN_PAGE_SIZE } from "@/lib/content/sources/columns";
import { getCategoryCounts } from "@/lib/taxonomy";
import { paginate, parsePageParam } from "@/lib/pagination";
import { SITE_NAME } from "@/lib/seo";

const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원 김종욱 원장이 직접 쓰는 치과 지식 칼럼. 임플란트, 틀니, 신경치료 등 진료 관련 궁금증을 알기 쉽게 설명합니다.";

/**
 * Page 2+ of the /column hub. Page 1 lives at /column itself (no
 * /column/page/1 route — a request for it redirects there instead), so
 * generateStaticParams only ever emits page 2..totalPages.
 */
export async function generateStaticParams() {
  const totalItems = columnSource.getPublished().length;
  const totalPages = Math.max(1, Math.ceil(totalItems / COLUMN_PAGE_SIZE));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page: pageParam } = await params;
  const page = parsePageParam(pageParam);
  if (!page) return {};

  const title = `원장 칼럼 ${page}페이지 - ${SITE_NAME}`;
  return {
    title,
    description: SEO_DESCRIPTION,
    alternates: {
      canonical: `/column/page/${page}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: SEO_DESCRIPTION,
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: SEO_DESCRIPTION,
    },
  };
}

export default async function ColumnListPagedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageParam } = await params;
  const page = parsePageParam(pageParam);
  if (page === null) notFound();
  if (page === 1) redirect("/column");

  const published = columnSource.getPublished();
  const pagination = paginate(published, page, COLUMN_PAGE_SIZE);
  if (!pagination) notFound();

  const categories = getCategoryCounts(published);

  return (
    <ColumnListingView
      eyebrow="콘텐츠"
      title="김종욱 원장의 치과 칼럼"
      categories={categories}
      pagination={pagination}
      basePath="/column"
      emptyMessage="아직 등록된 칼럼이 없습니다."
    />
  );
}
