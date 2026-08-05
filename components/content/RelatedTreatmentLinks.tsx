import Link from "next/link";
import { TREATMENT_ANCHORS } from "@/lib/treatmentAnchors";

/**
 * `relatedTreatmentSlugs` is already cross-checked against
 * TREATMENT_ANCHORS at content-load time (see
 * lib/content/sources/columns.ts's validateColumnRelatedTreatmentSlugs,
 * run by scripts/validate-content.ts) — an unmappable slug is a build-time
 * validation failure, not something this component silently drops. If it
 * reaches here, the slug is guaranteed to resolve.
 */
export function RelatedTreatmentLinks({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;

  return (
    <section className="column-related-treatments">
      <h2>관련 진료</h2>
      <ul>
        {slugs.map((slug) => {
          const anchor = TREATMENT_ANCHORS[slug];
          if (!anchor) {
            throw new Error(`RelatedTreatmentLinks: "${slug}" does not match any entry in lib/treatmentAnchors.ts.`);
          }
          return (
            <li key={slug}>
              <Link href={anchor.href}>{anchor.label}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
