import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSource } from "@/lib/content/sources/faq";
import { FAQ_CATEGORIES } from "@/lib/faqCategories";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildGraph, buildWebPageJsonLd, DENTIST_ID } from "@/lib/jsonld";

const SEO_TITLE = "자주 묻는 질문";
const SEO_DESCRIPTION =
  "부천 오정구 원종동·고강동 연세백세치과의원 대표원장 김종욱이 진료실에서 실제로 자주 받는 질문에 직접 답합니다.";

/**
 * Phase 3-B MVP: hub page lists the 9 categories only — no individual FAQ
 * URLs exist yet (all 20 launch entries are Hub-only, see the design doc
 * §F/§T). `buildWebPageJsonLd()` (not `buildFaqJsonLd()`) because this page
 * doesn't show any actual Q&A itself, only category cards — JSON-LD must
 * match what's visible (same rule buildFaqJsonLd()'s own doc comment
 * states), and a category card with a question preview isn't a complete
 * answer.
 */
export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/faq",
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
  },
  twitter: {
    card: "summary",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
};

export default function FaqHubPage() {
  const published = faqSource.getPublished();
  const canonicalUrl = absoluteUrl("/faq");
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "자주 묻는 질문", href: "/faq" },
  ];

  const graph = buildGraph([
    buildWebPageJsonLd({ canonicalUrl, name: SEO_TITLE, description: SEO_DESCRIPTION, aboutId: DENTIST_ID }),
    buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl),
  ]);

  return (
    <div className="faq-page">
      <JsonLd data={graph} />
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ContentListHeader eyebrow="자주 묻는 질문" title="진료실에서 자주 받는 질문" description={SEO_DESCRIPTION} />
      <section className="faq-hub-section">
        <div className="container">
          <div className="faq-category-grid">
            {FAQ_CATEGORIES.map((def) => {
              const entries = published.filter((entry) => entry.frontmatter.category === def.slug);
              const preview = entries[0];
              return (
                <Link key={def.slug} href={`/faq/${def.slug}`} className="treat-card">
                  <h3>{def.label}</h3>
                  <p className="treat-desc">{def.description}</p>
                  {preview && <p className="faq-hub-preview">Q. {preview.frontmatter.question}</p>}
                  <span className="faq-hub-count">{entries.length}개 질문</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
