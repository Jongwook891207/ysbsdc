/**
 * Content data layer validation (stage 4-1) — `npm run validate:content`.
 *
 * Chosen over a Vitest suite per the "simpler, fewer dependencies at this
 * project's current scale" guidance: this is a single script with zero new
 * runtime dependencies (only `tsx`, dev-only, to execute it), no test
 * framework config, and it's exactly as capable of asserting/failing loudly
 * as a unit test would be for what's being checked here. Revisit this
 * choice if the content layer's test surface grows enough that Vitest's
 * watch mode / isolated fixtures / parallelism start paying for themselves.
 *
 * Negative-path scenarios (duplicate slug, invalid frontmatter, H1 in body,
 * sort order) run against temporary fixture files created under the OS
 * temp dir and deleted after each check — nothing bad is ever committed to
 * content/columns.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createContentSource } from "../lib/content/loader";
import { contentFrontmatterSchema } from "../lib/content/schemas";
import type { ContentFrontmatterInput, ContentFrontmatterOutput } from "../lib/content/schemas";
import {
  checkAuthorReferences,
  checkRelatedTreatmentSlugs,
  columnSource,
  validateColumnAuthorReferences,
  validateColumnRelatedTreatmentSlugs,
} from "../lib/content/sources/columns";
import { TREATMENT_ANCHORS } from "../lib/treatmentAnchors";
import { authorSource } from "../lib/content/sources/authors";
import { paginate, parsePageParam } from "../lib/pagination";
import { getCategoryCounts, getIndexableCategories, getTagCounts } from "../lib/taxonomy";
import { getRelatedColumns } from "../lib/related";
import type { ContentTypeConfig } from "../lib/content/registry";
import type { ColumnEntry } from "../lib/content/types";

let passed = 0;
let failed = 0;

function check(label: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ok    ${label}`);
  } catch (error) {
    failed++;
    console.error(`  FAIL  ${label}`);
    console.error(`        ${error instanceof Error ? error.message : String(error)}`);
  }
}

function expectThrow(label: string, fn: () => void): void {
  check(label, () => {
    try {
      fn();
    } catch {
      return;
    }
    throw new Error("expected this to throw, but it completed without error");
  });
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function withTempDir(files: Record<string, string>, run: (dir: string) => void): void {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "validate-content-"));
  try {
    for (const [name, body] of Object.entries(files)) {
      fs.writeFileSync(path.join(dir, name), body, "utf-8");
    }
    run(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function tempColumnConfig(contentDir: string): ContentTypeConfig<ContentFrontmatterOutput, ContentFrontmatterInput> {
  return {
    key: "column",
    routeSegment: "/column",
    contentDir,
    label: "검증용 임시 콘텐츠",
    schema: contentFrontmatterSchema,
    sort: { by: "publishedAt", order: "desc" },
    pageSize: 12,
    hasDrafts: true,
  };
}

/** A minimal, valid column frontmatter block — override just the field(s) a test cares about. */
function validFrontmatter(overrides: Record<string, string> = {}): string {
  const base: Record<string, string> = {
    title: "검증용 샘플 제목",
    slug: "fixture-sample",
    summary: "검증용 샘플 요약입니다.",
    description: "검증용 샘플 설명입니다.",
    publishedAt: "2026-01-01",
    authorSlug: "kim-jongwook",
    category: "general",
    thumbnail: "/images/consult.png",
    ...overrides,
  };
  const lines = Object.entries(base).map(([key, value]) => `${key}: "${value}"`);
  return `---\n${lines.join("\n")}\n---\n\n## 검증용 소제목\n\n검증용 본문입니다.\n`;
}

