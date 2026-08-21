import type { ContentFrontmatterOutput, AuthorFrontmatterOutput, FaqFrontmatterOutput } from "./schemas";

/**
 * Content data layer types (stage 4-1). Deliberately separate from the
 * stage-1 `lib/types.ts` (`Column`/`Doctor`) — those still back the
 * placeholder components stage 4-2 will replace (ColumnCard, DoctorCard,
 * Breadcrumb, RelatedColumns) and are untouched this stage. Once stage 4-2
 * builds the real /column pages against this module, `lib/types.ts`'s
 * `Column`/`Doctor`/`ColumnFrontmatter` and `lib/columns.ts`/
 * `lib/doctors.ts` become dead code to remove.
 *
 * Frontmatter shapes are derived from schemas.ts (`z.output<...>`) rather
 * than hand-duplicated here — the zod schema is the single source of
 * truth for the shape, so a field can't drift between "what's validated"
 * and "what TypeScript thinks exists."
 */

/** Fields every content type (column now; question/guide/case later) shares. */
export type ContentFrontmatterBase = ContentFrontmatterOutput;

export type ColumnFrontmatter = ContentFrontmatterBase;

/**
 * A loaded, validated content file. `TFrontmatter` is deliberately
 * unconstrained (not `extends ContentFrontmatterBase`) — that base shape is
 * column-specific (title/summary/thumbnail/tags/faq[]/...), and FAQ (stage
 * 6, `lib/content/sources/faq.ts`) is a genuinely leaner content type that
 * doesn't have most of those fields. Only `createContentSource()`
 * (column/article-shaped types) requires the fuller `ContentFrontmatterBase`;
 * `createCategorizedContentSource()` (lib/content/loader.ts) works with any
 * frontmatter shape that has `slug`/`draft`/`category`/`publishedAt`.
 */
export interface ContentEntry<TFrontmatter = ContentFrontmatterBase> {
  frontmatter: TFrontmatter;
  /** Raw MDX body, pre-compile — reading time, excerpting, RSS, and (stage 4-2+) MDXRemote all read this. */
  content: string;
  readingTimeMinutes: number;
  /** Absolute path on disk — for error messages only, never rendered. */
  filePath: string;
}

export type ColumnEntry = ContentEntry<ColumnFrontmatter>;

/** FAQ frontmatter (stage 6) — see lib/content/schemas.ts#faqFrontmatterSchema for the field list and why it's deliberately smaller than ColumnFrontmatter. */
export type FaqFrontmatter = FaqFrontmatterOutput;
export type FaqEntry = ContentEntry<FaqFrontmatter>;

/** A loaded content file for types with no date/draft/tag concept (author). */
export interface SimpleEntry<TFrontmatter> {
  frontmatter: TFrontmatter;
  content: string;
  filePath: string;
}

/**
 * Author profiles are structurally different from the content types above
 * (no publishedAt/summary/tags — a profile isn't a dated article) so they
 * don't extend ContentFrontmatterBase.
 */
export type AuthorFrontmatter = AuthorFrontmatterOutput;

/** Currently unused by any reader — see the note in content/authors/kim-jongwook.mdx. */
export type AuthorEntry = SimpleEntry<AuthorFrontmatter>;
