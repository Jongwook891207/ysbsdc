import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx/mdxComponents";
import { createHeadingComponents } from "./mdx/createHeadingComponents";
import type { TocItem } from "@/lib/toc";

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
 *    check here now would just duplicate that.
 *
 * `blockJS: false` is required: `next-mdx-remote/serialize` treats MDX as
 * potentially-untrusted "remote" content by default and strips every JSX
 * expression container (`attr={...}` of ANY type — string, number, array,
 * object; see `removeJavaScriptExpressions` in its `serialize.js`) unless
 * this is set. Our MDX is first-party, filesystem-sourced, and already
 * zod-validated at load time (lib/content/loader.ts), so it isn't the
 * untrusted content that default guards against — but without this flag,
 * every non-string component prop (e.g. Checklist's `items={[...]}`)
 * silently compiles away to `{}`, which is the bug this comment now
 * documents. `blockDangerousJS` is left at its default `true` (blocks
 * `eval`/`Function`/dynamic `import()` etc.) as cheap defense-in-depth on
 * top of that trust.
 *
 * `tocItems` (from `lib/toc.ts#extractToc`, computed by the caller from the
 * same raw source) drives id assignment on the rendered h2/h3 elements via
 * `createHeadingComponents` — see that file for why this is positional
 * rather than a second slugify pass. A fresh instance is created per call
 * so the running counter never leaks across renders/requests.
 */
export function ArticleBody({ source, tocItems }: { source: string; tocItems: TocItem[] }) {
  return (
    <MDXRemote
      source={source}
      components={{ ...mdxComponents, ...createHeadingComponents(tocItems) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
        blockJS: false,
      }}
    />
  );
}
