import type { TocItem } from "@/lib/toc";

/**
 * Server Component — native `<details>/<summary>` gives a free, zero-JS
 * collapsible on mobile (`open` by default so it reads as expanded on
 * every viewport); desktop layering (sticky sidebar) is pure CSS on top of
 * the same markup. No scroll-spy this stage.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="column-toc" aria-label="목차">
      <details open>
        <summary>목차</summary>
        <ol>
          {items.map((item) => (
            <li key={item.id} data-level={item.level}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
