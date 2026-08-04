import type { Metadata } from "next";
import type { Column, Doctor } from "./types";

/**
 * Stage 1: signatures only. Stage 5 implements these using the Metadata API
 * (title/description/canonical/OG/Twitter), sourced from each page's own
 * content instead of hand-written <meta> tags. Every dynamic route
 * (/column/[slug], /doctor/[slug]) calls one of these from its
 * `generateMetadata` export.
 *
 * Parameters are prefixed with `_` and unused for now — see lib/columns.ts
 * for why.
 */

export function buildColumnMetadata(_column: Column, _author: Doctor): Metadata {
  throw new Error("Not implemented until stage 5.");
}

export function buildDoctorMetadata(_doctor: Doctor): Metadata {
  throw new Error("Not implemented until stage 5.");
}