/** A minimal, valid ColumnEntry — override just the field(s) a test cares about. */
function makeFixtureEntry(overrides: Partial<ColumnEntry["frontmatter"]> & { slug: string }): ColumnEntry {
  const frontmatter: ColumnEntry["frontmatter"] = {
    title: `픽스처 ${overrides.slug}`,
    summary: "픽스처 요약",
    description: "픽스처 설명",
    publishedAt: "2026-01-01",
    authorSlug: "kim-jongwook",
    category: "general",
    tags: [],
    thumbnail: "/images/consult.png",
    featured: false,
    draft: false,
    ...overrides,
  };
  return {
    frontmatter,
    content: "## 소제목\n\n본문",
    readingTimeMinutes: 1,
    filePath: `(fixture: ${overrides.slug})`,
  };
}

console.log("Content data layer validation\n");

console.log("real content/columns:");
check("getPublished() excludes both draft samples", () => {
  const published = columnSource.getPublished();
  const slugs = published.map((entry) => entry.frontmatter.slug).sort();
  const expected = [
    "why-we-recommend-second-opinions",
    "wisdom-tooth-extraction-anxiety",
    "dental-implant-diabetes-hypertension",
    "root-canal-crown-timing",
    "smoking-dental-implant-success",
    "cracked-tooth-diagnosis",
    "no-overtreatment-philosophy",
    "why-digital-guide-implant",
    "immediate-vs-delayed-implant-placement",
  ].sort();
  assert(published.length === 9, `expected 9 published entries, got ${published.length}`);
  assert(
    slugs.join(",") === expected.join(","),
    `expected [${expected.join(", ")}], got [${slugs.join(", ")}]`,
  );
});
check("getAll() includes every draft plus all published real columns", () => {
  const all = columnSource.getAll();
  assert(all.length === 11, `expected 11 total entries (9 published + 2 drafts), got ${all.length}`);
});
check("no-overtreatment-philosophy is published via /칼럼발행 (draft: false)", () => {
  const column = columnSource.getBySlug("no-overtreatment-philosophy");
  assert(column !== null, "expected no-overtreatment-philosophy to be loadable by slug");
  assert(column?.frontmatter.draft === false, "expected no-overtreatment-philosophy to be marked draft: false after publishing");
});
check("cracked-tooth-diagnosis is published via /칼럼발행 (draft: false)", () => {
  const column = columnSource.getBySlug("cracked-tooth-diagnosis");
  assert(column !== null, "expected cracked-tooth-diagnosis to be loadable by slug");
  assert(column?.frontmatter.draft === false, "expected cracked-tooth-diagnosis to be marked draft: false after publishing");
});
check("smoking-dental-implant-success is published via /칼럼발행 (draft: false)", () => {
  const column = columnSource.getBySlug("smoking-dental-implant-success");
  assert(column !== null, "expected smoking-dental-implant-success to be loadable by slug");
  assert(column?.frontmatter.draft === false, "expected smoking-dental-implant-success to be marked draft: false after publishing");
});
check("root-canal-crown-timing is published via /칼럼발행 (draft: false)", () => {
  const column = columnSource.getBySlug("root-canal-crown-timing");
  assert(column !== null, "expected root-canal-crown-timing to be loadable by slug");
  assert(column?.frontmatter.draft === false, "expected root-canal-crown-timing to be marked draft: false after publishing");
});
check("dental-implant-diabetes-hypertension is published via /칼럼발행 (draft: false)", () => {
  const column = columnSource.getBySlug("dental-implant-diabetes-hypertension");
  assert(column !== null, "expected dental-implant-diabetes-hypertension to be loadable by slug");
  assert(column?.frontmatter.draft === false, "expected dental-implant-diabetes-hypertension to be marked draft: false after publishing");
});
check("wisdom-tooth-extraction-anxiety is published via /칼럼발행 (draft: false)", () => {
  const column = columnSource.getBySlug("wisdom-tooth-extraction-anxiety");
  assert(column !== null, "expected wisdom-tooth-extraction-anxiety to be loadable by slug");
  assert(column?.frontmatter.draft === false, "expected wisdom-tooth-extraction-anxiety to be marked draft: false after publishing");
});
check("getBySlug() can still load a draft directly", () => {
  const draft = columnSource.getBySlug("denture-care-basics");
  assert(draft !== null, "expected denture-care-basics to be loadable by slug");
  assert(draft?.frontmatter.draft === true, "expected denture-care-basics to be marked draft: true");
});
check("implant-guide is a draft sample, excluded from getPublished()", () => {
  const draft = columnSource.getBySlug("implant-guide");
  assert(draft !== null, "expected implant-guide to still be loadable by slug (draft, not deleted)");
  assert(draft?.frontmatter.draft === true, "expected implant-guide to be marked draft: true (stage 5-3)");
});
check("getBySlug() returns null for a nonexistent slug", () => {
  assert(columnSource.getBySlug("does-not-exist") === null, "expected null for an unknown slug");
});
check("getByCategory()/getByTag() only return published entries", () => {
  assert(
    columnSource.getByCategory("denture").length === 0,
    "the only \"denture\" entry is a draft — getByCategory should return 0",
  );
  assert(columnSource.getByCategory("implant").length === 0, "implant-guide is now a draft — getByCategory(\"implant\") should return 0");
  assert(columnSource.getByCategory("진료철학").length === 2, "expected 2 published entries in category \"진료철학\"");
  assert(columnSource.getByCategory("일반진료").length === 2, "expected 2 published entries in category \"일반진료\"");
  assert(columnSource.getByTag("틀니").length === 0, "the only column tagged \"틀니\" is a draft — getByTag should return 0");
  assert(columnSource.getByTag("과잉진료").length === 2, "expected 2 published entries tagged \"과잉진료\"");
  assert(columnSource.getByTag("사랑니").length === 1, "expected 1 published entry tagged \"사랑니\"");
});
check("getFeatured() only returns published + featured entries", () => {
  const featured = columnSource.getFeatured();
  assert(
    featured.length === 1 && featured[0]?.frontmatter.slug === "why-we-recommend-second-opinions",
    "expected only why-we-recommend-second-opinions",
  );
});
check("real columns' authorSlug/reviewedBySlug all resolve to a real author", () => {
  validateColumnAuthorReferences();
});
check("real columns' relatedTreatmentSlugs all resolve to a real /treatment anchor", () => {
  validateColumnRelatedTreatmentSlugs();
});

