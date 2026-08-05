import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { columnSource } from "@/lib/content/sources/columns";
import { formatDateKo } from "@/lib/utils";

const MAX_TEASERS = 3;

/**
 * Ports index.html's `<section id="column">` (Director's Column teaser).
 * Stage 4-5: replaces the stage-2/3 hardcoded sample cards with real
 * `columnSource` data.
 *
 * Fallback policy: featured (published, `featured: true`) articles come
 * first; if there are fewer than MAX_TEASERS of them, the newest published
 * articles (excluding ones already shown as featured) fill the remaining
 * slots — never random/unrelated picks, and never padded past what real
 * published content actually exists. Renders nothing at all if there are
 * zero published columns, so the home page doesn't show an empty grid.
 */
export function ColumnTeaserSection() {
  const featured = columnSource.getFeatured();
  const featuredSlugs = new Set(featured.map((c) => c.frontmatter.slug));
  const fallback = columnSource.getPublished().filter((c) => !featuredSlugs.has(c.frontmatter.slug));
  const columns = [...featured, ...fallback].slice(0, MAX_TEASERS);

  if (columns.length === 0) return null;

  return (
    <section id="column">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">DIRECTOR&apos;S COLUMN</span>
          <h2 className="section-title">원장님이 직접 전하는 안심 칼럼</h2>
        </div>
        <div className="column-grid">
          {columns.map((column, index) => (
            <article
              key={column.frontmatter.slug}
              className="column-card"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div className="column-thumb">
                <ImageWithFallback
                  src={column.frontmatter.thumbnail}
                  alt={`${column.frontmatter.title} 대표 이미지`}
                  width={400}
                  height={250}
                  placeholderText="칼럼 대표 이미지"
                />
              </div>
              <div className="column-body">
                <div className="column-date">{formatDateKo(column.frontmatter.publishedAt)}</div>
                <h3>{column.frontmatter.title}</h3>
                <p>{column.frontmatter.summary}</p>
                <Link
                  href={`/column/${column.frontmatter.slug}`}
                  className="btn btn-outline"
                  style={{ padding: "8px 16px", fontSize: 13 }}
                >
                  자세히 보기 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
