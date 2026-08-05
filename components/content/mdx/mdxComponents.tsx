import { Callout } from "./Callout";
import { Warning } from "./Warning";
import { Quote } from "./Quote";
import { DoctorComment } from "./DoctorComment";
import { Checklist } from "./Checklist";
import { CTA } from "./CTA";

/**
 * MDX custom component map — passed to `next-mdx-remote/rsc`'s `<MDXRemote
 * components={...} />` in ArticleBody.tsx (merged there with the
 * per-render heading-id components from createHeadingComponents.tsx).
 *
 * Testimonial/FAQBox remain deferred (see stage 4-4 notes) — patient
 * testimonials and FAQ JSON-LD wiring are out of scope this stage.
 *
 * Adding one of the deferred components later is: implement the
 * component, add one line here. ArticleBody.tsx and every page that
 * renders MDX never change.
 */
export const mdxComponents = {
  Callout,
  Warning,
  Quote,
  DoctorComment,
  Checklist,
  CTA,
};
