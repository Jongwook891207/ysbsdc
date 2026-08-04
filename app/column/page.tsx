/**
 * STAGE 1 PLACEHOLDER — `searchParams` is read (so the signature/type is
 * exercised) but not yet used for anything.
 * TODO(stage 4): parse page/author/category out of searchParams, call
 * lib/columns.ts#getPublishedColumns(filters), render <ColumnCard> grid +
 * pagination controls + author/category filter UI.
 */
export default async function ColumnListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await searchParams;

  return (
    <div>
      <h1>원장 칼럼</h1>
    </div>
  );
}
