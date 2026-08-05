import { authorSource } from "@/lib/content/sources/authors";
import { formatDateKo, toDateTimeAttr } from "@/lib/utils";
import type { ColumnEntry } from "@/lib/content/types";

/**
 * Author lookup is not optional-and-skippable: `authorSlug` failing to
 * resolve is a content bug the loader would already have caught at
 * `getBySlug`/reference-validation time (see
 * lib/content/sources/columns.ts#validateColumnAuthorReferences), so this
 * throws rather than rendering a page with no visible author — no
 * fake/default author is ever shown.
 */
export function ArticleHeader({ column, readingTimeMinutes }: { column: ColumnEntry; readingTimeMinutes: number }) {
  const { frontmatter } = column;
  const author = authorSource.getBySlug(frontmatter.authorSlug);
  if (!author) {
    throw new Error(`ArticleHeader: authorSlug "${frontmatter.authorSlug}" does not match any file in content/authors/.`);
  }

  const reviewer = frontmatter.reviewedBySlug ? authorSource.getBySlug(frontmatter.reviewedBySlug) : null;
  if (frontmatter.reviewedBySlug && !reviewer) {
    throw new Error(`ArticleHeader: reviewedBySlug "${frontmatter.reviewedBySlug}" does not match any file in content/authors/.`);
  }

  return (
    <header className="column-article-header">
      <p className="column-article-eyebrow">{frontmatter.category}</p>
      <h1>{frontmatter.title}</h1>
      <p className="column-article-summary">{frontmatter.summary}</p>
      <div className="column-article-meta">
        <span className="column-article-meta-author">{author.frontmatter.name}</span>
        <time dateTime={toDateTimeAttr(frontmatter.publishedAt)}>{formatDateKo(frontmatter.publishedAt)}</time>
        {frontmatter.updatedAt && (
          <span className="column-article-meta-updated">
            수정 {formatDateKo(frontmatter.updatedAt)}
          </span>
        )}
        <span className="column-article-meta-reading-time">약 {readingTimeMinutes}분 소요</span>
      </div>
      {reviewer && reviewer.frontmatter.slug !== author.frontmatter.slug && frontmatter.lastReviewed && (
        <p className="column-article-reviewed">
          {reviewer.frontmatter.name}이(가) {formatDateKo(frontmatter.lastReviewed)}에 검수했습니다.
        </p>
      )}
    </header>
  );
}
