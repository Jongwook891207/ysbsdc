/**
 * `Doctor`/`Category`/`ColumnFrontmatter`/`Column`/`ColumnWithRelations`/
 * `PaginatedResult`/`ColumnListFilters` (stage-1 placeholder shapes for a
 * data layer that was never built against them) removed in stage 5-1 —
 * the real content layer (`lib/content/types.ts`'s `ColumnEntry`/
 * `AuthorEntry`, `lib/pagination.ts`'s `PaginationResult`) has fully
 * replaced them since stage 4, and nothing imported these anymore
 * (confirmed via repo-wide search before deleting alongside their unused
 * consumers: components/ColumnCard.tsx, DoctorCard.tsx, RelatedColumns.tsx,
 * lib/columns.ts, lib/doctors.ts, lib/metadata.ts).
 *
 * `BreadcrumbItem` is the one shape from this file that's still real and
 * used (components/Breadcrumb.tsx, lib/jsonld.ts's buildBreadcrumbJsonLd,
 * every page that renders a breadcrumb trail).
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
}
