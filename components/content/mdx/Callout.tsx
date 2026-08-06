import type { ReactNode } from "react";

/** General-purpose highlighted note inside an article body. Server Component — no interactivity. */
export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="mdx-callout" data-aos="fade-up">
      {title && <p className="mdx-callout-title">{title}</p>}
      <div className="mdx-callout-body">{children}</div>
    </aside>
  );
}
