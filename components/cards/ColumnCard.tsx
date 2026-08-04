import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { formatDateKo, toDateTimeAttr } from "@/lib/utils";
import type { ColumnEntry } from "@/lib/content/types";

/**
 * Stage 4-3. Not the same file as the flat stage-1 placeholder
 * `components/ColumnCard.tsx` (still used by `components/RelatedColumns.tsx`
 * against the old `lib/types.ts` Column/Doctor shapes) — that one is
 * untouched this stage per "Stage 4-1 loader·schema의 불필요한 리팩토링"
 * not being in scope. This is the real card, built directly on Stage 4-1's
 * `ColumnEntry` (loader.ts already computed `readingTimeMinutes`, so this
 * component doesn't recompute anything — it only reads fields already on
 * the entry passed in).
 *
 * The whole card is one `<Link>` (not just the title) so the entire card
 * is clickable/tappable, no click-delegation JS needed.
 */
export function ColumnCard({ column }: { column: ColumnEntry }) {
  const { title, slug, summary, category, thumbnail, publishedAt } = column.frontmatter;

  return (
    <article className="column-list-card">
      <Link href={`/column/${slug}`} className="column-list-card-link">
        <div className="column-list-thumb">
          <ImageWithFallback
            src={thumbnail}
            alt={`${title} 대표 이미지`}
            width={400}
            height={250}
            placeholderText="칼럼 대표 이미지"
          />
        </div>
        <div className="column-list-body">
          <span className="column-list-category">{category}</span>
          <h3 className="column-list-title">{title}</h3>
          <p className="column-list-summary">{summary}</p>
          <div className="column-list-meta">
            <time dateTime={toDateTimeAttr(publishedAt)}>{formatDateKo(publishedAt)}</time>
            <span className="column-list-reading-time">{column.readingTimeMinutes}분 읽기</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
