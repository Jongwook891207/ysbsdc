import type { Doctor, DoctorSlug } from "./types";

/**
 * Data access layer for doctors — same "swap the body, keep the signature"
 * contract as lib/columns.ts. Stage 4 implements these against
 * /content/doctors/*.mdx (or .json — doctor profiles change far less
 * often than columns, so a plain data file is likely enough; decide in
 * stage 4).
 *
 * Parameters are prefixed with `_` and unused for now — see lib/columns.ts
 * for why.
 */

export async function getAllDoctors(): Promise<Doctor[]> {
  throw new Error("Not implemented until stage 4.");
}

export async function getDoctorBySlug(_slug: DoctorSlug): Promise<Doctor | null> {
  throw new Error("Not implemented until stage 4.");
}

export async function getAllDoctorSlugs(): Promise<DoctorSlug[]> {
  throw new Error("Not implemented until stage 4.");
}
