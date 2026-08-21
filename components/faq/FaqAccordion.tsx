"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

export interface FaqAccordionItem {
  id: string;
  question: string;
  /** Server-rendered MDX (ArticleBody output) — passed in already-rendered from the page component. */
  answer: ReactNode;
  /** Optional trailing "관련 진료 / 관련 칼럼" links, rendered inside the open answer. */
  meta?: ReactNode;
}

/**
 * Same open/close interaction as components/sections/home/FaqSection.tsx
 * (single item open at a time, reuses the same `.faq-list`/`.faq-item`/
 * `.faq-q`/`.faq-chev`/`.faq-a` classes) — generalized to accept rendered
 * MDX content instead of a plain string, for /faq/[category] (Phase 3-B).
 */
export function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
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
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.id} data-aos="fade-up" data-aos-delay={index === 0 ? undefined : Math.min(index, 4) * 60}>
            <div className={`faq-item${isOpen ? " open" : ""}`}>
              <div
                className="faq-q"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span className="qt">{item.question}</span>
                <span className="faq-chev"></span>
              </div>
              <div className="faq-a">
                {item.answer}
                {item.meta}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
