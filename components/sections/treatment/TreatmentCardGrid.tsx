"use client";

import type { KeyboardEvent } from "react";
import type { Treatment } from "./treatments.data";
import { useTreatmentModal } from "./TreatmentModal";

/**
 * Ports treatment.html's `renderCards()` — general-treatment grid starting
 * at TREATMENTS[3] (num 04), checkerboard `card-style-a`/`card-style-b`
 * alternation, whole-card click/Enter/Space opens the shared modal at the
 * card's real TREATMENTS index.
 */
export function TreatmentCardGrid({ treatments }: { treatments: Treatment[] }) {
  const { open } = useTreatmentModal();
  const gridItems = treatments.slice(3);

  function handleKeyDown(e: KeyboardEvent<HTMLElement>, index: number) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    open(index);
  }

  return (
    <div className="treat-grid">
      {gridItems.map((t, i) => {
        const realIndex = i + 3;
        const styleClass = i % 2 === 0 ? "card-style-a" : "card-style-b";
        return (
          <article
            key={t.num}
            className={`treat-card ${styleClass}`}
            tabIndex={0}
            role="button"
            aria-haspopup="dialog"
            onClick={() => open(realIndex)}
            onKeyDown={(e) => handleKeyDown(e, realIndex)}
          >
            {t.icon && (
              <div className="tc-icon-box">
                <i className={t.icon} aria-hidden="true"></i>
              </div>
            )}
            <div className="tc-num">{t.num}</div>
            <h3 className="tc-name">{t.name}</h3>
            <p className="tc-summary">{t.summary}</p>
            <span className="tc-link">상세 과정 및 Q&amp;A 보기 &gt;</span>
          </article>
        );
      })}
    </div>
  );
}
