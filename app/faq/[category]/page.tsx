import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentListHeader } from "@/components/content/ContentListHeader";
import { AuthorBio } from "@/components/content/AuthorBio";
import { ArticleBody } from "@/components/content/ArticleBody";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import type { FaqAccordionItem } from "@/components/faq/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSource } from "@/lib/content/sources/faq";
import { authorSource } from "@/lib/content/sources/authors";
import { columnSource } from "@/lib/content/sources/columns";
import { FAQ_CATEGORIES, getFaqCategoryDef } from "@/lib/faqCategories";
import { TREATMENT_ANCHORS } from "@/lib/treatmentAnchors";
import { extractToc } from "@/lib/toc";
import { extractShortAnswer } from "@/lib/extractShortAnswer";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildGraph } from "@/lib/jsonld";

/**
 * Phase 3-B MVP: every FAQ launches Hub-only (see design doc §F/§T) — this
 * category page IS the answer's only public location; there is no
 * `/faq/[category]/[slug]` route. All 20 entries render fully in the
 * accordion below (SSG — the closed-state answer is still in the static
 * HTML, only hidden by CSS, same as home's FaqSection), so crawlers read
 * the complete answer without executing JS.
 */
export async function generateStaticParams() {
  return FAQ_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const def = getFaqCategoryDef(category);
  if (!def) return {};

  const title = `${def.label} 자주 묻는 질문`;
  const canonicalUrl = absoluteUrl(`/faq/${def.slug}`);

  return {
    title,
    description: def.description,
    alternates: {
      canonical: `/faq/${def.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: def.description,
      url: canonicalUrl,
      locale: "ko_KR",
    },
    twitter: {
      card: "summary",
      title,
      description: def.description,
    },
  };
}

export default async function FaqCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const def = getFaqCategoryDef(category);
  if (!def) notFound();

  const entries = faqSource.getByCategory(def.slug);
  const author = authorSource.getBySlug("kim-jongwook");
  if (!author) {
    throw new Error("FaqCategoryPage: authorSlug \"kim-jongwook\" does not match any file in content/authors/.");
  }

  const canonicalUrl = absoluteUrl(`/faq/${def.slug}`);
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "자주 묻는 질문", href: "/faq" },
    { label: def.label, href: `/faq/${def.slug}` },
  ];

  const faqJsonLdItems = entries.map((entry) => ({
    question: entry.frontmatter.question,
    answer: extractShortAnswer(entry.content, entry.filePath),
  }));

  const graph = buildGraph(
    [
      buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl),
      faqJsonLdItems.length > 0 ? buildFaqJsonLd(faqJsonLdItems, canonicalUrl) : null,
    ].filter((entity): entity is Record<string, unknown> => entity !== null),
  );

  const accordionItems: FaqAccordionItem[] = entries.map((entry) => {
    const tocItems = extractToc(entry.content);
    const treatmentLinks = entry.frontmatter.relatedTreatmentSlugs
      .map((slug) => TREATMENT_ANCHORS[slug])
      .filter((anchor): anchor is NonNullable<typeof anchor> => Boolean(anchor));
    const relatedColumns = entry.frontmatter.relatedColumnSlugs
      .map((slug) => columnSource.getBySlug(slug))
      .filter((column): column is NonNullable<typeof column> => column !== null);
    const hasLinks = treatmentLinks.length > 0 || relatedColumns.length > 0;

    return {
      id: entry.frontmatter.slug,
      question: entry.frontmatter.question,
      answer: <ArticleBody source={entry.content} tocItems={tocItems} />,
      meta: hasLinks ? (
        <p className="faq-a-links">
          {treatmentLinks.map((anchor) => (
            <Link key={anchor.href} href={anchor.href}>
              {anchor.label} 진료 안내
            </Link>
          ))}
          {relatedColumns.map((column) => (
            <Link key={column.frontmatter.slug} href={`/column/${column.frontmatter.slug}`}>
              {column.frontmatter.title}
            </Link>
          ))}
        </p>
      ) : undefined,
    };
  });

  return (
    <div className="faq-page">
      <JsonLd data={graph} />
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ContentListHeader
        eyebrow="자주 묻는 질문"
        title={`${def.label} 질문 ${entries.length}개`}
        description={def.description}
      />
      <section className="faq-category-section">
        <div className="container">
          {entries.length === 0 ? (
            <p className="faq-empty">아직 등록된 질문이 없습니다.</p>
          ) : (
            <FaqAccordion items={accordionItems} />
          )}
          <div className="faq-page-footer">
            <AuthorBio author={author.frontmatter} heading="답변한 원장" />
            <p className="faq-back-link">
              <Link href="/faq">전체 카테고리 보기 →</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
