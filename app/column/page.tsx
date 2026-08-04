import type { Metadata } from "next";
import { ColumnCard } from "@/components/cards/ColumnCard";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { EmptyState } from "@/components/content/EmptyState";
import { columnSource } from "@/lib/content/sources/columns";
import { SITE_NAME } from "@/lib/seo";

const SEO_TITLE = "원장 칼럼 - 연세백세치과의원";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원 김종욱 원장이 직접 쓰는 치과 지식 칼럼. 임플란트, 틀니, 신경치료 등 진료 관련 궁금증을 알기 쉽게 설명합니다.";
// No dedicated photo for this list page (same situation as /treatment,
// /mission) — reusing the same existing clinic photo those pages use for
// OG rather than referencing a file that doesn't exist.
const OG_IMAGE = "/images/consult.png";

/**
 * Stage 4-3: real column list, built entirely on stage 4-1's columnSource
 * (no new fs/MDX-parsing logic here — see the note in ColumnCard.tsx).
 * Pagination/category/tag pages/search/home-teaser wiring are explicitly
 * out of scope this stage (see the stage 4-3 report for what's left).
 *
 * Article JSON-LD doesn't belong on a list page; a CollectionPage/ItemList
 * entity is a reasonable candidate here but is deferred to the SEO stage
 * per this stage's scope, same as every other page's JSON-LD so far.
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
  const columns = columnSource.getPublished();

  return (
    <div className="column-page">
      <ContentListHeader
        eyebrow="콘텐츠"
        title="김종욱 원장의 치과 칼럼"
        description="과잉진료 걱정 없이 치료를 결정하실 수 있도록, 진료 원칙과 치료 과정을 원장이 직접 설명해 드립니다."
      />
      <section className="column-list-section">
        <div className="container">
          {columns.length === 0 ? (
            <EmptyState message="아직 등록된 칼럼이 없습니다. 곧 새로운 글로 찾아뵙겠습니다." />
          ) : (
            <>
              <h2 className="column-list-section-title">최신 글</h2>
              <div className="column-list-grid">
                {columns.map((column) => (
                  <ColumnCard key={column.frontmatter.slug} column={column} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
