import { CLINIC, SITE_NAME, SITE_URL, absoluteUrl } from "./seo";
import { toDateTimeAttr } from "./utils";
import type { AuthorFrontmatter, ColumnFrontmatter } from "./content/types";
import type { BreadcrumbItem } from "./types";

/**
 * JSON-LD builders (stage 3-1 skeleton, filled in stage 5-1). Every export
 * here is a pure function — no React, no data fetching, no fs access — so
 * a page collects the real objects it needs (via lib/content/sources/*,
 * already-loaded data it has in hand) and passes them in.
 *
 * Kept as one file on purpose: ids/dentist/website/person/article/
 * breadcrumb/collection/faq/graph together are a few hundred lines with a
 * lot of shared context (the fixed @id scheme below), and splitting them
 * into lib/seo/jsonld/*.ts now would mean cross-file imports for every
 * builder that references another entity's @id — more indirection for no
 * real benefit at this size. Revisit if this file's growth outpaces what
 * fits on one screen of scrolling.
 *
 * `undefined` object fields are relied on to disappear from the final
 * JSON on their own — `JSON.stringify` drops any key whose value is
 * `undefined` natively, so builders below just assign `undefined` for an
 * absent optional field instead of a manual "strip undefined keys" pass.
 *
 * ---- Fixed @id scheme (same entity == same @id, always) ----
 *  - Dentist:              `${SITE_URL}/#dentist`
 *  - WebSite:               `${SITE_URL}/#website`
 *  - Author/reviewer Person: `${SITE_URL}/doctor/{slug}#person`
 *  - Article:               `${canonicalUrl}#article`
 *  - BreadcrumbList:        `${canonicalUrl}#breadcrumb`
 *  - FAQPage:               `${canonicalUrl}#faq`
 *  - CollectionPage:        `${canonicalUrl}#collection`
 * A page with its own JSON-LD references the homepage's Dentist/WebSite
 * by `@id` rather than repeating the full entity — the complete Dentist
 * object is only ever emitted once, on the homepage (buildDentistJsonLd()).
 */

export const DENTIST_ID = `${SITE_URL}/#dentist`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personId(authorSlug: string): string {
  return `${SITE_URL}/doctor/${authorSlug}#person`;
}
export function articleId(canonicalUrl: string): string {
  return `${canonicalUrl}#article`;
}
export function breadcrumbId(canonicalUrl: string): string {
  return `${canonicalUrl}#breadcrumb`;
}
export function faqId(canonicalUrl: string): string {
  return `${canonicalUrl}#faq`;
}
export function collectionId(canonicalUrl: string): string {
  return `${canonicalUrl}#collection`;
}

