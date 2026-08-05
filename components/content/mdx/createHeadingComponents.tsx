import type { ReactNode } from "react";
import type { TocItem } from "@/lib/toc";

/**
 * Assigns `id`s to the actually-rendered h2/h3 elements so the TOC's
 * `<a href="#...">` links land somewhere. Matches `tocItems` positionally
 * (the Nth heading MDXRemote renders gets `tocItems[N]`'s id) rather than
 * re-slugifying each heading's rendered children — MDX headings and
 * lib/toc.ts's extraction both walk the same source in the same order, so
 * position is a simpler and more reliable correspondence than comparing
 * text a second time (which inline formatting could make diverge).
 *
 * Called fresh per render (ArticleBody.tsx creates a new instance for
 * every page) — the running counter is local to that call, not
 * module-level, so there's no cross-request state to worry about in RSC.
 */
export function createHeadingComponents(tocItems: TocItem[]) {
  let index = 0;

  function nextId(): string | undefined {
    const item = tocItems[index];
    index += 1;
    return item?.id;
  }

  return {
    h2: ({ children }: { children: ReactNode }) => <h2 id={nextId()}>{children}</h2>,
    h3: ({ children }: { children: ReactNode }) => <h3 id={nextId()}>{children}</h3>,
  };
}
