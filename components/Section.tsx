import type { ReactNode } from "react";

/**
 * Stage 1: placeholder. Generic <section class="container"> wrapper used by
 * every page section (eyebrow + title + description header pattern from
 * .section-head / .section-title / .section-desc).
 */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={className}>
      <div className="container">{children}</div>
    </section>
  );
}
