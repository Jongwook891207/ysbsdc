import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx/mdxComponents";

/**
 * The one place in the codebase that compiles/renders an MDX body — every
 * page that renders content (column now; question/guide/case later) goes
 * through this component instead of calling MDXRemote directly, so the
 * plugin/component config only has one place to change.
 *
 * remark/rehype kept minimal on purpose for this stage:
 *  - `remark-gfm` is the only plugin — tables, strikethrough, autolinks
 *    are baseline Markdown features content authors will expect; without
 *    it they silently don't work.
 *  - No rehype plugins yet.
 *  - No H1-in-body enforcement here: `lib/content/mdxGuards.ts` already
 *    rejects an H1 at content-load time (stage 4-1), before this
 *    component ever sees the body — adding a second, AST-based remark
 *    check here now would just duplicate that. The extension point for
 *    one (or a heading-slug plugin for a future TOC) is `remarkPlugins`/
 *    `rehypePlugins` below — adding either doesn't require touching any
 *    page that renders <ArticleBody>.
 */
export function ArticleBody({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      }}
    />
  );
}
