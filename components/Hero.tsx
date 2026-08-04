import type { ReactNode } from "react";

/**
 * Stage 1: placeholder. Stage 3 makes this configurable enough to cover
 * index.html's split-background hero, doctor.html's photo-split hero, and
 * mission.html's full-bleed dark hero without three separate components.
 */
export function Hero({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="hero">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {children}
    </section>
  );
}
