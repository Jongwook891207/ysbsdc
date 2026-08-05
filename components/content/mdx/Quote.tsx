import type { ReactNode } from "react";

/**
 * Literature/authority or doctor-commentary quote — kept separate from a
 * future Testimonial component (patient reviews) on purpose, since
 * medical-advertising rules around patient testimonials don't apply to
 * this. Server Component — no interactivity.
 */
export function Quote({ cite, role, children }: { cite?: string; role?: string; children: ReactNode }) {
  const attribution = [cite, role].filter(Boolean).join(" · ");
  return (
    <figure className="mdx-quote">
      <blockquote>{children}</blockquote>
      {attribution && <figcaption>{attribution}</figcaption>}
    </figure>
  );
}
