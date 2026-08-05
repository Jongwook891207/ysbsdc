import Link from "next/link";
import type { PaginationResult } from "@/lib/pagination";

type PaginationSummary = Pick<
  PaginationResult<unknown>,
  "currentPage" | "totalPages" | "hasPrevious" | "hasNext" | "previousPage" | "nextPage"
>;

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

/**
 * Plain `<Link>`s only — no client-side state, so this stays a Server
 * Component (matches stage 4-5's "no Client Component needed" guidance).
 * `basePath` is the list's own root URL with no `/page/N` suffix (e.g.
 * "/column" or "/column/category/implant") — pageHref() appends `/page/N`
 * for every page after the first, matching the "`/column/page/1` doesn't
 * exist" URL policy the route pages enforce (redirecting there instead).
 *
 * Renders every page number rather than a windowed/ellipsis range — the
 * column hub's content volume is small enough that this is simpler and
 * clearer than building windowing logic for a problem that doesn't exist
 * yet ("과하지 않게"). Revisit if totalPages ever gets large.
 */
export function Pagination({ pagination, basePath }: { pagination: PaginationSummary; basePath: string }) {
  if (pagination.totalPages <= 1) return null;

  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);

  return (
    <nav className="column-pagination" aria-label="페이지 네비게이션">
      <ul>
        <li>
          {pagination.hasPrevious && pagination.previousPage !== null ? (
            <Link href={pageHref(basePath, pagination.previousPage)} rel="prev">
              이전
            </Link>
          ) : (
            <span aria-disabled="true">이전</span>
          )}
        </li>
        {pages.map((page) =>
          page === pagination.currentPage ? (
            <li key={page}>
              <span aria-current="page">{page}</span>
            </li>
          ) : (
            <li key={page}>
              <Link href={pageHref(basePath, page)}>{page}</Link>
            </li>
          ),
        )}
        <li>
          {pagination.hasNext && pagination.nextPage !== null ? (
            <Link href={pageHref(basePath, pagination.nextPage)} rel="next">
              다음
            </Link>
          ) : (
            <span aria-disabled="true">다음</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
