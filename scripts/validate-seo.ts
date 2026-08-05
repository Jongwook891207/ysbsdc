/**
 * SEO/AEO structured-data validation (stage 5-1) — `npm run validate:seo`.
 *
 * Kept separate from `npm run validate:content` (per the stage brief) —
 * that script validates the content data layer itself (frontmatter/MDX);
 * this one validates what's built on top of it (JSON-LD builders,
 * sitemap, RSS, canonical URLs). Same `check`/`assert` pattern as
 * validate-content.ts for consistency, duplicated locally rather than
 * imported — the two scripts test different layers and don't need to
 * share test infrastructure.
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildColumnCollectionJsonLd,
  buildDentistJsonLd,
  buildFaqJsonLd,
  buildGraph,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  DENTIST_ID,
  personId,
} from "../lib/jsonld";
import { columnSource } from "../lib/content/sources/columns";
import { authorSource } from "../lib/content/sources/authors";
import { HOME_FAQ_ITEMS } from "../lib/homeFaq";
import { SITE_URL, absoluteUrl } from "../lib/seo";
import { escapeXml } from "../lib/xml";
import sitemap from "../app/sitemap";
import type { ColumnFrontmatter, AuthorFrontmatter } from "../lib/content/types";

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

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

/** A minimal, valid AuthorFrontmatter fixture — override just the field(s) a test cares about. */
function makeAuthor(overrides: Partial<AuthorFrontmatter> & { slug: string }): AuthorFrontmatter {
  return {
    name: `픽스처 ${overrides.slug}`,
    jobTitle: "픽스처 직함",
    profileImage: "/images/consult.png",
    bio: "픽스처 소개",
    education: [],
    career: [],
    specialties: [],
    worksFor: "연세백세치과의원",
    active: true,
    ...overrides,
  };
}

