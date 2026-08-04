"use client";

import { useEffect, useRef, useState } from "react";
import { CLINIC } from "@/lib/seo";
import { CalendarIcon, PhoneIcon } from "@/components/ui/icons";

/**
 * Ports `#smartFloatingBar` from index.html — mobile-only (hidden ≥768px
 * via globals.css), scroll-direction show/hide 1:1 with the original
 * inline script (passive listener + rAF throttling).
 */
export function SmartFloatingBar() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
      ticking.current = false;
    }

    function handleScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(onScroll);
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`smart-floating-bar${hidden ? " sfb-hidden" : ""}`}>
      <a href={`tel:${CLINIC.telephoneDisplay}`} className="sfb-btn sfb-outline">
        <PhoneIcon size={15} />
        전화상담
      </a>
      <a href={CLINIC.bookingUrl} target="_self" className="sfb-btn sfb-filled">
        <CalendarIcon size={15} />
        네이버 간편예약
      </a>
    </nav>
  );
}
