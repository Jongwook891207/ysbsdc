import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { columnSource } from "@/lib/content/sources/columns";
import { authorSource } from "@/lib/content/sources/authors";
import { formatDateKo, toDateTimeAttr } from "@/lib/utils";

/**
 * Stage 4-2: real MDX rendering, built directly on stage 4-1's content
 * layer (columnSource/authorSource) — nothing in lib/content/ changed for
 * this.
 *
 * generateStaticParams uses getPublished() (not getAll()) so drafts are
 * never pre-rendered at build time. The page component itself still calls
 * getBySlug() (not draft-filtered) rather than getPublished().find(...) —
 * requesting a draft's URL directly still renders it on-demand (Next's
 * default `dynamicParams` behavior for a slug outside
 * generateStaticParams), matching how gray-matter/loader.ts already treat
 * "draft" as "excluded from public *listings*," not "unrenderable." There's
 * no separate preview/auth system yet, so this is the same policy stage
 * 4-1 already established, just now visible through a real page.
 *
 * TODO(stage 5): generateMetadata() (title/description/canonical/OG from
 * frontmatter) and <JsonLd data={buildArticleJsonLd(column, author)} />.
 * TODO(later stage): Breadcrumb, TOC, Reading Time display, Related
 * Articles — explicitly out of scope this stage.
 */
export async function generateStaticParams() {
  return columnSource.getPublished().map((entry) => ({ slug: entry.frontmatter.slug }));
}

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const column = columnSource.getBySlug(slug);
  if (!column) notFound();

  const author = authorSource.getBySlug(column.frontmatter.authorSlug);

  return (
    <div className="column-detail">
      <article className="container">
        <header className="column-detail-header">
          <p className="eyebrow">{column.frontmatter.category}</p>
          <h1>{column.frontmatter.title}</h1>
          <p className="column-detail-meta">
            {author && <span>{author.frontmatter.name}</span>}
            <time dateTime={toDateTimeAttr(column.frontmatter.publishedAt)}>
              {formatDateKo(column.frontmatter.publishedAt)}
            </time>
          </p>
        </header>
        <div className="column-detail-body">
          <ArticleBody source={column.content} />
        </div>
      </article>
    </div>
  );
}
