import type { ReactNode } from "react";

/**
 * Clinical caution box — visually distinct from Callout via the muted
 * terracotta `--warn`/`--warn-soft` tokens (not red; see globals.css :root),
 * chosen earlier to avoid an alarm-style color that clashes with the
 * site's navy/gold/ivory palette. Server Component — no interactivity.
 */
export function Warning({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="mdx-warning">
      {title && <p className="mdx-warning-title">{title}</p>}
      <div className="mdx-warning-body">{children}</div>
    </aside>
  );
}
