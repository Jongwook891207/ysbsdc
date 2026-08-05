import { createContentSource } from "@/lib/content/loader";
import { COLUMN_CONFIG } from "@/lib/content/registry";
import type { ColumnEntry } from "@/lib/content/types";
import { authorSource } from "./authors";
import { TREATMENT_ANCHORS } from "@/lib/treatmentAnchors";

/**
 * The only column data-access entry point pages should import from
 * (stage 4-2). Everything else — file reading, frontmatter validation,
 * sorting, draft filtering — lives in lib/content/loader.ts.
 *
 * No explicit type argument here — COLUMN_CONFIG is already typed as
 * ContentTypeConfig<ContentFrontmatterOutput, ContentFrontmatterInput>
 * (registry.ts), so both of createContentSource's type parameters are
 * inferred from it. Passing `<ColumnFrontmatter>` explicitly would fix
 * only the output type and default the input type parameter to match it,
 * silently re-introducing the input/output mismatch this was fixed for.
 */
export const columnSource = createContentSource(COLUMN_CONFIG);

/**
 * Pure check, separated from validateColumnAuthorReferences() below so
 * scripts/validate-content.ts can test the failure case directly with
 * fixture data instead of needing to write a bad file into the real
 * content/columns/ directory.
 */
export function checkAuthorReferences(entries: ColumnEntry[], knownAuthorSlugs: Set<string>): void {
  for (const entry of entries) {
    const { authorSlug, reviewedBySlug } = entry.frontmatter;
    if (!knownAuthorSlugs.has(authorSlug)) {
      throw new Error(`${entry.filePath}: authorSlug "${authorSlug}" does not match any file in content/authors/.`);
    }
    if (reviewedBySlug && !knownAuthorSlugs.has(reviewedBySlug)) {
      throw new Error(
        `${entry.filePath}: reviewedBySlug "${reviewedBySlug}" does not match any file in content/authors/.`,
      );
    }
  }
}

/**
 * Cross-checks every real column's `authorSlug`/`reviewedBySlug` against
 * the real authors in content/authors/ — zod can only validate one
 * document in isolation, so this can't live in the schema itself; it
 * belongs here (the column-specific source) rather than in the generic
 * loader.ts, which stays agnostic about columns relating to authors at all.
 *
 * Implemented now rather than deferred to stage 4-2, since content/authors/
 * already exists in this same stage and a broken authorSlug is exactly the
 * kind of mistake that should fail loudly at content-validation time, not
 * silently 404 a byline once a page renders it. Not run automatically on
 * every getAll()/getPublished() call, though — it's called explicitly from
 * scripts/validate-content.ts (and can be called from a stage 4-2 build
 * step too) rather than adding an authors-source dependency to every
 * runtime read of column data.
 */
export function validateColumnAuthorReferences(): void {
  checkAuthorReferences(columnSource.getAll(), new Set(authorSource.getAllSlugs()));
}

/**
 * Mirrors checkAuthorReferences above: a column's `relatedTreatmentSlugs`
 * must resolve against the real `/treatment` anchors (lib/treatmentAnchors.ts),
 * checked explicitly here rather than silently filtered at render time —
 * RelatedTreatmentLinks.tsx also throws on an unmappable slug, but this
 * check runs at `npm run validate:content` time, before a build.
 */
export function checkRelatedTreatmentSlugs(entries: ColumnEntry[], knownTreatmentSlugs: Set<string>): void {
  for (const entry of entries) {
    for (const slug of entry.frontmatter.relatedTreatmentSlugs ?? []) {
      if (!knownTreatmentSlugs.has(slug)) {
        throw new Error(
          `${entry.filePath}: relatedTreatmentSlugs "${slug}" does not match any entry in lib/treatmentAnchors.ts.`,
        );
      }
    }
  }
}

export function validateColumnRelatedTreatmentSlugs(): void {
  checkRelatedTreatmentSlugs(columnSource.getAll(), new Set(Object.keys(TREATMENT_ANCHORS)));
}
