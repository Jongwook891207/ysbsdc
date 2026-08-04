import { notFound } from "next/navigation";

/**
 * STAGE 1 PLACEHOLDER.
 * TODO(stage 4): add `export async function generateStaticParams()` (SSG
 * over lib/columns.ts#getAllColumnSlugs()), MDX render (next-mdx-remote/rsc),
 * breadcrumb, author bio, related columns, prev/next.
 * TODO(stage 5): add `export async function generateMetadata()` (via
 * lib/metadata.ts#buildColumnMetadata) and render
 * <JsonLd data={buildArticleJsonLd(column, author)} /> +
 * <JsonLd data={buildBreadcrumbJsonLd(items)} />.
 * Until generateStaticParams exists, this route falls back to on-demand
 * SSR for every slug — that's the "임시" part to be aware of.
 */
export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  return (
    <article>
      <h1>칼럼: {slug}</h1>
    </article>
  );
}
