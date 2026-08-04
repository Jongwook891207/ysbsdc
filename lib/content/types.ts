import type { ContentFrontmatterOutput, AuthorFrontmatterOutput } from "./schemas";

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

/** A loaded, validated content file. */
export interface ContentEntry<TFrontmatter extends ContentFrontmatterBase = ContentFrontmatterBase> {
  frontmatter: TFrontmatter;
  /** Raw MDX body, pre-compile — reading time, excerpting, RSS, and (stage 4-2+) MDXRemote all read this. */
  content: string;
  readingTimeMinutes: number;
  /** Absolute path on disk — for error messages only, never rendered. */
  filePath: string;
}

export type ColumnEntry = ContentEntry<ColumnFrontmatter>;

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
