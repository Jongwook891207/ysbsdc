"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { Treatment } from "./treatments.data";

/**
 * Ports treatment.html's single shared modal (`#modalOverlay`) — opened from
 * the general-treatment grid cards and the three "상세 Q&A 보기" buttons in
 * the Key Treatment sections, all via a fixed `TREATMENTS` index. A context
 * lets any of those triggers (in separate Server Component sections) open
 * the same modal without lifting state through props.
 *
 * Kept close to the original behavior: single item open at a time in the
 * FAQ list, Escape/outside-click/close-button all close it, body scroll
 * lock while open. Added on top (didn't exist in the static site, same
 * pattern as stage 2's MobileNav): focus moves to the close button on
 * open and returns to the trigger on close.
 */

interface TreatmentModalContextValue {
  open: (index: number) => void;
}

const TreatmentModalContext = createContext<TreatmentModalContextValue | null>(null);

export function useTreatmentModal(): TreatmentModalContextValue {
  const ctx = useContext(TreatmentModalContext);
  if (!ctx) {
    throw new Error("useTreatmentModal must be used within a TreatmentModalProvider");
  }
  return ctx;
}

export function TreatmentModalProvider({
  treatments,
  children,
}: {
  treatments: Treatment[];
  children: ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  function open(index: number) {
    triggerRef.current = document.activeElement as HTMLElement;
    setOpenFaqIndex(0);
    setOpenIndex(index);
  }

  function close() {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (openIndex === null) return;
    document.body.classList.add("modal-open");
    closeBtnRef.current?.focus();
    return () => document.body.classList.remove("modal-open");
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) close();
  }

  function toggleFaq(index: number) {
    setOpenFaqIndex((current) => (current === index ? -1 : index));
  }

  function handleFaqKeyDown(e: KeyboardEvent<HTMLDivElement>, index: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFaq(index);
    }
  }

  const treatment = openIndex !== null ? treatments[openIndex] : null;

  return (
    <TreatmentModalContext.Provider value={{ open }}>
      {children}
      <div className={`modal-overlay${treatment ? " active" : ""}`} onClick={handleOverlayClick}>
        {treatment && (
          <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button
              className="modal-close"
              type="button"
              aria-label="닫기"
              onClick={close}
              ref={closeBtnRef}
            >
              &times;
            </button>
            <div className="modal-scroll">
              <div className="modal-num">{treatment.num}</div>
              <h2 className="modal-title" id="modalTitle">
                {treatment.name}
              </h2>

              <section className="modal-section">
                <h3 className="modal-subtitle">핵심 특징</h3>
                <ul className="modal-features">
                  {treatment.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </section>

              <section className="modal-section">
                <h3 className="modal-subtitle">치료 프로세스</h3>
                <ol className="modal-steps">
                  {treatment.steps.map((s, i) => (
                    <li key={s.t} className="step-item">
                      <div className="step-num">{i + 1}</div>
                      <div className="step-body">
                        <h4>{s.t}</h4>
                        <p>{s.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="modal-section">
                <h3 className="modal-subtitle">자주 묻는 질문</h3>
                <div className="modal-faq">
                  {treatment.faqs.map((f, i) => {
                    const isOpen = openFaqIndex === i;
                    return (
                      <div key={f.q} className={`faq-item${isOpen ? " open" : ""}`}>
                        <div
                          className="faq-q"
                          role="button"
                          tabIndex={0}
                          aria-expanded={isOpen}
                          onClick={() => toggleFaq(i)}
                          onKeyDown={(e) => handleFaqKeyDown(e, i)}
                        >
                          <span>{f.q}</span>
                          <span className="faq-chev"></span>
                        </div>
                        <div className="faq-a">
                          <p>{f.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </TreatmentModalContext.Provider>
  );
}
