import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ContentTypeConfig } from "./registry";
import { assertNoH1Heading } from "./mdxGuards";
import type { ContentEntry, ContentFrontmatterBase, SimpleEntry } from "./types";
import { estimateReadingTimeMinutes } from "../readingTime";

/**
 * The only file in the codebase that touches the filesystem for content.
 * Everything else (pages, sitemap, RSS, a future Sanity migration) goes
 * through `createContentSource()` / `createSimpleContentSource()` below —
 * swapping the MDX-file backend for a CMS later means rewriting only this
 * file; `lib/content/sources/*` and the registry configs don't change.
 *
 * Windows/Linux/Vercel: every path is built with `path.join`/`path.basename`
 * (never manual "/" concatenation) and resolved from `process.cwd()` (the
 * project root, whatever OS or working directory the process started in) —
 * never a path relative to this file's own location.
 */

const IS_DEV = process.env.NODE_ENV !== "production";

/** Raw parsed-and-validated file — before the two factories below shape it into ContentEntry vs AuthorEntry. */
interface RawEntry<T> {
  frontmatter: T;
  content: string;
  filePath: string;
}

function readMdxFiles(contentDir: string): { filePath: string; fileName: string; raw: string }[] {
  if (!fs.existsSync(contentDir)) {
    throw new Error(`Content directory does not exist: ${contentDir}`);
  }
  return fs
    .readdirSync(contentDir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const filePath = path.join(contentDir, fileName);
      return { filePath, fileName, raw: fs.readFileSync(filePath, "utf-8") };
    });
}

/**
 * Parses, validates, and returns every .mdx file in `config.contentDir`.
 * Shared by both factories below. Throws on the first invalid file — a
 * build must never silently ship content that failed validation.
 */
function loadRawEntries<T extends { slug: string }, TIn = T>(config: ContentTypeConfig<T, TIn>): RawEntry<T>[] {
  const files = readMdxFiles(config.contentDir);
  const entries: RawEntry<T>[] = [];
  const seenSlugs = new Map<string, string>(); // slug -> filePath, for duplicate detection

  for (const file of files) {
    const { data, content } = matter(file.raw);

    const expectedSlug = file.fileName.replace(/\.mdx$/, "");
    if (typeof data.slug === "string" && data.slug !== expectedSlug) {
      throw new Error(
        `${file.filePath}: frontmatter slug "${data.slug}" does not match the file name ` +
          `"${file.fileName}" (expected slug "${expectedSlug}"). Rename the file or fix the slug — ` +
          `they must match so a slug always maps to exactly one file.`,
      );
    }

    const parsed = config.schema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("\n");
      throw new Error(`${file.filePath}: invalid frontmatter\n${issues}`);
    }

    assertNoH1Heading(content, file.filePath);

    const frontmatter = parsed.data;
    const slug = frontmatter.slug;
    const existing = seenSlugs.get(slug);
    if (existing) {
      throw new Error(`Duplicate slug "${slug}": both ${existing} and ${file.filePath} declare it.`);
    }
    seenSlugs.set(slug, file.filePath);

    entries.push({ frontmatter, content: content.trim(), filePath: file.filePath });
  }

  return entries;
}

/**
 * Dev vs production caching policy:
 *  - In development, every call re-reads from disk (no cache) so editing
 *    an .mdx file is reflected immediately. Next's file-watcher/Fast
 *    Refresh only knows about bundled .ts/.tsx modules, not arbitrary
 *    files read via `fs` at runtime — an in-memory cache here would go
 *    stale until the dev server restarted, which fails the "edits show up
 *    immediately" requirement.
 *  - In production, content is static for the life of the build/server
 *    process (there's no admin UI writing to `content/` at runtime), so
 *    each source caches after its first read to avoid re-reading and
 *    re-validating the same files for every page during `next build`'s
 *    static generation. The cache is a plain module-level variable, one
 *    per `createContentSource`/`createSimpleContentSource` call (i.e. one
 *    per content type) — not a shared global map, so there's no risk of
 *    one type's cache holding another's stale data.
 *  - React's `cache()` was considered instead and not used: it's scoped to
 *    a single request/render, which helps de-duplicate reads *within* one
 *    page render but does nothing for `generateStaticParams` or
 *    cross-request reuse during a build — a plain module-level variable
 *    covers both.
 */
function createCache<T>() {
  let value: T | null = null;
  return {
    get: () => (IS_DEV ? null : value),
    set: (next: T) => {
      if (!IS_DEV) value = next;
      return next;
    },
  };
}

export interface ContentSource<T extends ContentFrontmatterBase> {
  /** Every entry, including drafts. For internal tooling/preview only — never render this to the public. */
  getAll(): ContentEntry<T>[];
  /** Published entries (drafts excluded), sorted per the registry config. This is what pages/sitemap/RSS should call. */
  getPublished(): ContentEntry<T>[];
  getBySlug(slug: string): ContentEntry<T> | null;
  getAllSlugs(): string[];
  /** Published AND featured, same order as getPublished(). */
  getFeatured(): ContentEntry<T>[];
  /** Published only. */
  getByCategory(category: string): ContentEntry<T>[];
  /** Published only. */
  getByTag(tag: string): ContentEntry<T>[];
}

