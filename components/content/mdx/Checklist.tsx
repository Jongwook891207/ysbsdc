/** Simple pre-visit checklist. Server Component — no interactivity. */
export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mdx-checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
