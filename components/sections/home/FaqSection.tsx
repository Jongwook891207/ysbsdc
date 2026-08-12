"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { HOME_FAQ_ITEMS } from "@/lib/homeFaq";

/**
 * Ports index.html's `<section class="faq">` — accordion open/close ported
 * from the original inline script (single item open at a time, Q1 open by
 * default). `.faq-q` kept as the click target like the source markup, with
 * `role="button"`/keyboard support added since the original wasn't
 * keyboard-operable.
 *
 * `data-aos` lives on a static outer wrapper, never on `.faq-item` itself.
 * ScrollReveal.tsx adds `.aos-animate` to the `[data-aos]` element via a
 * direct DOM mutation React doesn't track. `.faq-item`'s own className
 * changes on every open/close click (`isOpen` toggles the "open" suffix) —
 * if `data-aos` were on that same element, React would overwrite its
 * className on every click and silently drop the externally-added
 * `aos-animate`, snapping the card back to the pre-reveal hidden state
 * (opacity:0) for both the item opening and the one closing. The wrapper's
 * className is a constant string (no props ever change it), so React never
 * touches it and the reveal state is permanent once set — the accordion
 * toggle and the scroll-reveal fade are on two separate DOM layers.
 */
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>, index: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(index);
    }
  }

  return (
    <section className="faq">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">SAFE Q&amp;A</span>
          <h2 className="section-title">
            ❓ 부천 원종동·고강동 주민분들이
            <br />
            가장 자주 묻는 안심 Q&amp;A
          </h2>
        </div>
        <div className="faq-list">
          {HOME_FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                data-aos="fade-up"
                data-aos-delay={index === 0 ? undefined : index * 60}
              >
                <div className={`faq-item${isOpen ? " open" : ""}`}>
                  <div
                    className="faq-q"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggle(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  >
                    <span className="qt">
                      <span className="qn">Q{index + 1}.</span>
                      {item.question}
                    </span>
                    <span className="faq-chev"></span>
                  </div>
                  <div className="faq-a">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