/** Wraps a list of bare entities (no individual `@context`) in one `@graph` with a single top-level `@context`. */
export function buildGraph(entities: Record<string, unknown>[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": entities,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage — `mainEntity` is one `Question`/`acceptedAnswer` pair per item. Caller must only pass FAQ content that's actually visible on `canonicalUrl`. */
export function buildFaqJsonLd(items: FaqItem[], canonicalUrl: string): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    "@id": faqId(canonicalUrl),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * The complete Dentist entity — homepage-only (see the file header). Every
 * field here corresponds to something actually rendered on the site:
 *  - `priceRange` from the old stage-1 stub is dropped: nothing on the
 *    site displays a price range, so a "$" placeholder would be an
 *    invented fact, not a real one.
 *  - `geo` (lat/lng) and `sameAs` (official profile URLs) are omitted —
 *    neither exists anywhere in the codebase's verified data (CLINIC in
 *    lib/seo.ts has no coordinates or social URLs). Add them here the day
 *    real, verified values exist; don't estimate/guess them now.
 *  - `founder` references the Person entity by `@id` instead of repeating
 *    an inline Physician sub-object (the stage-1 stub's `founder: {
 *    "@type": "Physician", name, medicalSpecialty }` was a second,
 *    divergent representation of the same person buildPersonJsonLd()
 *    already models properly — exactly the "same entity, different @id"
 *    duplication this stage's brief prohibits).
 */
export function buildDentistJsonLd(): Record<string, unknown> {
  return {
    "@type": "Dentist",
    "@id": DENTIST_ID,
    name: CLINIC.name,
    url: SITE_URL,
    logo: absoluteUrl("/images/logo.png"),
    image: absoluteUrl("/images/building.png"),
    telephone: CLINIC.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.address.streetAddress,
      addressLocality: CLINIC.address.addressLocality,
      addressRegion: CLINIC.address.addressRegion,
      addressCountry: CLINIC.address.addressCountry,
    },
    hasMap: CLINIC.mapUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Tuesday",
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    amenityFeature: {
      "@type": "LocationFeatureSpecification",
      name: "건물 무료 주차",
      value: true,
    },
    founder: { "@id": personId("kim-jongwook") },
  };
}

/** WebSite — homepage-only, same as Dentist. No `potentialAction`/SearchAction: there's no site search this stage. */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ko-KR",
    publisher: { "@id": DENTIST_ID },
  };
}

/**
 * Person/Physician for an author's real profile page (`/doctor/[slug]`).
 * Only fields backed by real `content/authors/*.mdx` frontmatter:
 *  - `alumniOf`: filtered to entries that actually name a school/hospital
 *    ("대학교"/"병원" in the string) — `education` also contains board
 *    certifications ("보건복지부 인증 치과보존과 전문의") that aren't an
 *    institution one is an alumnus of; those are left out rather than
 *    mis-modeled as EducationalOrganization.
 *  - `knowsAbout` (not `medicalSpecialty`): `specialties` is free-text
 *    Korean ("미세 신경치료 (치과보존과 전문)"), not a value from
 *    schema.org's MedicalSpecialty enumeration — `knowsAbout` accepts
 *    free text/Thing and doesn't misrepresent it as a controlled value.
 *  - `sameAs` omitted: no verified official profile URL exists in the
 *    author's frontmatter.
 */
export function buildPersonJsonLd(author: AuthorFrontmatter): Record<string, unknown> {
  const alumniOf = author.education.filter((entry) => entry.includes("대학교") || entry.includes("병원"));

  return {
    "@type": ["Person", "Physician"],
    "@id": personId(author.slug),
    name: author.name,
    jobTitle: author.jobTitle,
    image: absoluteUrl(author.profileImage),
    url: absoluteUrl(`/doctor/${author.slug}`),
    worksFor: { "@id": DENTIST_ID },
    alumniOf:
      alumniOf.length > 0 ? alumniOf.map((name) => ({ "@type": "EducationalOrganization", name })) : undefined,
    knowsAbout: author.specialties.length > 0 ? author.specialties : undefined,
  };
}

/**
 * BreadcrumbList — takes the exact same `BreadcrumbItem[]` a page already
 * passes to `<Breadcrumb items={...}>` (components/Breadcrumb.tsx), so the
 * visible trail and this structured data can never drift apart; no
 * separate hardcoded label/href list.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], canonicalUrl: string): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(canonicalUrl),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

/**
 * Article (+ MedicalWebPage when genuinely reviewed) for `/column/[slug]`.
 *
 * `dateModified` policy: if `updatedAt` is set, use it; otherwise
 * `dateModified` == `datePublished`. Stated explicitly per the stage
 * brief's request for a policy, not left ambiguous: "never updated since
 * publish" is itself a true, meaningful fact — omitting the field
 * entirely would just make consumers guess, and setting it equal to
 * datePublished is the standard convention for "no revision yet."
 *
 * `lastReviewed`/`reviewedBy` are NOT put on Article — schema.org doesn't
 * define either property there. Both genuinely exist on `WebPage`
 * (schema.org's own E-A-T-oriented additions), so when a column has a
 * real reviewer (`reviewedBySlug` + `lastReviewed` both set — the schema
 * in lib/content/schemas.ts already requires them together), this adds
 * `MedicalWebPage` (a WebPage subtype, appropriate since the content is
 * dental/medical) as a second `@type` alongside `Article` — a single
 * entity can legitimately carry both sets of properties. When there's no
 * reviewer, the type stays plain `Article` and neither field is emitted.
 * `MedicalWebPage` is added for what it actually models (a reviewed
 * medical content page), never as a ranking/rich-result claim.
 */
export function buildArticleJsonLd({
  column,
  author,
  reviewer,
  canonicalUrl,
}: {
  column: ColumnFrontmatter;
  author: AuthorFrontmatter;
  reviewer: AuthorFrontmatter | null;
  canonicalUrl: string;
}): Record<string, unknown> {
  const isReviewed = Boolean(reviewer && column.reviewedBySlug && column.lastReviewed);

  return {
    "@type": isReviewed ? ["Article", "MedicalWebPage"] : "Article",
    "@id": articleId(canonicalUrl),
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    headline: column.title,
    description: column.description,
    image: absoluteUrl(column.thumbnail),
    datePublished: toDateTimeAttr(column.publishedAt),
    dateModified: toDateTimeAttr(column.updatedAt ?? column.publishedAt),
    author: { "@id": personId(author.slug) },
    reviewedBy: isReviewed ? { "@id": personId((reviewer as AuthorFrontmatter).slug) } : undefined,
    lastReviewed: isReviewed ? column.lastReviewed : undefined,
    publisher: { "@id": DENTIST_ID },
    articleSection: column.category,
    keywords: column.tags.length > 0 ? column.tags.join(", ") : undefined,
    inLanguage: "ko-KR",
  };
}

/**
 * CollectionPage + ItemList for a column listing page (`/column`,
 * `/column/page/[n]`, `/column/category/[slug]`, and their paginated
 * variants) — `columns` must already be exactly what's displayed on
 * `canonicalUrl` (published-only, already paginated/filtered by the
 * caller); this never re-fetches or re-filters.
 *
 * `position` restarts at 1 on every page — it describes "the Nth item
 * shown on THIS page," not a global position across the whole column
 * archive (both are defensible per the stage brief; this one was picked
 * because it matches what a reader actually sees on one page/one
 * ItemList, without needing every page to know its absolute offset into
 * the full published list).
 *
 * Returns `null` for an empty list — an empty ItemList is never forced
 * out just to have JSON-LD on the page (an empty CollectionPage without
 * items would be a hollow structured-data claim about content that isn't
 * there).
 */
export function buildColumnCollectionJsonLd({
  canonicalUrl,
  name,
  columns,
}: {
  canonicalUrl: string;
  name: string;
  columns: Pick<ColumnFrontmatter, "slug" | "title">[];
}): Record<string, unknown> | null {
  if (columns.length === 0) return null;

  return {
    "@type": "CollectionPage",
    "@id": collectionId(canonicalUrl),
    url: canonicalUrl,
    name,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: columns.map((column, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/column/${column.slug}`),
        name: column.title,
      })),
    },
  };
}
