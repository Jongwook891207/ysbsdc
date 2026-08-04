import Link from "next/link";
import type { ReactNode } from "react";

/** Maps to the `.btn` / `.btn-navy` / `.btn-outline` / `.btn-gold` classes in globals.css. */
type ButtonVariant = "navy" | "outline" | "gold";

export function Button({
  href,
  variant = "navy",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
