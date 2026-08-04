"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Drives the `[data-aos]` reveal-on-scroll effect (see globals.css) via
 * IntersectionObserver — a zero-dependency stand-in for the `aos` library
 * the static site loaded from a CDN. Mounted once in the root layout;
 * re-scans on route change so newly rendered `[data-aos]` elements on the
 * next page are picked up.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.aosDelay;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add("aos-animate");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
