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

console.log("Content data layer validation\n");

console.log("real content/columns:");
check("getPublished() excludes the draft sample", () => {
  const published = columnSource.getPublished();
  assert(published.length === 1, `expected 1 published entry, got ${published.length}`);
  assert(published[0]?.frontmatter.slug === "implant-guide", "expected implant-guide to be the published one");
});
check("getAll() includes the draft sample", () => {
  const all = columnSource.getAll();
  assert(all.length === 2, `expected 2 total entries (1 published + 1 draft), got ${all.length}`);
});
check("getBySlug() can still load the draft directly", () => {
  const draft = columnSource.getBySlug("denture-care-basics");
  assert(draft !== null, "expected denture-care-basics to be loadable by slug");
  assert(draft?.frontmatter.draft === true, "expected denture-care-basics to be marked draft: true");
});
check("getBySlug() returns null for a nonexistent slug", () => {
  assert(columnSource.getBySlug("does-not-exist") === null, "expected null for an unknown slug");
});
check("getByCategory()/getByTag() only return published entries", () => {
  assert(
    columnSource.getByCategory("denture").length === 0,
    "the only \"denture\" entry is a draft — getByCategory should return 0",
  );
  assert(columnSource.getByCategory("implant").length === 1, "expected 1 published entry in category \"implant\"");
  assert(columnSource.getByTag("틀니").length === 0, "the only column tagged \"틀니\" is a draft — getByTag should return 0");
});
check("getFeatured() only returns published + featured entries", () => {
  const featured = columnSource.getFeatured();
  assert(featured.length === 1 && featured[0]?.frontmatter.slug === "implant-guide", "expected only implant-guide");
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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
