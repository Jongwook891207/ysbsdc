"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent, type FocusEvent, type MouseEvent } from "react";
import { NAV_ENTRIES, isNavActive, sameRouteHashTarget } from "@/lib/nav";
import { scrollToHash } from "@/lib/utils";

/**
 * Desktop GNB menu (`nav.gnb-menu`), hidden below 960px via globals.css —
 * MobileNav takes over there. Dropdown reveal stays CSS-driven
 * (`:hover` / `:focus-within` on `.gnb-item.has-dropdown`, see globals.css)
 * to match the source site exactly; the state here only tracks
 * `aria-expanded` and handles Escape-to-close for keyboard users.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  function handleBlur(index: number, e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenIndex((current) => (current === index ? null : current));
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && openIndex === index) {
      setOpenIndex(null);
      itemRefs.current[index]?.querySelector("a")?.focus();
    }
  }

  function handleAnchorClick(href: string) {
    const id = sameRouteHashTarget(href, pathname);
    if (!id) return undefined;
    return (e: MouseEvent) => {
      if (scrollToHash(id)) e.preventDefault();
    };
  }

  return (
    <nav className="gnb-menu" aria-label="주요 메뉴">
      {NAV_ENTRIES.map((entry, index) => {
        if (entry.type === "link") {
          return (
            <Link
              key={entry.href}
              href={entry.href}
              aria-current={isNavActive(pathname, entry.href) ? "page" : undefined}
            >
              {entry.label}
            </Link>
          );
        }

        const { dropdown } = entry;
        const isOpen = openIndex === index;
        const panelId = `gnb-dropdown-${index}`;

        return (
          <div
            key={dropdown.label}
            className="gnb-item has-dropdown"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex((current) => (current === index ? null : current))}
            onFocus={() => setOpenIndex(index)}
            onBlur={(e) => handleBlur(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          >
            <Link
              href={dropdown.href ?? "#"}
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-current={dropdown.href && isNavActive(pathname, dropdown.href) ? "page" : undefined}
              onClick={dropdown.href ? handleAnchorClick(dropdown.href) : undefined}
            >
              {dropdown.label}
            </Link>
            <div className="dropdown-panel" id={panelId} role="menu">
              {dropdown.groupLabel && <div className="dd-group-label">{dropdown.groupLabel}</div>}
              {dropdown.groupLabel ? (
                dropdown.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={item.divider ? "dd-divider" : undefined}
                    onClick={handleAnchorClick(item.href)}
                  >
                    <span className="dd-label">
                      {item.label}{" "}
                      {item.highlight && <span className="highlight-pen">{item.highlight}</span>}
                    </span>
                  </Link>
                ))
              ) : (
                <ul className="dropdown-list">
                  {dropdown.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} role="menuitem" onClick={handleAnchorClick(item.href)}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
