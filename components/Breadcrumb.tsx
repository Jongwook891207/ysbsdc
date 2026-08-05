import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/types";

/**
 * Visual only this stage — a future SEO stage pairs this with
 * lib/jsonld.ts's buildBreadcrumbJsonLd() so the visible trail and the
 * BreadcrumbList structured data always stay in sync (same array, one
 * source of truth).
 *
 * The last item is the current page: rendered as plain text with
 * `aria-current="page"`, not a link — the earlier stage-1 placeholder
 * linked every item including the current one, which is both incorrect
 * semantics and a pointless self-link.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
      <ol>
        {items.map((item, index) =>
          index === lastIndex ? (
            <li key={item.href} aria-current="page">
              {item.label}
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
