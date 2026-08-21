import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArticleHeader } from "@/components/content/ArticleHeader";
import { ArticleBody } from "@/components/content/ArticleBody";
import { TableOfContents } from "@/components/content/TableOfContents";
import { AuthorBio } from "@/components/content/AuthorBio";
import { TagList } from "@/components/content/TagList";
import { FaqSection } from "@/components/content/FaqSection";
import { RelatedTreatmentLinks } from "@/components/content/RelatedTreatmentLinks";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { CTA } from "@/components/content/mdx/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { columnSource } from "@/lib/content/sources/columns";
import { authorSource } from "@/lib/content/sources/authors";
import { extractToc } from "@/lib/toc";
import { getRelatedColumns } from "@/lib/related";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildGraph } from "@/lib/jsonld";

/**
 * Stage 4-4: the full column detail template. Nothing here re-implements
 * fs/parsing — everything goes through columnSource/authorSource (stage
 * 4-1) and ArticleBody (stage 4-2). generateStaticParams still only builds
 * getPublished() slugs (drafts render on-demand only, same policy as
 * stage 4-2 established).
 *
 * TOC ids and ArticleBody's rendered heading ids are derived from the same
 * `extractToc(column.content)` call passed down as `tocItems`, guaranteeing
 * they correspond — see components/content/mdx/createHeadingComponents.tsx.
 *
 * No nested <main> — the whole page is one <article> under whatever <main>
 * app/layout.tsx already provides.
 */
export async function generateStaticParams() {
  return columnSource.getPublished().map((entry) => ({ slug: entry.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const column = columnSource.getBySlug(slug);
  if (!column) return {};

  const { frontmatter } = column;
  const author = authorSource.getBySlug(frontmatter.authorSlug);
  const canonicalUrl = absoluteUrl(`/column/${frontmatter.slug}`);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: `/column/${frontmatter.slug}`,
    },
    robots: {
      index: !frontmatter.draft,
      follow: !frontmatter.draft,
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: frontmatter.title,
      description: frontmatter.description,
      url: canonicalUrl,
      locale: "ko_KR",
      images: [{ url: frontmatter.thumbnail }],
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt ?? frontmatter.publishedAt,
      authors: author ? [author.frontmatter.name] : undefined,
      section: frontmatter.category,
      tags: frontmatter.tags.length > 0 ? frontmatter.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [frontmatter.thumbnail],
    },
  };
}

export default async function ColumnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const column = columnSource.getBySlug(slug);
  // getBySlug() reads getAll() (drafts included) — generateStaticParams()
  // above only pre-builds published slugs, but Next's default dynamicParams
  // fallback still renders anything requested by URL on-demand. Without this
  // check a draft would render at 200 for anyone who guesses/finds its URL,
  // even though it's already excluded from the sitemap and /column listing.
  if (!column || column.frontmatter.draft) notFound();

  const { frontmatter } = column;
  const author = authorSource.getBySlug(frontmatter.authorSlug);
  if (!author) {
    throw new Error(`ColumnDetailPage: authorSlug "${frontmatter.authorSlug}" does not match any file in content/authors/.`);
  }
  const reviewer = frontmatter.reviewedBySlug ? authorSource.getBySlug(frontmatter.reviewedBySlug) : null;

  const tocItems = extractToc(column.content);
  const relatedColumns = getRelatedColumns(column, columnSource.getPublished());

  const canonicalUrl = absoluteUrl(`/column/${frontmatter.slug}`);
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "원장 칼럼", href: "/column" },
    {
      label: `${frontmatter.category} 칼럼`,
      href: `/column/category/${encodeURIComponent(frontmatter.category)}`,
    },
    { label: frontmatter.title, href: `/column/${frontmatter.slug}` },
  ];

  const graph = buildGraph(
    [
      buildArticleJsonLd({
        column: frontmatter,
        author: author.frontmatter,
        reviewer: reviewer?.frontmatter ?? null,
        canonicalUrl,
      }),
      buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl),
      frontmatter.faq && frontmatter.faq.length > 0 ? buildFaqJsonLd(frontmatter.faq, canonicalUrl) : null,
    ].filter((entity): entity is Record<string, unknown> => entity !== null),
  );

  return (
    <article className="column-detail">
      <JsonLd data={graph} />
      <div className="container">
        {/* data-aos wrapper stays here rather than inside Breadcrumb.tsx — that
            component is also used by /doctor/[slug], outside this task's scope. */}
        <div data-aos="fade-up">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <ArticleHeader column={column} readingTimeMinutes={column.readingTimeMinutes} />

        <div className="column-detail-thumb" data-aos="fade-up" data-aos-delay={300}>
          <Image src={frontmatter.thumbnail} alt={`${frontmatter.title} 대표 이미지`} width={960} height={540} priority />
        </div>

        <div className="column-detail-layout">
          <TableOfContents items={tocItems} />

          <div className="column-detail-body">
            <ArticleBody source={column.content} tocItems={tocItems} />
          </div>
        </div>

        {frontmatter.relatedTreatmentSlugs && <RelatedTreatmentLinks slugs={frontmatter.relatedTreatmentSlugs} />}

        <TagList tags={frontmatter.tags} />

        <FaqSection items={frontmatter.faq ?? []} />

        <CTA>지금 바로 상담 예약하기</CTA>

        <AuthorBio author={author.frontmatter} heading="글쓴이" />
        {reviewer && reviewer.frontmatter.slug !== author.frontmatter.slug && (
          <AuthorBio author={reviewer.frontmatter} heading="검수한 원장" />
        )}

        <RelatedArticles columns={relatedColumns} />
      </div>
    </article>
  );
}
