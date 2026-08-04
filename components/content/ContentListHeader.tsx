/**
 * Generic intro/hero block for a content list page (`/column` now;
 * `/guide`, `/question` etc. later would reuse this same component — see
 * lib/content/registry.ts's reserved content types). Kept content-agnostic
 * (eyebrow/title/description props, no column-specific fields) on purpose.
 */
export function ContentListHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="content-list-hero">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p className="content-list-hero-desc">{description}</p>}
      </div>
    </section>
  );
}
