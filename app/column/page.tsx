import type { Metadata } from "next";
import { ColumnListingView } from "@/components/content/ColumnListingView";
import { JsonLd } from "@/components/seo/JsonLd";
import { columnSource, COLUMN_PAGE_SIZE } from "@/lib/content/sources/columns";
import { getCategoryCounts } from "@/lib/taxonomy";
import { paginate } from "@/lib/pagination";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { buildColumnCollectionJsonLd, buildGraph } from "@/lib/jsonld";

const SEO_TITLE = "원장 칼럼";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원 김종욱 원장이 직접 쓰는 치과 지식 칼럼. 임플란트, 틀니, 신경치료 등 진료 관련 궁금증을 알기 쉽게 설명합니다.";
// No dedicated photo for this list page (same situation as /treatment,
// /mission) — reusing the same existing clinic photo those pages use for
// OG rather than referencing a file that doesn't exist.
const OG_IMAGE = "/images/consult.png";
const MAX_FEATURED = 3;

/**
 * Stage 4-3: real column list, built on stage 4-1's columnSource. Stage
 * 4-5: page 1 of the paginated hub — /column/page/[page] handles page 2+
 * (this route stays page 1 rather than redirecting into itself, matching
 * the "/column/page/1 doesn't exist" URL policy — /column IS page 1).
 *
 * Stage 5-1: CollectionPage/ItemList added (see lib/jsonld.ts's
 * buildColumnCollectionJsonLd) — built from exactly the entries this page
 * shows (this page's `pagination.items`), never a re-fetch. No
 * BreadcrumbList here — see the stage 4-6 note on ColumnListingView for
 * why /column itself (unlike its category pages) doesn't render a visible
 * Breadcrumb, and this stage requires JSON-LD to match the visible trail.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    // Resolves against metadataBase (app/layout.tsx) to the same absolute
    // URL as every other page's canonical in this project — see the
    // stage 4-3 report for why this isn't hardcoded as a full URL.
    canonical: "/column",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    locale: "ko_KR",
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function ColumnListPage() {
  const published = columnSource.getPublished();
  const featured = columnSource.getFeatured().slice(0, MAX_FEATURED);
  const categories = getCategoryCounts(published);
  // Page 1 of a (possibly empty) list is always a valid page — see
  // lib/pagination.ts — so this non-null assertion is safe here.
  const pagination = paginate(published, 1, COLUMN_PAGE_SIZE)!;

  const collection = buildColumnCollectionJsonLd({
    canonicalUrl: absoluteUrl("/column"),
    name: SEO_TITLE,
    columns: pagination.items.map((c) => c.frontmatter),
  });
  const graph = collection ? buildGraph([collection]) : null;

  return (
    <>
      {graph && <JsonLd data={graph} />}
      <ColumnListingView
        eyebrow="콘텐츠"
        title="김종욱 원장의 치과 칼럼"
        description="과잉진료 걱정 없이 치료를 결정하실 수 있도록, 진료 원칙과 치료 과정을 원장이 직접 설명해 드립니다."
        categories={categories}
        featured={featured}
        pagination={pagination}
        basePath="/column"
        emptyMessage="아직 등록된 칼럼이 없습니다. 곧 새로운 글로 찾아뵙겠습니다."
      />
    </>
  );
}
