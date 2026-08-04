/**
 * Shared content types for the site.
 *
 * These types are the contract between `lib/columns.ts` / `lib/doctors.ts`
 * (the data access layer) and everything that renders content (pages,
 * components, JSON-LD builders). The MDX-file-based implementation in
 * stage 4 and a future Sanity-backed implementation both return these same
 * shapes, so nothing above the data layer needs to know which backend is
 * in use.
 */

export type DoctorSlug = string;
export type ColumnSlug = string;
export type CategorySlug = string;

export interface Doctor {
  slug: DoctorSlug;
  name: string;
  /** e.g. "대표원장 · 치과보존과 전문의" */
  title: string;
  photo: string;
  /** short list, most recent/prominent first */
  education: string[];
  career: string[];
  specialties: string[];
  /** doctor's own words — used on /doctor/[slug] and Person JSON-LD "description" */
  philosophy: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description?: string;
}

export interface ColumnFrontmatter {
  title: string;
  slug: ColumnSlug;
  summary: string;
  description: string;
  publishedAt: string; // ISO 8601 date
  updatedAt?: string; // ISO 8601 date
  thumbnail: string;
  category: CategorySlug;
  tags: string[];
  /** references Doctor.slug */
  author: DoctorSlug;
  featured?: boolean;
  /** set true to exclude from all public listings/sitemap/RSS while still buildable for preview */
  draft?: boolean;
}

export interface Column extends ColumnFrontmatter {
  /** raw MDX body, pre-compile — used for reading time, excerpting, RSS */
  content: string;
  readingTimeMinutes: number;
}

export interface ColumnWithRelations extends Column {
  authorDoctor: Doctor;
  relatedColumns: Column[];
  previousColumn: Column | null;
  nextColumn: Column | null;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ColumnListFilters {
  page?: number;
  pageSize?: number;
  author?: DoctorSlug;
  category?: CategorySlug;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
