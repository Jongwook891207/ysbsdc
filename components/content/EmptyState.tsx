/** Generic "nothing here yet" block for a content list page — reusable beyond /column. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="content-empty-state">
      <p>{message}</p>
    </div>
  );
}
