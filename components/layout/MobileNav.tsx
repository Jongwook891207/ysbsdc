"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { NAV_ENTRIES, isNavActive, sameRouteHashTarget } from "@/lib/nav";
import { scrollToHash } from "@/lib/utils";

/**
 * Hamburger + accordion mobile menu (`.gnb-hamburger` / `.mobile-nav`),
 * shown only below 960px via globals.css. Ports the open/close and
 * accordion behaviour from index.html's inline script 1:1, and adds the
 * body-scroll-lock / outside-click / Escape / route-change-close /
 * focus-return behaviour the static site didn't need (no client-side
 * routing there).
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    setOpenAccordion(null);
  }

  // Auto-close on route change.
  useEffect(() => {
    close();
  }, [pathname]);

  // Body scroll lock while open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes; outside click closes.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        hamburgerRef.current?.focus();
      }
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        close();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function handleToggle() {
    setOpen((prev) => {
      const next = !prev;
      if (!next) setOpenAccordion(null);
      return next;
    });
  }

  function handleClose() {
    close();
    hamburgerRef.current?.focus();
  }

  function handleAnchorClick(href: string) {
    const id = sameRouteHashTarget(href, pathname);
    if (!id) return undefined;
    return (e: ReactMouseEvent) => {
      if (scrollToHash(id)) {
        e.preventDefault();
        close();
      }
    };
  }

  return (
    <>
      <button
        type="button"
        className="gnb-hamburger"
        id="gnbHamburger"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        aria-controls="mobileNav"
        ref={hamburgerRef}
        onClick={handleToggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div
        className={`mobile-nav${open ? " open" : ""}`}
        id="mobileNav"
        ref={navRef}
      >
        {NAV_ENTRIES.map((entry, index) => {
          if (entry.type === "link") {
            return (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={isNavActive(pathname, entry.href) ? "page" : undefined}
                onClick={handleClose}
              >
                {entry.label}
              </Link>
            );
          }

          const { dropdown } = entry;
          const isOpen = openAccordion === index;

          return (
            <div
              key={dropdown.label}
              className={`mobile-nav-item${isOpen ? " open" : ""}`}
            >
              <button
                type="button"
                className="mobile-nav-trigger"
                aria-expanded={isOpen}
                aria-controls={`mobile-accordion-${index}`}
                onClick={() => setOpenAccordion((current) => (current === index ? null : index))}
              >
                {dropdown.label}
                <span className="mobile-chev"></span>
              </button>
              <div className="mobile-accordion" id={`mobile-accordion-${index}`}>
                {dropdown.groupLabel && <div className="dd-group-label">{dropdown.groupLabel}</div>}
                {dropdown.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={item.divider ? "dd-divider" : undefined}
                    onClick={handleAnchorClick(item.href) ?? handleClose}
                  >
                    {item.highlight ? (
                      <span className="dd-label">
                        {item.label} <span className="highlight-pen">{item.highlight}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
