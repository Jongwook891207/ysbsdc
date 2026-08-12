import type { FaqItem } from "@/lib/jsonld";

/**
 * Renders `frontmatter.faq` visibly on the column page — the same array
 * app/column/[slug]/page.tsx passes to buildFaqJsonLd() for the FAQPage
 * JSON-LD, so the visible Q&A and the structured data can never drift
 * apart (single source of truth, no separate copy). Plain <dl>/<dt>/<dd>
 * on purpose — no accordion/JS interactivity, matching the rest of the
 * article body's static-content style.
 */
export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="column-faq">
      <h2>자주 묻는 질문</h2>
      <dl>
        {items.map((item) => (
          <div key={item.question} className="column-faq-item">
            <dt>Q. {item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
