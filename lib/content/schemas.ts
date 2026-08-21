import { z } from "zod";

/**
 * Zod policy (stage 4-1):
 *
 *  - `.strict()` on every object schema — an unknown frontmatter field
 *    (typo, leftover copy-paste field, a field renamed here but not in the
 *    file) is a build-time error, not a silently-ignored value. At content
 *    volumes in the hundreds/thousands, silent tolerance is how a typo'd
 *    field quietly stops doing anything for months.
 *  - Every required string field rejects empty/whitespace-only values
 *    (`.min(1)` after `.trim()`-equivalent checks) — an empty title or
 *    summary is never valid, not even during a rough draft (drafts still
 *    parse to a slug/title/etc.; only the MDX *body* is expected to be
 *    unfinished).
 *  - `tags` duplicates are a validation error, not a silent dedupe — the
 *    author almost always meant to type a different tag; deduping quietly
 *    hides that mistake instead of surfacing it.
 *  - `featured`/`draft` default to `false` when omitted (Zod `.default()`),
 *    matching "new content is unfeatured and published unless the author
 *    opts in/out explicitly" — but if either is present in the file, it
 *    must be an actual boolean (no coercion from "true"/"false" strings).
 */

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const slugSchema = z
  .string()
  .regex(SLUG_PATTERN, "must contain only lowercase letters, numbers, and hyphens (e.g. \"implant-guide\")");

export const dateSchema = z.string().regex(DATE_PATTERN, "must be in YYYY-MM-DD format (e.g. \"2026-01-15\")");

const nonEmptyString = (label: string) => z.string().trim().min(1, `${label} must not be empty`);

const thumbnailSchema = z
  .string()
  .min(1, "thumbnail must not be empty")
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://"),
    'thumbnail must be a root-relative path ("/images/...") or an absolute "https://" URL',
  );

export const faqItemSchema = z
  .object({
    question: nonEmptyString("faq[].question"),
    answer: nonEmptyString("faq[].answer"),
  })
  .strict();

/** Shared by column now; question/guide/case (type-level only, see registry.ts) will reuse this too. */
export const contentFrontmatterSchema = z
  .object({
    title: nonEmptyString("title"),
    slug: slugSchema,
    summary: nonEmptyString("summary"),
    description: nonEmptyString("description"),
    publishedAt: dateSchema,
    updatedAt: dateSchema.optional(),
    authorSlug: slugSchema,
    reviewedBySlug: slugSchema.optional(),
    lastReviewed: dateSchema.optional(),
    category: nonEmptyString("category"),
    tags: z
      .array(nonEmptyString("tags[]"))
      .default([])
      .refine((tags) => new Set(tags).size === tags.length, {
        message: "tags must not contain duplicates",
      }),
    thumbnail: thumbnailSchema,
    relatedTreatmentSlugs: z.array(slugSchema).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    faq: z.array(faqItemSchema).optional(),
  })
  .strict()
  .refine((data) => !data.reviewedBySlug || !!data.lastReviewed, {
    message: "lastReviewed is required when reviewedBySlug is set (E-E-A-T review needs a date)",
    path: ["lastReviewed"],
  })
  .refine((data) => !data.updatedAt || data.updatedAt >= data.publishedAt, {
    message: "updatedAt must not be earlier than publishedAt",
    path: ["updatedAt"],
  });

export type ContentFrontmatterInput = z.input<typeof contentFrontmatterSchema>;
export type ContentFrontmatterOutput = z.output<typeof contentFrontmatterSchema>;

/**
 * FAQ frontmatter (stage 6 — Phase 3-B). Deliberately smaller than
 * `contentFrontmatterSchema`: no `title`/`summary`/`description`/
 * `thumbnail`/`tags`/`featured`, and — after building and reviewing 20 real
 * FAQ prototypes — no `shortAnswer` and no `citations` either.
 *
 *  - `shortAnswer` was cut because a separately-stored short answer and the
 *    MDX body's own opening paragraph inevitably drift apart the moment
 *    someone edits one and not the other. The first paragraph of `content`
 *    IS the short answer (docs/03 §17 already requires the body to open
 *    that way) — `lib/extractShortAnswer.ts` reads it from there instead of
 *    a second field.
 *  - `citations` was cut because only 3 of the first 20 real FAQs needed a
 *    literature reference, and those 3 write it as body prose (the same
 *    convention `content/columns/*.mdx` already uses for "참고문헌") rather
 *    than a structured field 85% of entries would leave empty. `citation`
 *    isn't implemented in `lib/jsonld.ts` for the same reason it isn't for
 *    Article (see docs/07 §11) — not guessed here either.
 *  - `reviewedBySlug`/`lastReviewed` were cut because grepping all 9 real
 *    published columns shows zero of them ever set these fields — a
 *    field unused even in the more mature content type isn't worth carrying
 *    into a new, leaner one.
 *  - `category` is a closed enum (unlike the column's free-text `category`)
 *    because FAQ's 9 categories are fixed UI routes (`app/faq/[category]`)
 *    — an unrecognized category should fail loudly at content-load time,
 *    not silently 404 at request time.
 */
export const FAQ_CATEGORY_SLUGS = [
  "implant",
  "denture",
  "endodontics",
  "caries",
  "gum-checkup",
  "prosthodontics",
  "wisdom-tooth",
  "philosophy",
  "clinic-info",
] as const;

export const faqFrontmatterSchema = z
  .object({
    question: nonEmptyString("question"),
    slug: slugSchema,
    category: z.enum(FAQ_CATEGORY_SLUGS),
    aliases: z.array(nonEmptyString("aliases[]")).default([]),
    publishedAt: dateSchema,
    updatedAt: dateSchema.optional(),
    authorSlug: slugSchema,
    relatedTreatmentSlugs: z.array(slugSchema).default([]),
    relatedColumnSlugs: z.array(slugSchema).default([]),
    promote: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((data) => !data.updatedAt || data.updatedAt >= data.publishedAt, {
    message: "updatedAt must not be earlier than publishedAt",
    path: ["updatedAt"],
  });

export type FaqFrontmatterInput = z.input<typeof faqFrontmatterSchema>;
export type FaqFrontmatterOutput = z.output<typeof faqFrontmatterSchema>;

export const authorFrontmatterSchema = z
  .object({
    name: nonEmptyString("name"),
    slug: slugSchema,
    jobTitle: nonEmptyString("jobTitle"),
    profileImage: thumbnailSchema,
    bio: nonEmptyString("bio"),
    education: z.array(nonEmptyString("education[]")).default([]),
    career: z.array(nonEmptyString("career[]")).default([]),
    specialties: z.array(nonEmptyString("specialties[]")).default([]),
    worksFor: nonEmptyString("worksFor"),
    sameAs: z.array(z.string().url("sameAs[] must be a full URL")).optional(),
    active: z.boolean().default(true),
  })
  .strict();

export type AuthorFrontmatterInput = z.input<typeof authorFrontmatterSchema>;
export type AuthorFrontmatterOutput = z.output<typeof authorFrontmatterSchema>;
