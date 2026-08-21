import { createCategorizedContentSource } from "@/lib/content/loader";
import { FAQ_CONFIG } from "@/lib/content/registry";
import type { FaqEntry } from "@/lib/content/types";
import { TREATMENT_ANCHORS } from "@/lib/treatmentAnchors";
import { authorSource } from "./authors";
import { columnSource } from "./columns";

/**
 * The only FAQ data-access entry point pages should import from — same
 * pattern as columnSource (lib/content/sources/columns.ts), sized down via
 * createCategorizedContentSource() since FAQ has no tags/featured concept.
 */
export const faqSource = createCategorizedContentSource(FAQ_CONFIG);

/** Mirrors checkAuthorReferences in sources/columns.ts. */
export function checkFaqAuthorReferences(entries: FaqEntry[], knownAuthorSlugs: Set<string>): void {
  for (const entry of entries) {
    if (!knownAuthorSlugs.has(entry.frontmatter.authorSlug)) {
      throw new Error(
        `${entry.filePath}: authorSlug "${entry.frontmatter.authorSlug}" does not match any file in content/authors/.`,
      );
    }
  }
}

export function validateFaqAuthorReferences(): void {
  checkFaqAuthorReferences(faqSource.getAll(), new Set(authorSource.getAllSlugs()));
}

/** Mirrors checkRelatedTreatmentSlugs in sources/columns.ts. */
export function checkFaqRelatedTreatmentSlugs(entries: FaqEntry[], knownTreatmentSlugs: Set<string>): void {
  for (const entry of entries) {
    for (const slug of entry.frontmatter.relatedTreatmentSlugs) {
      if (!knownTreatmentSlugs.has(slug)) {
        throw new Error(
          `${entry.filePath}: relatedTreatmentSlugs "${slug}" does not match any entry in lib/treatmentAnchors.ts.`,
        );
      }
    }
  }
}

export function validateFaqRelatedTreatmentSlugs(): void {
  checkFaqRelatedTreatmentSlugs(faqSource.getAll(), new Set(Object.keys(TREATMENT_ANCHORS)));
}

/**
 * FAQ-specific: `relatedColumnSlugs` must resolve to a real column slug
 * (any column, published or draft — a FAQ referencing a not-yet-published
 * column is a legitimate authoring-order situation, same reasoning as
 * `getAllSlugs()` being available on the column source at all).
 */
export function checkFaqRelatedColumnSlugs(entries: FaqEntry[], knownColumnSlugs: Set<string>): void {
  for (const entry of entries) {
    for (const slug of entry.frontmatter.relatedColumnSlugs) {
      if (!knownColumnSlugs.has(slug)) {
        throw new Error(`${entry.filePath}: relatedColumnSlugs "${slug}" does not match any file in content/columns/.`);
      }
    }
  }
}

export function validateFaqRelatedColumnSlugs(): void {
  checkFaqRelatedColumnSlugs(faqSource.getAll(), new Set(columnSource.getAllSlugs()));
}
