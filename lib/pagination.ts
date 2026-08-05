/**
 * Content-agnostic pagination — usable by /column now, any future
 * getPublished()-shaped list (/guide, /question) later. Pure functions
 * only: no fs/data access, no routing. Route pages call `paginate()` and
 * call `notFound()` themselves when it returns null — this module never
 * redirects/404s on its own.
 */
export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousPage: number | null;
  nextPage: number | null;
}

/**
 * Slices `items` into the requested page. `totalPages` is always at least
 * 1 (even for an empty `items` array) so page 1 of an empty list is valid
 * — an empty content list should render an empty state, not 404. Returns
 * `null` for any other out-of-range or malformed page number; the caller
 * decides what to do with that (almost always `notFound()`).
 */
export function paginate<T>(items: T[], page: number, perPage: number): PaginationResult<T> | null {
  if (!Number.isInteger(page) || page < 1) return null;

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  if (page > totalPages) return null;

  const start = (page - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    currentPage: page,
    totalPages,
    totalItems,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
}

/**
 * Parses a `[page]` dynamic route segment (always a raw string) into a
 * clean positive integer — rejects leading zeros ("01"), decimals ("1.5"),
 * signs, whitespace, or anything non-numeric. Returning `null` for `"1"`
 * would be wrong here (that's a syntactically valid page number); it's up
 * to each route to decide that page 1 doesn't belong under `/page/1` and
 * redirect to its unparameterized URL instead — this function only
 * validates the number itself.
 */
export function parsePageParam(param: string): number | null {
  if (!/^[1-9][0-9]*$/.test(param)) return null;
  return Number(param);
}
