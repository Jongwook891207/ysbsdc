import Link from "next/link";
import type { Column, Doctor } from "@/lib/types";

/**
 * Stage 1: placeholder. Stage 4 renders thumbnail (next/image), category
 * pill, title, summary, author name + title, and formatted publishedAt —
 * used on /column and on RelatedColumns.
 */
export function ColumnCard({
  column,
  author,
}: {
  column: Column;
  author: Doctor;
}) {
  return (
    <article>
      <Link href={`/column/${column.slug}`}>
        <h3>{column.title}</h3>
      </Link>
      <p>{column.summary}</p>
      <span>{author.name}</span>
    </article>
  );
}
