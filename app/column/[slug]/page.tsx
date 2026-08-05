import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArticleHeader } from "@/components/content/ArticleHeader";
import { ArticleBody } from "@/components/content/ArticleBody";
import { TableOfContents } from "@/components/content/TableOfContents";
import { AuthorBio } from "@/components/content/AuthorBio";
import { TagList } from "@/components/content/TagList";
import { RelatedTreatmentLinks } from "@/components/content/RelatedTreatmentLinks";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { CTA } from "@/components/content/mdx/CTA";
import { columnSource } from "@/lib/content/sources/columns";
import { authorSource } from "@/lib/content/sources/authors";
import { extractToc } from "@/lib/toc";
import { getRelatedColumns } from "@/lib/related";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

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
    title: `${frontmatter.title} - ${SITE_NAME}`,
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
  if (!column) notFound();

  const { frontmatter } = column;
  const author = authorSource.getBySlug(frontmatter.authorSlug);
  if (!author) {
    throw new Error(`ColumnDetailPage: authorSlug "${frontmatter.authorSlug}" does not match any file in content/authors/.`);
  }
  const reviewer = frontmatter.reviewedBySlug ? authorSource.getBySlug(frontmatter.reviewedBySlug) : null;

  const tocItems = extractToc(column.content);
  const relatedColumns = getRelatedColumns(column, columnSource.getPublished());

  return (
    <article className="column-detail">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "원장 칼럼", href: "/column" },
            { label: frontmatter.title, href: `/column/${frontmatter.slug}` },
          ]}
        />

        <ArticleHeader column={column} readingTimeMinutes={column.readingTimeMinutes} />

        <div className="column-detail-thumb">
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