console.log("\nreal content/authors:");
check("authorSource loads kim-jongwook", () => {
  const author = authorSource.getBySlug("kim-jongwook");
  assert(author !== null, "expected kim-jongwook.mdx to load");
  assert(author?.frontmatter.name === "김종욱", "expected frontmatter.name to be 김종욱");
});
check("authorSource.getBySlug() returns null for a nonexistent slug", () => {
  assert(authorSource.getBySlug("no-such-author") === null, "expected null for an unknown author slug");
});

console.log("\nfixture: sort order");
check("getPublished() sorts by publishedAt, newest first", () => {
  withTempDir(
    {
      "older.mdx": validFrontmatter({ slug: "older", publishedAt: "2026-01-01" }),
      "newer.mdx": validFrontmatter({ slug: "newer", publishedAt: "2026-06-01" }),
    },
    (dir) => {
      const source = createContentSource(tempColumnConfig(dir));
      const slugs = source.getPublished().map((entry) => entry.frontmatter.slug);
      assert(slugs[0] === "newer" && slugs[1] === "older", `expected [newer, older], got [${slugs.join(", ")}]`);
    },
  );
});

console.log("\nfixture: slug / file name integrity");
expectThrow("a frontmatter slug that doesn't match its file name throws", () => {
  withTempDir({ "expected-name.mdx": validFrontmatter({ slug: "different-slug" }) }, (dir) => {
    createContentSource(tempColumnConfig(dir)).getAll();
  });
});
// Note: with the filename-must-match-slug policy enforced above, two files
// can never validly declare the same slug — a mismatch always trips that
// check first. loader.ts's separate duplicate-slug Map check exists as
// defense-in-depth for if that policy is ever relaxed; what's actually
// observable today (a slug collision always throws) is what this covers.

