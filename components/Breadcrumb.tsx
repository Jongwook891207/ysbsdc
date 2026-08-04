import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/types";

/**
 * Stage 1: placeholder visual only. Stage 5 pairs this with
 * lib/jsonld.ts's buildBreadcrumbJsonLd() so the visible trail and the
 * BreadcrumbList structured data always stay in sync (same array, one
 * source of truth).
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
