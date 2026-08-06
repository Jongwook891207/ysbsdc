import type { ReactNode } from "react";
import { authorSource } from "@/lib/content/sources/authors";

/**
 * Visual-only "the doctor says" callout — it does NOT itself create E-E-A-T,
 * it just reflects an author/reviewer relationship the page's JSON-LD
 * would separately declare (deferred to a future SEO stage). `doctorSlug`
 * is required and resolved against the real author source: an MDX author
 * writing an unresolvable slug is a content bug, not something to silently
 * hide behind a fake/default name, so this throws instead of falling back.
 */
export function DoctorComment({ doctorSlug, children }: { doctorSlug: string; children: ReactNode }) {
  const doctor = authorSource.getBySlug(doctorSlug);
  if (!doctor) {
    throw new Error(`DoctorComment: doctorSlug "${doctorSlug}" does not match any file in content/authors/.`);
  }

  return (
    <aside className="mdx-doctor-comment" data-aos="fade-up">
      <p className="mdx-doctor-comment-name">{doctor.frontmatter.name}</p>
      <div className="mdx-doctor-comment-body">{children}</div>
    </aside>
  );
}