console.log("\nfixture: author reference integrity");
expectThrow("a column referencing a nonexistent authorSlug throws", () => {
  const fakeEntry: ColumnEntry = {
    frontmatter: {
      title: "픽스처",
      slug: "fixture",
      summary: "픽스처",
      description: "픽스처",
      publishedAt: "2026-01-01",
      authorSlug: "no-such-author",
      category: "general",
      tags: [],
      thumbnail: "/images/consult.png",
      featured: false,
      draft: false,
    },
    content: "## 소제목\n\n본문",
    readingTimeMinutes: 1,
    filePath: "(fixture, no file on disk)",
  };
  checkAuthorReferences([fakeEntry], new Set(["kim-jongwook"]));
});

console.log("\nfixture: related-treatment reference integrity");
expectThrow("a column referencing a nonexistent relatedTreatmentSlugs entry throws", () => {
  const fakeEntry: ColumnEntry = {
    frontmatter: {
      title: "픽스처",
      slug: "fixture",
      summary: "픽스처",
      description: "픽스처",
      publishedAt: "2026-01-01",
      authorSlug: "kim-jongwook",
      category: "general",
      tags: [],
      thumbnail: "/images/consult.png",
      relatedTreatmentSlugs: ["no-such-treatment"],
      featured: false,
      draft: false,
    },
    content: "## 소제목\n\n본문",
    readingTimeMinutes: 1,
    filePath: "(fixture, no file on disk)",
  };
  checkRelatedTreatmentSlugs([fakeEntry], new Set(Object.keys(TREATMENT_ANCHORS)));
});

console.log("\nfixture: invalid frontmatter");
expectThrow("a missing required field (summary) throws", () => {
  withTempDir(
    {
      "bad.mdx": `---\ntitle: "제목"\nslug: "bad"\ndescription: "설명"\npublishedAt: "2026-01-01"\nauthorSlug: "kim-jongwook"\ncategory: "general"\nthumbnail: "/images/consult.png"\n---\n\n## 소제목\n\n본문\n`,
    },
    (dir) => {
      createContentSource(tempColumnConfig(dir)).getAll();
    },
  );
});
expectThrow("a malformed date (not YYYY-MM-DD) throws", () => {
  withTempDir({ "bad-date.mdx": validFrontmatter({ slug: "bad-date", publishedAt: "2026/01/01" }) }, (dir) => {
    createContentSource(tempColumnConfig(dir)).getAll();
  });
});
expectThrow("an invalid slug (uppercase/space) throws", () => {
  withTempDir({ "Bad Slug.mdx": validFrontmatter({ slug: "Bad Slug" }) }, (dir) => {
    createContentSource(tempColumnConfig(dir)).getAll();
  });
});
expectThrow("an unknown frontmatter field throws (strict schema)", () => {
  withTempDir(
    {
      "unknown-field.mdx": validFrontmatter({ slug: "unknown-field" }).replace(
        "---\n\n## 검증용 소제목",
        'notAKnownField: "oops"\n---\n\n## 검증용 소제목',
      ),
    },
    (dir) => {
      createContentSource(tempColumnConfig(dir)).getAll();
    },
  );
});
expectThrow("duplicate tags throw", () => {
  withTempDir(
    {
      "dup-tags.mdx": validFrontmatter({ slug: "dup-tags" }).replace(
        "---\n\n## 검증용 소제목",
        'tags: ["임플란트", "임플란트"]\n---\n\n## 검증용 소제목',
      ),
    },
    (dir) => {
      createContentSource(tempColumnConfig(dir)).getAll();
    },
  );
});

