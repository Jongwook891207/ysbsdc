import { CLINIC, SITE_URL, absoluteUrl } from "./seo";
import type { BreadcrumbItem, Column, Doctor } from "./types";

/**
 * Stage 2 implements buildDentistJsonLd() now — it's the one builder
 * app/layout.tsx needs for the site-wide JSON-LD injected on every page.
 * The rest stay signatures-only until stage 5's full Article/Person/
 * Breadcrumb/FAQ system, built as pure functions (schema object in, no
 * React/DOM involved) so <JsonLd data={...}> is the only place that
 * touches serialization. Planned builders:
 *
 *  - buildPersonJsonLd(doctor)  — Person, on /doctor/[slug]
 *  - buildArticleJsonLd(column) — Article, on /column/[slug]
 *  - buildBreadcrumbJsonLd(items) — BreadcrumbList, paired with <Breadcrumb>
 *  - buildFaqJsonLd(faqs)       — FAQPage, wherever an FAQ block exists
 *
 * Parameters are prefixed with `_` and unused for now — see lib/columns.ts
 * for why.
 */

export function buildDentistJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
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
