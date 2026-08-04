import { createSimpleContentSource } from "@/lib/content/loader";
import { AUTHOR_CONFIG } from "@/lib/content/registry";

/**
 * The only author data-access entry point pages should import from
 * (stage 4-2, when /doctor/[slug] connects to this data layer). No
 * getPublished()/draft concept here — see AUTHOR_CONFIG.hasDrafts and
 * createSimpleContentSource in lib/content/loader.ts. Use `active` on an
 * author's own frontmatter to retire them from public listings instead.
 *
 * No explicit type argument — see the note in sources/columns.ts; both of
 * createSimpleContentSource's type parameters are inferred from
 * AUTHOR_CONFIG's own type instead.
 */
export const authorSource = createSimpleContentSource(AUTHOR_CONFIG);
