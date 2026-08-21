import path from "node:path";
import type { ZodType, ZodTypeDef } from "zod";
import { authorFrontmatterSchema, contentFrontmatterSchema, faqFrontmatterSchema } from "./schemas";
import type {
  AuthorFrontmatterInput,
  AuthorFrontmatterOutput,
  ContentFrontmatterInput,
  ContentFrontmatterOutput,
  FaqFrontmatterInput,
  FaqFrontmatterOutput,
} from "./schemas";

/**
 * Single place a new content type's config lives. Adding a real "question"/
 * "guide"/"case" type later is: add a `content/<type>s/` folder, a
 * `*_CONFIG` object below (reusing `contentFrontmatterSchema` or an
 * extended one), and a `lib/content/sources/<type>s.ts` that calls
 * `createContentSource(config)` — `loader.ts` itself needs no changes.
 */
export type ContentTypeKey = "column" | "author" | "faq" | "question" | "guide" | "case";

/** question/guide/case are reserved at the type level only per the approved
 * architecture — no folders, routes, or *_CONFIG entries exist for them yet. */
export type ReservedContentTypeKey = Extract<ContentTypeKey, "question" | "guide" | "case">;

/**
 * `TOutput`/`TInput` are kept separate on purpose — they are NOT the same
 * type. `featured`/`draft`/`tags` (and author's `education`/`career`/
 * `specialties`/`active`) are optional in the raw frontmatter an author
 * writes (`TInput`, `z.input<typeof schema>`) but always present after
 * `.default(...)` runs during parsing (`TOutput`, `z.output<typeof
 * schema>`). `schema: ZodType<TOutput, ZodTypeDef, TInput>` is zod's own
 * 3-parameter form for expressing exactly that — a schema whose *input*
 * and *output* shapes differ. Collapsing this to a single type parameter
 * (`ZodType<T>`, which defaults input to the same type as output) is what
 * caused the typecheck error this fixes: `ZodType<T>` implicitly claims
 * "parsing this returns exactly what you fed it," which isn't true for
 * any schema using `.default(...)`.
 */
export interface ContentTypeConfig<TOutput, TInput = TOutput> {
  key: ContentTypeKey;
  /** null for types with no public list route (author). */
  routeSegment: string | null;
  /** Absolute path, resolved from process.cwd() — see the note in loader.ts. */
  contentDir: string;
  label: string;
  schema: ZodType<TOutput, ZodTypeDef, TInput>;
  /** Omitted for types with no natural chronological order (author). */
  sort?: { by: "publishedAt"; order: "asc" | "desc" };
  /** Omitted for types with no listing/pagination yet (author). */
  pageSize?: number;
  /** Whether getAll() vs getPublished() distinction is meaningful for this type. */
  hasDrafts: boolean;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

export const COLUMN_CONFIG: ContentTypeConfig<ContentFrontmatterOutput, ContentFrontmatterInput> = {
  key: "column",
  routeSegment: "/column",
  contentDir: path.join(CONTENT_ROOT, "columns"),
  label: "원장 칼럼",
  schema: contentFrontmatterSchema,
  sort: { by: "publishedAt", order: "desc" },
  pageSize: 12,
  hasDrafts: true,
};

/**
 * FAQ (stage 6 / Phase 3-B). `pageSize` is omitted on purpose — category
 * pages show every entry in that category with no pagination (§O of the
 * design doc: MVP scale doesn't need it; add it back here the day a
 * category legitimately grows past ~20-30 entries).
 */
export const FAQ_CONFIG: ContentTypeConfig<FaqFrontmatterOutput, FaqFrontmatterInput> = {
  key: "faq",
  routeSegment: "/faq",
  contentDir: path.join(CONTENT_ROOT, "faq"),
  label: "자주 묻는 질문",
  schema: faqFrontmatterSchema,
  sort: { by: "publishedAt", order: "desc" },
  hasDrafts: true,
};

export const AUTHOR_CONFIG: ContentTypeConfig<AuthorFrontmatterOutput, AuthorFrontmatterInput> = {
  key: "author",
  // /doctor/[slug] (the column-system author profile route) isn't wired to
  // this data layer yet — that connection is stage 4-2 scope.
  routeSegment: null,
  contentDir: path.join(CONTENT_ROOT, "authors"),
  label: "작성자",
  schema: authorFrontmatterSchema,
  hasDrafts: false,
};
