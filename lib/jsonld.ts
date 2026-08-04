import { CLINIC, SITE_URL, absoluteUrl } from "./seo";
import type { BreadcrumbItem, Column, Doctor } from "./types";

/**
 * Every builder here returns a bare entity object — no `@context` — so any
 * combination of them can be dropped into a single `@graph` via
 * buildGraph(). Fixed `@id`s (per the approved architecture) so entities
 * can reference each other instead of repeating themselves:
 *
 *  - Dentist:        `${SITE_URL}/#dentist`
 *  - 김종욱 원장:      `${SITE_URL}/doctor/kim-jongwook#person`
 *  - Article (per glob): `${canonicalUrl}#article`
 *  - Breadcrumb:      `${canonicalUrl}#breadcrumb`
 *  - FAQPage:         `${canonicalUrl}#faq`
 *
 * buildDentistJsonLd() outputs the *complete* entity — per the architecture,
 * only the homepage (or a future hospital-intro page) should render it in
 * full; other pages should reference it by `@id` (e.g.
 * `publisher: { "@id": "${SITE_URL}/#dentist" }`) once they have their own
 * JSON-LD (stage 4/5). buildPersonJsonLd/buildArticleJsonLd/
 * buildBreadcrumbJsonLd stay signatures-only until stage 4/5 build the
 * column/doctor pages that need them.
 */

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

/** FAQPage — `mainEntity` is one `Question`/`acceptedAnswer` pair per item. */
export function buildFaqJsonLd(items: FaqItem[], canonicalUrl: string): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
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

export function buildDentistJsonLd(): Record<string, unknown> {
  return {
    "@type": ["Dentist", "MedicalBusiness"],
    "@id": `${SITE_URL}/#dentist`,
    name: CLINIC.name,
    url: SITE_URL,
    telephone: CLINIC.telephone,
    priceRange: "$",
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Tuesday",
        opens: "18:00",
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
    founder: {
      "@type": "Physician",
      name: CLINIC.founder,
      medicalSpecialty: "Dentistry - Endodontics",
    },
    image: absoluteUrl("/images/building.png"),
  };
}

export function buildPersonJsonLd(_doctor: Doctor): Record<string, unknown> {
  throw new Error("Not implemented until stage 5.");
}

export function buildArticleJsonLd(
  _column: Column,
  _author: Doctor,
): Record<string, unknown> {
  throw new Error("Not implemented until stage 5.");
}

export function buildBreadcrumbJsonLd(
  _items: BreadcrumbItem[],
): Record<string, unknown> {
  throw new Error("Not implemented until stage 5.");
}
