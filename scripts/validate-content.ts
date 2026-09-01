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
import {
  faqSource,
  validateFaqAuthorReferences,
  validateFaqRelatedColumnSlugs,
  validateFaqRelatedTreatmentSlugs,
} from "../lib/content/sources/faq";
import { TREATMENT_ANCHORS } from "../lib/treatmentAnchors";
import { FAQ_CATEGORIES } from "../lib/faqCategories";
import { authorSource } from "../lib/content/sources/authors";
import { paginate, parsePageParam } from "../lib/pagination";
import { getCategoryCounts, getIndexableCategories, getTagCounts } from "../lib/taxonomy";
import { getRelatedColumns } from "../lib/related";
import { extractShortAnswer, ShortAnswerExtractionError } from "../lib/extractShortAnswer";
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
// Deliberately NOT asserting a specific total count or exact slug list here
// (e.g. "exactly 9 published", "exactly 11 total"). Those numbers only ever
// reflected how many columns existed the day this section was written —
// content/columns/ is meant to keep growing via /칼럼쓰기 and
// /학술칼럼쓰기, and a hardcoded count/list would fail on every legitimate
// new column. The checks below assert real invariants instead: every
// published entry is actually draft:false, the two long-standing draft
// fixtures (implant-guide, denture-care-basics — see their own file
// comments) stay excluded from getPublished() and stay loadable via
// getBySlug()/getAll(), and getAll() is always a superset of getPublished().
check("getPublished() contains only draft:false entries and excludes the known draft samples", () => {
  const published = columnSource.getPublished();
  assert(published.length > 0, "expected content/columns/ to have at least one published entry");
  for (const entry of published) {
    assert(entry.frontmatter.draft === false, `getPublished() returned a draft entry: ${entry.filePath}`);
  }
  const publishedSlugs = new Set(published.map((entry) => entry.frontmatter.slug));
  assert(!publishedSlugs.has("implant-guide"), "expected the known draft sample implant-guide to stay excluded from getPublished()");
  assert(!publishedSlugs.has("denture-care-basics"), "expected the known draft sample denture-care-basics to stay excluded from getPublished()");
});
check("getAll() is a superset of getPublished() and still includes both known draft samples", () => {
  const all = columnSource.getAll();
  const allSlugs = new Set(all.map((entry) => entry.frontmatter.slug));
  for (const entry of columnSource.getPublished()) {
    assert(allSlugs.has(entry.frontmatter.slug), `getAll() is missing a published entry present in getPublished(): ${entry.frontmatter.slug}`);
  }
  assert(allSlugs.has("implant-guide"), "expected getAll() to still include the draft sample implant-guide");
  assert(allSlugs.has("denture-care-basics"), "expected getAll() to still include the draft sample denture-care-basics");
  assert(all.length > columnSource.getPublished().length, "expected getAll() to include at least the two known drafts in addition to every published entry");
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
check("getByCategory() only returns published entries and matches the category, for every real category", () => {
  const realCategories = new Set(columnSource.getAll().map((entry) => entry.frontmatter.category));
  for (const category of realCategories) {
    for (const entry of columnSource.getByCategory(category)) {
      assert(entry.frontmatter.draft === false, `getByCategory("${category}") returned a draft entry: ${entry.filePath}`);
      assert(entry.frontmatter.category === category, `getByCategory("${category}") returned a mismatched category entry: ${entry.filePath}`);
    }
  }
});
// The draft-exclusion proof above only checks entries getByCategory()/
// getByTag() actually return — an empty result vacuously satisfies "every
// returned entry is published" without proving exclusion is active. This
// used to be proven with a real draft column's category/tag ("implant"/
// "denture"/"틀니"), but that only works as long as no real published
// column ever reuses those values — exactly the assumption that broke once
// a real column legitimately used tag "틀니". Fixed the same way the
// content-count assumptions were removed earlier: an isolated temp fixture
// proves the exclusion directly, independent of what real content exists.
check("getByCategory()/getByTag() actively exclude a draft entry, not just vacuously return nothing", () => {
  withTempDir(
    {
      "draft-only.mdx": validFrontmatterWithDraft(true, {
        slug: "draft-only",
        category: "검증용-draft-category",
      }).replace("---\n\n## 검증용 소제목", 'tags: ["검증용-draft-tag"]\n---\n\n## 검증용 소제목'),
    },
    (dir) => {
      const tempColumns = createContentSource(tempColumnConfig(dir));
      assert(
        tempColumns.getByCategory("검증용-draft-category").length === 0,
        "expected a category used only by a draft entry to return 0 published entries",
      );
      assert(
        tempColumns.getByTag("검증용-draft-tag").length === 0,
        "expected a tag used only by a draft entry to return 0 published entries",
      );
    },
  );
});
check("getByTag() only returns published entries and includes the queried tag, for every real tag", () => {
  const realTags = new Set(columnSource.getAll().flatMap((entry) => entry.frontmatter.tags));
  for (const tag of realTags) {
    for (const entry of columnSource.getByTag(tag)) {
      assert(entry.frontmatter.draft === false, `getByTag("${tag}") returned a draft entry: ${entry.filePath}`);
      assert(entry.frontmatter.tags.includes(tag), `getByTag("${tag}") returned an entry not actually tagged "${tag}": ${entry.filePath}`);
    }
  }
});
check("getFeatured() only returns published + featured entries", () => {
  for (const entry of columnSource.getFeatured()) {
    assert(entry.frontmatter.featured === true, `getFeatured() returned a non-featured entry: ${entry.filePath}`);
    assert(entry.frontmatter.draft === false, `getFeatured() returned a draft entry: ${entry.filePath}`);
  }
  assert(
    columnSource.getFeatured().some((entry) => entry.frontmatter.slug === "why-we-recommend-second-opinions"),
    "expected why-we-recommend-second-opinions to still be among the featured entries",
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

console.log("\nreal content/faq:");
// Deliberately NOT asserting a specific total count (e.g. "exactly 20").
// That number only ever reflected how many FAQs existed the day this
// section was written — content/faq/ is meant to keep growing (see the
// /칼럼쓰기 + /학술칼럼쓰기 FAQ-derivation workflow), and a hardcoded count
// here would fail on every legitimate future addition. The checks below
// assert real invariants instead: valid category, resolvable references,
// a working extractShortAnswer(), no exact duplicates, and the
// still-current "no FAQ has its own URL yet" product boundary.
check("at least one published FAQ exists", () => {
  assert(faqSource.getPublished().length > 0, "expected content/faq/ to have at least one published entry");
});
check("every FAQ category slug is one of the 9 known categories", () => {
  const knownSlugs = new Set(FAQ_CATEGORIES.map((c) => c.slug));
  for (const entry of faqSource.getPublished()) {
    assert(knownSlugs.has(entry.frontmatter.category), `unexpected FAQ category "${entry.frontmatter.category}" in ${entry.filePath}`);
  }
});
check("getByCategory() only returns published entries and matches the category", () => {
  for (const { slug } of FAQ_CATEGORIES) {
    for (const entry of faqSource.getByCategory(slug)) {
      assert(entry.frontmatter.draft === false, `getByCategory("${slug}") returned a draft entry: ${entry.filePath}`);
      assert(entry.frontmatter.category === slug, `getByCategory("${slug}") returned a mismatched category entry: ${entry.filePath}`);
    }
  }
});
check("all FAQs' authorSlug resolve to a real author", () => {
  validateFaqAuthorReferences();
});
check("all FAQs' relatedTreatmentSlugs resolve to a real /treatment anchor", () => {
  validateFaqRelatedTreatmentSlugs();
});
check("all FAQs' relatedColumnSlugs resolve to a real column file", () => {
  validateFaqRelatedColumnSlugs();
});
check("no published FAQ exposes a draft column as a visible relatedColumn link", () => {
  const publishedColumnSlugs = new Set(columnSource.getPublished().map((c) => c.frontmatter.slug));
  for (const entry of faqSource.getPublished()) {
    for (const slug of entry.frontmatter.relatedColumnSlugs) {
      const column = columnSource.getBySlug(slug);
      if (column && !publishedColumnSlugs.has(slug)) {
        // The reference itself is legitimate (natural authoring order —
        // see checkFaqRelatedColumnSlugs). What must never happen is a
        // *rendered* page treating it as visible: app/faq/[category]/page.tsx
        // must filter relatedColumnSlugs down to published columns before
        // building the link list. This check can't inspect the rendered
        // JSX directly, so it asserts the underlying fact that page relies
        // on: the column is genuinely a draft, which the render-time filter
        // (column.frontmatter.draft) excludes it on.
        assert(column.frontmatter.draft === true, `${entry.filePath}: relatedColumnSlugs "${slug}" is unpublished but not marked draft — inconsistent state`);
      }
    }
  }
});
check("extractShortAnswer() succeeds on every real FAQ body without throwing", () => {
  for (const entry of faqSource.getPublished()) {
    const answer = extractShortAnswer(entry.content, entry.filePath);
    assert(answer.length > 0, `expected a non-empty short answer for ${entry.filePath}`);
    assert(answer.length < 400, `expected a genuinely short (1-2 sentence) answer for ${entry.filePath}, got ${answer.length} chars — check the opening paragraph isn't the whole body`);
  }
});
check("no two FAQs share an exact-duplicate question/alias (normalized)", () => {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "").replace(/[?？.!！,、]/g, "");
  const seen = new Map<string, string>(); // normalized text -> filePath
  for (const entry of faqSource.getAll()) {
    const texts = [entry.frontmatter.question, ...entry.frontmatter.aliases];
    for (const text of texts) {
      const key = normalize(text);
      const existing = seen.get(key);
      if (existing && existing !== entry.filePath) {
        throw new Error(
          `Exact-duplicate FAQ question/alias "${text}" in both ${existing} and ${entry.filePath}. ` +
            `Connect the new column to the existing FAQ's relatedColumnSlugs instead of creating a second FAQ.`,
        );
      }
      seen.set(key, entry.filePath);
    }
  }
});
check("promote defaults to false and no FAQ is promoted to an individual URL yet", () => {
  for (const entry of faqSource.getAll()) {
    assert(entry.frontmatter.promote === false, `expected promote: false for ${entry.filePath} — no FAQ has its own URL in this project yet`);
  }
});

/** validFrontmatter() always quotes its overrides (they're all strings elsewhere in this file) — draft needs a real YAML boolean, so build it by splicing an unquoted line into the base block instead. */
function validFrontmatterWithDraft(draft: boolean, overrides: Record<string, string> = {}): string {
  const base = validFrontmatter(overrides);
  return base.replace(/^---\n/, `---\ndraft: ${draft}\n`);
}

console.log("\nfixture: FAQ relatedColumn draft-visibility (mirrors app/faq/[category]/page.tsx's render filter)");
check("a draft column referenced by relatedColumnSlugs is excluded from the visible-link filter", () => {
  withTempDir({ "draft-column.mdx": validFrontmatterWithDraft(true, { slug: "draft-column" }) }, (dir) => {
    const tempColumns = createContentSource(tempColumnConfig(dir));
    const relatedColumnSlugs = ["draft-column"];
    // Same predicate as app/faq/[category]/page.tsx's relatedColumns filter —
    // this fixture exists so that predicate has an explicit regression test,
    // since the page itself (a React Server Component) isn't exercised by
    // this script.
    const visible = relatedColumnSlugs
      .map((slug) => tempColumns.getBySlug(slug))
      .filter((column): column is NonNullable<typeof column> => column !== null && !column.frontmatter.draft);
    assert(visible.length === 0, "expected a draft column to be excluded from the visible relatedColumn link list");
  });
});
check("the same column becomes visible once its draft flag is published (draft: false)", () => {
  withTempDir({ "published-column.mdx": validFrontmatterWithDraft(false, { slug: "published-column" }) }, (dir) => {
    const tempColumns = createContentSource(tempColumnConfig(dir));
    const relatedColumnSlugs = ["published-column"];
    const visible = relatedColumnSlugs
      .map((slug) => tempColumns.getBySlug(slug))
      .filter((column): column is NonNullable<typeof column> => column !== null && !column.frontmatter.draft);
    assert(visible.length === 1, "expected a published column to appear in the visible relatedColumn link list — no FAQ edit should be required");
  });
});

console.log("\nfixture: extractShortAnswer() structural robustness");
check("extracts the plain-text opening paragraph, stripped of inline markdown", () => {
  const answer = extractShortAnswer("**굵은** 문장으로 시작합니다.\n\n다음 문단은 무시됩니다.");
  assert(answer === "굵은 문장으로 시작합니다.", `expected inline markdown stripped and only the first paragraph, got "${answer}"`);
});
check("joins a multi-line opening paragraph into one string", () => {
  const answer = extractShortAnswer("첫 줄입니다.\n두 번째 줄입니다.\n\n둘째 문단.");
  assert(answer === "첫 줄입니다. 두 번째 줄입니다.", `expected both lines joined, got "${answer}"`);
});
check("skips leading blank lines before the first paragraph", () => {
  const answer = extractShortAnswer("\n\n   \n실제 답변입니다.");
  assert(answer === "실제 답변입니다.", `expected leading blank lines skipped, got "${answer}"`);
});
expectThrow("throws (not silently guesses) when the body opens with a heading", () => {
  extractShortAnswer("## 소제목\n\n본문입니다.", "(fixture)");
});
expectThrow("throws when the body opens with a horizontal rule", () => {
  extractShortAnswer("---\n\n본문입니다.", "(fixture)");
});
expectThrow("throws when the body opens with an MDX/JSX component tag", () => {
  extractShortAnswer("<Callout title=\"안내\">내용</Callout>\n\n본문입니다.", "(fixture)");
});
expectThrow("throws when the body has no content at all", () => {
  extractShortAnswer("   \n\n  ", "(fixture)");
});
check("ShortAnswerExtractionError is the concrete error type thrown", () => {
  try {
    extractShortAnswer("## 제목만 있음", "(fixture)");
    throw new Error("expected extractShortAnswer to throw");
  } catch (error) {
    assert(error instanceof ShortAnswerExtractionError, `expected a ShortAnswerExtractionError, got ${error instanceof Error ? error.constructor.name : typeof error}`);
  }
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
