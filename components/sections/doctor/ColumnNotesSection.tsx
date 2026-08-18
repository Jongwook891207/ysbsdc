import Link from "next/link";
import { ColumnCard } from "@/components/cards/ColumnCard";
import { columnSource } from "@/lib/content/sources/columns";

/**
 * A hand-picked set of 3 columns that show how the doctor actually judges
 * cases (not just "latest 3") — there's no schema field for "featured on
 * /doctor" (adding one would be a schema change, out of scope), so the
 * slugs are named here and resolved through the real columnSource at
 * render time. This keeps the maintenance surface to "swap a slug in this
 * array" rather than hardcoded title/summary/date/thumbnail text — every
 * displayed field still comes from the actual MDX frontmatter, and
 * `.getPublished()` (not `.getBySlug()`) means a column that's reverted to
 * draft automatically disappears here instead of needing a second edit.
 */
const NOTE_SLUGS = ["immediate-vs-delayed-implant-placement", "root-canal-crown-timing", "why-we-recommend-second-opinions"];

export function ColumnNotesSection() {
  const published = columnSource.getPublished();
  const notes = NOTE_SLUGS.map((slug) => published.find((entry) => entry.frontmatter.slug === slug)).filter(
    (entry): entry is NonNullable<typeof entry> => entry !== undefined,
  );

  if (notes.length === 0) return null;

  return (
    <section className="column-notes-section" id="notes">
      <div className="container">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">김종욱의 진료노트</span>
        </div>
        <div className="column-notes-grid" data-aos="fade-up" data-aos-delay={100}>
          {notes.map((column) => (
            <ColumnCard key={column.frontmatter.slug} column={column} />
          ))}
        </div>
        <Link href="/column" className="column-notes-link">
          원장 칼럼 더 보기 →
        </Link>
      </div>
    </section>
  );
}