console.log("\nfixture: H1 in MDX body");
expectThrow("an ATX H1 (# ...) in the body throws", () => {
  withTempDir(
    { "has-h1.mdx": validFrontmatter({ slug: "has-h1" }).replace("## 검증용 소제목", "# 큰 제목\n\n## 검증용 소제목") },
    (dir) => {
      createContentSource(tempColumnConfig(dir)).getAll();
    },
  );
});
expectThrow("a JSX <h1> in the body throws", () => {
  withTempDir(
    { "has-jsx-h1.mdx": validFrontmatter({ slug: "has-jsx-h1" }).replace("## 검증용 소제목", "<h1>큰 제목</h1>\n\n## 검증용 소제목") },
    (dir) => {
      createContentSource(tempColumnConfig(dir)).getAll();
    },
  );
});
check("an H1-looking line inside a code fence does NOT throw (false-positive guard)", () => {
  withTempDir(
    {
      "h1-in-fence.mdx": validFrontmatter({ slug: "h1-in-fence" }).replace(
        "## 검증용 소제목",
        "## 검증용 소제목\n\n```md\n# this is example markdown text, not a real heading\n```",
      ),
    },
    (dir) => {
      createContentSource(tempColumnConfig(dir)).getAll();
    },
  );
});

console.log("\nfixture: pagination");
check("paginate() returns page 1 with the expected slice and flags", () => {
  const items = Array.from({ length: 5 }, (_, i) => i);
  const result = paginate(items, 1, 2);
  assert(result !== null, "expected page 1 of 5 items (perPage 2) to be valid");
  assert(JSON.stringify(result?.items) === JSON.stringify([0, 1]), `expected [0,1], got ${JSON.stringify(result?.items)}`);
  assert(result?.totalPages === 3, `expected 3 total pages, got ${result?.totalPages}`);
  assert(result?.hasPrevious === false, "page 1 must not have a previous page");
  assert(result?.hasNext === true, "page 1 of 3 must have a next page");
  assert(result?.previousPage === null, "page 1 previousPage must be null");
  assert(result?.nextPage === 2, `expected nextPage 2, got ${result?.nextPage}`);
});
check("paginate() returns the last page correctly, including a partial slice", () => {
  const items = Array.from({ length: 5 }, (_, i) => i);
  const result = paginate(items, 3, 2);
  assert(result !== null, "expected page 3 of 5 items (perPage 2) to be valid");
  assert(JSON.stringify(result?.items) === JSON.stringify([4]), `expected [4], got ${JSON.stringify(result?.items)}`);
  assert(result?.hasNext === false, "last page must not have a next page");
  assert(result?.hasPrevious === true, "last page must have a previous page");
  assert(result?.nextPage === null, "last page nextPage must be null");
});
check("paginate() returns null for a page beyond the last page", () => {
  const items = Array.from({ length: 5 }, (_, i) => i);
  assert(paginate(items, 4, 2) === null, "expected null for page 4 of only 3 total pages");
});
check("paginate() treats page 1 of an empty list as valid (empty items, 1 total page)", () => {
  const result = paginate<number>([], 1, 12);
  assert(result !== null, "expected page 1 of an empty list to be valid");
  assert(result?.totalPages === 1, `expected 1 total page for an empty list, got ${result?.totalPages}`);
  assert(result?.items.length === 0, "expected an empty items array");
});
check("paginate() returns null for page 0", () => {
  assert(paginate([1, 2, 3], 0, 2) === null, "expected null for page 0");
});

console.log("\nfixture: page param parsing");
check("parsePageParam() accepts clean positive integers", () => {
  assert(parsePageParam("2") === 2, 'expected "2" to parse to 2');
  assert(parsePageParam("15") === 15, 'expected "15" to parse to 15');
});
check("parsePageParam() rejects leading zeros, decimals, and non-numeric input", () => {
  assert(parsePageParam("01") === null, 'expected "01" to be rejected');
  assert(parsePageParam("1.5") === null, 'expected "1.5" to be rejected');
  assert(parsePageParam("abc") === null, 'expected "abc" to be rejected');
  assert(parsePageParam("-1") === null, 'expected "-1" to be rejected');
  assert(parsePageParam("0") === null, 'expected "0" to be rejected');
});

