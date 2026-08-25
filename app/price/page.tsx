import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { PRICE_CATEGORIES, PRICE_TOP_NOTE } from "@/components/sections/price/priceList.data";
import { TREATMENT_ANCHORS } from "@/lib/treatmentAnchors";
import { getFaqCategoryDef } from "@/lib/faqCategories";
import { CLINIC, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildGraph, buildWebPageJsonLd, DENTIST_ID } from "@/lib/jsonld";

const SEO_TITLE = "비급여 진료비 안내";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원의 비급여 진료비를 치료 결정 전에 확인하실 수 있도록 공개합니다. 임플란트, 틀니, 보철, 충치·보존 등 항목별 비용을 안내해 드립니다.";

/**
 * Phase C — price transparency page. This is not an event/discount page:
 * the only message is "치료 전 비용을 미리 확인할 수 있다." No Offer/
 * PriceSpecification JSON-LD (see the file-level comment on priceList.data
 * and the Phase C report for why) — WebPage + BreadcrumbList only, matching
 * how /faq's hub page is modeled.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/price",
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
    url: absoluteUrl("/price"),
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
};

function formatWon(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export default function PricePage() {
  const canonicalUrl = absoluteUrl("/price");
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "비급여 진료비 안내", href: "/price" },
  ];

  const graph = buildGraph([
    buildWebPageJsonLd({ canonicalUrl, name: SEO_TITLE, description: SEO_DESCRIPTION, aboutId: DENTIST_ID }),
    buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl),
  ]);

  return (
    <div className="price-page">
      <JsonLd data={graph} />
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ContentListHeader
        eyebrow="PRICE GUIDE"
        title={SEO_TITLE}
        description="연세백세치과의 비급여 진료비를 치료 결정 전에 확인하실 수 있도록 공개합니다."
      />

      <section className="price-jump-section">
        <div className="container">
          <nav className="price-jump" aria-label="카테고리 바로가기">
            {PRICE_CATEGORIES.map((cat) => (
              <a key={cat.slug} href={`#${cat.slug}`}>
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="price-table-section">
        <div className="container">
          <p className="price-top-note">{PRICE_TOP_NOTE}</p>

          {PRICE_CATEGORIES.map((cat) => {
            const treatmentAnchor = cat.relatedTreatmentAnchor ? TREATMENT_ANCHORS[cat.relatedTreatmentAnchor] : null;
            const faqCategory = cat.relatedFaqCategory ? getFaqCategoryDef(cat.relatedFaqCategory) : null;
            // "자가 미백" 등 실제 가격이 아직 확정되지 않은 항목은 공개 가격표에서
            // 제외한다 — 원본 데이터는 그대로 두고 화면에만 표시하지 않는다.
            const visibleItems = cat.items.filter((item) => !item.unpublished);
            if (visibleItems.length === 0) return null;

            return (
              <div key={cat.slug} id={cat.slug} className="price-category">
                <h2>{cat.label}</h2>
                {cat.categoryNote && <p className="price-category-note">{cat.categoryNote}</p>}
                <table className="price-table">
                  <thead>
                    <tr>
                      <th scope="col">진료 항목</th>
                      <th scope="col">비용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item, i) => (
                      <tr key={`${item.name}-${item.condition ?? i}`}>
                        <td>
                          <span className="price-item-name">{item.name}</span>
                          {item.condition && <span className="price-item-condition">{item.condition}</span>}
                          {item.note && <span className="price-item-note">{item.note}</span>}
                        </td>
                        <td className="price-item-cost">
                          {item.price !== null ? formatWon(item.price) : "상담 후 안내"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(treatmentAnchor || faqCategory) && (
                  <p className="price-category-links">
                    {treatmentAnchor && <Link href={treatmentAnchor.href}>{treatmentAnchor.label} 진료 안내 보기</Link>}
                    {faqCategory && <Link href={`/faq/${faqCategory.slug}`}>{faqCategory.label} 자주 묻는 질문 보기</Link>}
                  </p>
                )}
              </div>
            );
          })}

          <div className="price-disclaimer">
            <p>
              위 비용은 대표적인 비급여 진료 항목의 기준 가격입니다. 실제 치료계획과 비용은 치아 상태, 치료
              범위, 필요한 추가 치료에 따라 달라질 수 있으며, 진단 후 정확한 계획과 함께 안내해 드립니다.
            </p>
          </div>

          <div className="price-cta">
            <a href={CLINIC.bookingUrl} className="btn btn-navy" target="_self">
              간편 예약
            </a>
            <a href={`tel:${CLINIC.telephoneDisplay}`} className="btn btn-outline">
              전화 문의 {CLINIC.telephoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
