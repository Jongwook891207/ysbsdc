import Link from "next/link";
import { columnSource } from "@/lib/content/sources/columns";

const MAX_RELATED = 3;

/**
 * Reverse direction of RelatedTreatmentLinks.tsx (column -> treatment):
 * reuses the same `frontmatter.relatedTreatmentSlugs` data already
 * validated against lib/treatmentAnchors.ts at content-load time — no new
 * mapping table, no hardcoded column URLs. Renders nothing when no
 * published column names this treatment.
 */
export function RelatedColumnLinks({ treatmentSlug }: { treatmentSlug: string }) {
  const columns = columnSource
    .getPublished()
    .filter((column) => column.frontmatter.relatedTreatmentSlugs?.includes(treatmentSlug))
    .slice(0, MAX_RELATED);

  if (columns.length === 0) return null;

  return (
    <div className="kt-related-columns">
      <p className="kt-related-columns-title">관련해서 많이 물어보시는 내용</p>
      <ul>
        {columns.map((column) => (
          <li key={column.frontmatter.slug}>
            <Link href={`/column/${column.frontmatter.slug}`}>{column.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