/** For content types with dates/drafts/tags/category — column now, question/guide/case later. */
export function createContentSource<T extends ContentFrontmatterBase, TIn = T>(
  config: ContentTypeConfig<T, TIn>,
): ContentSource<T> {
  const cache = createCache<ContentEntry<T>[]>();

  function loadAll(): ContentEntry<T>[] {
    const cached = cache.get();
    if (cached) return cached;

    const raw = loadRawEntries(config);
    const entries: ContentEntry<T>[] = raw.map((entry) => ({
      frontmatter: entry.frontmatter,
      content: entry.content,
      filePath: entry.filePath,
      readingTimeMinutes: estimateReadingTimeMinutes(entry.content),
    }));

    if (config.sort?.by === "publishedAt") {
      const direction = config.sort.order === "asc" ? 1 : -1;
      entries.sort((a, b) => direction * a.frontmatter.publishedAt.localeCompare(b.frontmatter.publishedAt));
    }

    return cache.set(entries);
  }

  function published(): ContentEntry<T>[] {
    return loadAll().filter((entry) => !entry.frontmatter.draft);
  }

  return {
    getAll: loadAll,
    getPublished: published,
    getBySlug: (slug) => loadAll().find((entry) => entry.frontmatter.slug === slug) ?? null,
    getAllSlugs: () => loadAll().map((entry) => entry.frontmatter.slug),
    getFeatured: () => published().filter((entry) => entry.frontmatter.featured),
    getByCategory: (category) => published().filter((entry) => entry.frontmatter.category === category),
    getByTag: (tag) => published().filter((entry) => entry.frontmatter.tags.includes(tag)),
  };
}

/**
 * Fields `createCategorizedContentSource()` actually touches. Deliberately
 * NOT `ContentFrontmatterBase` (the column shape) — FAQ frontmatter doesn't
 * have `tags`/`featured`, so `getByTag()`/`getFeatured()` aren't offered
 * here. If a future content type needs those too, reach for
 * `createContentSource()` instead of widening this interface.
 */
interface CategorizedFrontmatterBase {
  slug: string;
  draft: boolean;
  category: string;
  publishedAt: string;
}

export interface CategorizedContentSource<T extends CategorizedFrontmatterBase> {
  getAll(): ContentEntry<T>[];
  getPublished(): ContentEntry<T>[];
  getBySlug(slug: string): ContentEntry<T> | null;
  getAllSlugs(): string[];
  getByCategory(category: string): ContentEntry<T>[];
}

/**
 * Same load/cache/sort machinery as `createContentSource()` above, sized
 * for a leaner content type (FAQ, stage 6) that doesn't have
 * `tags`/`featured` — see `CategorizedFrontmatterBase`. Not implemented by
 * calling `createContentSource()` internally and discarding two methods:
 * that would still require `T extends ContentFrontmatterBase` at the call
 * site, which is exactly the constraint FAQ's frontmatter doesn't satisfy.
 */
export function createCategorizedContentSource<T extends CategorizedFrontmatterBase, TIn = T>(
  config: ContentTypeConfig<T, TIn>,
): CategorizedContentSource<T> {
  const cache = createCache<ContentEntry<T>[]>();

  function loadAll(): ContentEntry<T>[] {
    const cached = cache.get();
    if (cached) return cached;

    const raw = loadRawEntries(config);
    const entries: ContentEntry<T>[] = raw.map((entry) => ({
      frontmatter: entry.frontmatter,
      content: entry.content,
      filePath: entry.filePath,
      readingTimeMinutes: estimateReadingTimeMinutes(entry.content),
    }));

    if (config.sort?.by === "publishedAt") {
      const direction = config.sort.order === "asc" ? 1 : -1;
      entries.sort((a, b) => direction * a.frontmatter.publishedAt.localeCompare(b.frontmatter.publishedAt));
    }

    return cache.set(entries);
  }

  function published(): ContentEntry<T>[] {
    return loadAll().filter((entry) => !entry.frontmatter.draft);
  }

  return {
    getAll: loadAll,
    getPublished: published,
    getBySlug: (slug) => loadAll().find((entry) => entry.frontmatter.slug === slug) ?? null,
    getAllSlugs: () => loadAll().map((entry) => entry.frontmatter.slug),
    getByCategory: (category) => published().filter((entry) => entry.frontmatter.category === category),
  };
}

export interface SimpleContentSource<T> {
  getAll(): SimpleEntry<T>[];
  getBySlug(slug: string): SimpleEntry<T> | null;
  getAllSlugs(): string[];
}

/** For content types with no publish date/draft/tag concept — author profiles. */
export function createSimpleContentSource<T extends { slug: string }, TIn = T>(
  config: ContentTypeConfig<T, TIn>,
): SimpleContentSource<T> {
  const cache = createCache<SimpleEntry<T>[]>();

  function loadAll(): SimpleEntry<T>[] {
    const cached = cache.get();
    if (cached) return cached;
    const raw = loadRawEntries(config);
    const entries: SimpleEntry<T>[] = raw.map((entry) => ({
      frontmatter: entry.frontmatter,
      content: entry.content,
      filePath: entry.filePath,
    }));
    return cache.set(entries);
  }

  return {
    getAll: loadAll,
    getBySlug: (slug) => loadAll().find((entry) => entry.frontmatter.slug === slug) ?? null,
    getAllSlugs: () => loadAll().map((entry) => entry.frontmatter.slug),
  };
}