console.log("\nfixture: taxonomy (category/tag aggregation)");
check("getCategoryCounts() counts every entry exactly once across categories", () => {
  const entries = [
    makeFixtureEntry({ slug: "a", category: "implant" }),
    makeFixtureEntry({ slug: "b", category: "implant" }),
    makeFixtureEntry({ slug: "c", category: "denture" }),
    makeFixtureEntry({ slug: "d", category: "general" }),
    makeFixtureEntry({ slug: "e", category: "general" }),
  ];
  const counts = getCategoryCounts(entries);
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  assert(total === entries.length, `expected counts to sum to ${entries.length}, got ${total}`);
  assert(counts[0]?.count === 2, `expected the most-populous category to have count 2, got ${counts[0]?.count}`);
});
check("getIndexableCategories() only returns categories at/above MIN_PUBLIC_CATEGORY_COUNT", () => {
  const entries = [
    makeFixtureEntry({ slug: "a", category: "implant" }),
    makeFixtureEntry({ slug: "b", category: "implant" }),
    makeFixtureEntry({ slug: "c", category: "implant" }),
    makeFixtureEntry({ slug: "d", category: "denture" }),
  ];
  const indexable = getIndexableCategories(entries);
  assert(
    indexable.length === 1 && indexable[0]?.category === "implant",
    `expected only "implant" (count 3) to be indexable, got ${JSON.stringify(indexable)}`,
  );
});
check("getTagCounts() counts tags across entries", () => {
  const entries = [
    makeFixtureEntry({ slug: "a", tags: ["임플란트", "가이드"] }),
    makeFixtureEntry({ slug: "b", tags: ["임플란트"] }),
  ];
  const counts = getTagCounts(entries);
  const implantCount = counts.find((t) => t.tag === "임플란트")?.count;
  assert(implantCount === 2, `expected "임플란트" tag count 2, got ${implantCount}`);
});

console.log("\nfixture: related-article scoring");
check("getRelatedColumns() excludes self, weights category over tags, and excludes score-0 results", () => {
  const current = makeFixtureEntry({ slug: "current", category: "implant", tags: ["가이드"], publishedAt: "2026-03-01" });
  const sameCategory = makeFixtureEntry({ slug: "same-category", category: "implant", tags: [], publishedAt: "2026-01-01" });
  const sameTagOnly = makeFixtureEntry({ slug: "same-tag-only", category: "denture", tags: ["가이드"], publishedAt: "2026-01-01" });
  const unrelated = makeFixtureEntry({ slug: "unrelated", category: "general", tags: ["다른태그"], publishedAt: "2026-05-01" });

  const related = getRelatedColumns(current, [current, sameCategory, sameTagOnly, unrelated]);
  const slugs = related.map((c) => c.frontmatter.slug);
  assert(!slugs.includes("current"), "related results must never include the current article itself");
  assert(!slugs.includes("unrelated"), "an article with score 0 (no shared category or tag) must be excluded");
  assert(slugs[0] === "same-category", `expected same-category article to rank first, got order [${slugs.join(", ")}]`);
});
check("getRelatedColumns() caps results at 3", () => {
  const current = makeFixtureEntry({ slug: "current", category: "implant" });
  const candidates = [
    current,
    ...Array.from({ length: 5 }, (_, i) => makeFixtureEntry({ slug: `related-${i}`, category: "implant" })),
  ];
  assert(getRelatedColumns(current, candidates).length === 3, "expected at most 3 related results");
});
check("getRelatedColumns() returns an empty array when nothing shares category/tags", () => {
  const current = makeFixtureEntry({ slug: "current", category: "implant", tags: [] });
  const candidates = [makeFixtureEntry({ slug: "other", category: "denture", tags: ["틀니"] })];
  assert(getRelatedColumns(current, candidates).length === 0, "expected no related results");
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
