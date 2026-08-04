/** Formats an ISO date string as "2026년 1월 15일". */
export function formatDateKo(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Formats an ISO date string for <time dateTime="...">. */
export function toDateTimeAttr(iso: string): string {
  return new Date(iso).toISOString();
}

/**
 * Smooth-scrolls to an in-page anchor while compensating for the sticky
 * GNB height, mirroring the offset math used in the original static
 * site's inline script (`headerH + 16px`).
 */
export function scrollToHash(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.querySelector("header.gnb");
  const headerH = header instanceof HTMLElement ? header.offsetHeight : 0;
  const top = el.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}
