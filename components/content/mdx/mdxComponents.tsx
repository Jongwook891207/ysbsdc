/**
 * MDX custom component map — passed to `next-mdx-remote/rsc`'s `<MDXRemote
 * components={mdxComponents} />` in ArticleBody.tsx. Deliberately empty
 * this stage ("특수 컴포넌트는 아직 구현하지 않습니다") — MDX bodies render
 * with plain HTML elements (h2/h3/p/ul/li/blockquote/code/...) until the
 * confirmed component set is built:
 *
 *   Callout, Quote, Testimonial, Warning, Checklist, DoctorComment, CTA,
 *   FAQBox, Figure
 *
 * (see the MDX component design agreed on earlier in this project, with
 * Quote/Testimonial kept separate for medical-advertising reasons, Warning
 * using a muted non-red token, FAQBox's visual rendering kept separate
 * from its JSON-LD emission, and DoctorComment/Figure's requirements as
 * discussed then).
 *
 * The map exists (rather than omitting the `components` prop entirely) so
 * adding one of the above later is: implement the component, add one line
 * here. ArticleBody.tsx and every page that renders MDX never change.
 */
export const mdxComponents = {};