/** A minimal, valid ColumnFrontmatter fixture — override just the field(s) a test cares about. */
function makeColumn(overrides: Partial<ColumnFrontmatter> & { slug: string }): ColumnFrontmatter {
  return {
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
}

console.log("SEO/AEO structured data validation\n");

console.log("JSON-LD: serialization safety");
check("every builder's output survives JSON.stringify -> JSON.parse unchanged", () => {
  const author = makeAuthor({ slug: "fixture-author" });
  const column = makeColumn({ slug: "fixture-column", tags: ["태그1"] });
  const graph = buildGraph([
    buildDentistJsonLd(),
    buildWebSiteJsonLd(),
    buildPersonJsonLd(author),
    buildArticleJsonLd({ column, author, reviewer: null, canonicalUrl: absoluteUrl("/column/fixture-column") }),
    buildBreadcrumbJsonLd([{ label: "홈", href: "/" }], absoluteUrl("/")),
    buildFaqJsonLd([{ question: "Q", answer: "A" }], absoluteUrl("/")),
  ]);
  const roundTripped = JSON.parse(JSON.stringify(graph));
  assert(Array.isArray(roundTripped["@graph"]), "expected @graph to be an array after round-trip");
  assert(roundTripped["@graph"].length === 6, `expected 6 entities in @graph, got ${roundTripped["@graph"].length}`);
});

console.log("\nJSON-LD: @context appears once, at the top level");
check("buildGraph() puts @context only on the wrapper, never on individual entities", () => {
  const graph = buildGraph([buildDentistJsonLd(), buildWebSiteJsonLd()]) as { "@context": unknown; "@graph": Record<string, unknown>[] };
  assert(graph["@context"] === "https://schema.org", "expected @context on the graph wrapper");
  for (const entity of graph["@graph"]) {
    assert(!("@context" in entity), `entity ${JSON.stringify(entity["@type"])} must not carry its own @context`);
  }
});

console.log("\nJSON-LD: fixed @id consistency");
check("Dentist @id matches DENTIST_ID", () => {
  assert((buildDentistJsonLd() as Record<string, unknown>)["@id"] === DENTIST_ID, "Dentist @id mismatch");
});
check("Dentist founder references the Person @id, not a duplicated inline entity", () => {
  const dentist = buildDentistJsonLd() as Record<string, unknown>;
  const founder = dentist.founder as Record<string, unknown>;
  assert(founder["@id"] === personId("kim-jongwook"), "expected founder to be a bare {\"@id\": ...} reference");
  assert(Object.keys(founder).length === 1, "founder must only carry \"@id\" — no duplicated name/type fields");
});
check("Person @id matches personId(slug) for any author", () => {
  const author = makeAuthor({ slug: "some-author" });
  assert((buildPersonJsonLd(author) as Record<string, unknown>)["@id"] === personId("some-author"), "Person @id mismatch");
});
check("real authors' Person @id all resolve under the same SITE_URL", () => {
  for (const author of authorSource.getAll()) {
    const id = personId(author.frontmatter.slug);
    assert(id.startsWith(`${SITE_URL}/doctor/`), `expected ${id} to start with ${SITE_URL}/doctor/`);
    assert(id.endsWith("#person"), `expected ${id} to end with #person`);
  }
});

console.log("\nJSON-LD: Article author/publisher references");
check("Article.author references the real author's Person @id (not an inline duplicate)", () => {
  const author = makeAuthor({ slug: "jane-doe" });
  const column = makeColumn({ slug: "fixture", authorSlug: "jane-doe" });
  const article = buildArticleJsonLd({ column, author, reviewer: null, canonicalUrl: absoluteUrl("/column/fixture") }) as Record<
    string,
    unknown
  >;
  const authorRef = article.author as Record<string, unknown>;
  assert(authorRef["@id"] === personId("jane-doe"), "Article.author must reference the author's Person @id");
  assert(Object.keys(authorRef).length === 1, "Article.author must be a bare @id reference, not a duplicated entity");
});
check("Article.publisher always references DENTIST_ID", () => {
  const author = makeAuthor({ slug: "jane-doe" });
  const column = makeColumn({ slug: "fixture" });
  const article = buildArticleJsonLd({ column, author, reviewer: null, canonicalUrl: absoluteUrl("/column/fixture") }) as Record<
    string,
    unknown
  >;
  assert((article.publisher as Record<string, unknown>)["@id"] === DENTIST_ID, "Article.publisher must reference DENTIST_ID");
});
check("Article without a reviewer stays plain \"Article\" and omits reviewedBy/lastReviewed", () => {
  const author = makeAuthor({ slug: "jane-doe" });
  const column = makeColumn({ slug: "fixture" });
  const article = buildArticleJsonLd({ column, author, reviewer: null, canonicalUrl: absoluteUrl("/column/fixture") }) as Record<
    string,
    unknown
  >;
  assert(article["@type"] === "Article", `expected plain "Article", got ${JSON.stringify(article["@type"])}`);
  assert(!("reviewedBy" in JSON.parse(JSON.stringify(article))), "reviewedBy must not survive serialization when there's no reviewer");
  assert(!("lastReviewed" in JSON.parse(JSON.stringify(article))), "lastReviewed must not survive serialization when there's no reviewer");
});
check("Article WITH a real reviewer adds MedicalWebPage and reviewedBy/lastReviewed", () => {
  const author = makeAuthor({ slug: "jane-doe" });
  const reviewer = makeAuthor({ slug: "reviewer-doe" });
  const column = makeColumn({ slug: "fixture", reviewedBySlug: "reviewer-doe", lastReviewed: "2026-02-01" });
  const article = buildArticleJsonLd({ column, author, reviewer, canonicalUrl: absoluteUrl("/column/fixture") }) as Record<
    string,
    unknown
  >;
  assert(
    Array.isArray(article["@type"]) && (article["@type"] as string[]).includes("MedicalWebPage"),
    "expected [\"Article\",\"MedicalWebPage\"] when a real reviewer is present",
  );
  assert((article.reviewedBy as Record<string, unknown>)["@id"] === personId("reviewer-doe"), "reviewedBy must reference the reviewer's Person @id");
  assert(article.lastReviewed === "2026-02-01", "lastReviewed must match the frontmatter value");
});
check("dateModified falls back to datePublished when updatedAt is absent", () => {
  const author = makeAuthor({ slug: "jane-doe" });
  const column = makeColumn({ slug: "fixture", publishedAt: "2026-01-05" });
  const article = buildArticleJsonLd({ column, author, reviewer: null, canonicalUrl: absoluteUrl("/column/fixture") }) as Record<
    string,
    unknown
  >;
  assert(article.dateModified === article.datePublished, "expected dateModified === datePublished when updatedAt is unset");
});

console.log("\nJSON-LD: BreadcrumbList position order");
check("positions start at 1 and increase sequentially, matching item order", () => {
  const items = [
    { label: "홈", href: "/" },
    { label: "원장 칼럼", href: "/column" },
    { label: "implant 칼럼", href: "/column/category/implant" },
  ];
  const breadcrumb = buildBreadcrumbJsonLd(items, absoluteUrl("/column/category/implant")) as {
    itemListElement: { position: number; name: string }[];
  };
  breadcrumb.itemListElement.forEach((entry, index) => {
    assert(entry.position === index + 1, `expected position ${index + 1} at index ${index}, got ${entry.position}`);
    assert(entry.name === items[index]?.label, `expected item ${index} name to match the source Breadcrumb item`);
  });
});

console.log("\nJSON-LD: CollectionPage/ItemList never forced on an empty list");
check("buildColumnCollectionJsonLd() returns null for zero columns", () => {
  assert(
    buildColumnCollectionJsonLd({ canonicalUrl: absoluteUrl("/column"), name: "테스트", columns: [] }) === null,
    "expected null, not an empty ItemList",
  );
});

console.log("\nRSS: XML escaping");
check("escapeXml() escapes all 5 reserved characters", () => {
  const escaped = escapeXml(`<a> & "b" 'c'`);
  assert(!escaped.includes("<") && !escaped.includes(">"), "angle brackets must be escaped");
  assert(!escaped.includes('"') && !escaped.includes("'"), "quotes must be escaped");
  assert(escaped === "&lt;a&gt; &amp; &quot;b&quot; &apos;c&apos;", `unexpected escaped output: ${escaped}`);
});

console.log("\ncanonical URLs are always absolute");
check("absoluteUrl() always returns a full https:// URL", () => {
  assert(absoluteUrl("/column").startsWith("https://"), "expected an absolute https:// URL");
  assert(absoluteUrl("/column/implant-guide") === `${SITE_URL}/column/implant-guide`, "absoluteUrl must resolve against SITE_URL");
});

console.log("\nsitemap: policy checks");
const sitemapEntries = sitemap();
check("sitemap has no duplicate URLs", () => {
  const urls = sitemapEntries.map((entry) => entry.url);
  assert(new Set(urls).size === urls.length, "expected every sitemap URL to be unique");
});
check("sitemap never contains /column/page/1", () => {
  assert(!sitemapEntries.some((entry) => entry.url === `${SITE_URL}/column/page/1`), "/column/page/1 must never appear — /column IS page 1");
});
check("sitemap never contains a draft column's URL", () => {
  const draftSlugs = columnSource.getAll().filter((c) => c.frontmatter.draft).map((c) => c.frontmatter.slug);
  for (const slug of draftSlugs) {
    assert(!sitemapEntries.some((entry) => entry.url === `${SITE_URL}/column/${slug}`), `draft "${slug}" must not appear in the sitemap`);
  }
});
check("sitemap excludes categories below MIN_PUBLIC_CATEGORY_COUNT (noindex categories)", () => {
  const published = columnSource.getPublished();
  const counts = new Map<string, number>();
  for (const entry of published) counts.set(entry.frontmatter.category, (counts.get(entry.frontmatter.category) ?? 0) + 1);
  for (const [category, count] of counts) {
    const inSitemap = sitemapEntries.some((entry) => entry.url === `${SITE_URL}/column/category/${encodeURIComponent(category)}`);
    if (count < 3) {
      assert(!inSitemap, `category "${category}" has only ${count} published entr${count === 1 ? "y" : "ies"} (noindex) and must not be in the sitemap`);
    }
  }
});
check("sitemap only omits lastModified where there's no real per-entity date (static/listing routes)", () => {
  const homeEntry = sitemapEntries.find((entry) => entry.url === SITE_URL);
  assert(homeEntry !== undefined, "expected the homepage to be in the sitemap");
  assert(
    homeEntry?.lastModified === undefined,
    "the homepage has no real \"last modified\" data source and must not get a stamped new Date()",
  );
});

console.log("\nJSON-LD / OG images: every referenced file actually exists");
check("every real author's profileImage exists in public/", () => {
  for (const author of authorSource.getAll()) {
    const filePath = path.join(process.cwd(), "public", author.frontmatter.profileImage);
    assert(fs.existsSync(filePath), `${author.frontmatter.profileImage} (author "${author.frontmatter.slug}") does not exist in public/`);
  }
});
check("every published column's thumbnail exists in public/", () => {
  for (const column of columnSource.getPublished()) {
    const filePath = path.join(process.cwd(), "public", column.frontmatter.thumbnail);
    assert(fs.existsSync(filePath), `${column.frontmatter.thumbnail} (column "${column.frontmatter.slug}") does not exist in public/`);
  }
});
check("Dentist logo/image files referenced by buildDentistJsonLd() exist in public/", () => {
  const dentist = buildDentistJsonLd() as { logo: string; image: string };
  for (const url of [dentist.logo, dentist.image]) {
    const relativePath = url.replace(SITE_URL, "");
    assert(fs.existsSync(path.join(process.cwd(), "public", relativePath)), `${url} does not exist in public/`);
  }
});

console.log("\nreal home FAQ data");
check("HOME_FAQ_ITEMS produces a valid FAQPage", () => {
  const faq = buildFaqJsonLd(HOME_FAQ_ITEMS, absoluteUrl("/")) as { mainEntity: unknown[] };
  assert(faq.mainEntity.length === HOME_FAQ_ITEMS.length, "expected one Question per HOME_FAQ_ITEMS entry");
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
