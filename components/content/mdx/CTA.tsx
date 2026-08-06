import { CLINIC } from "@/lib/seo";

type CTAVariant = "navy" | "outline" | "gold";

/**
 * Reuses the site's `.btn`/`.btn-{variant}` visual classes directly (not
 * the `Button` component, which hardcodes `next/link` — wrong here since
 * the default target is the external Naver booking URL, not an internal
 * route). `href` may still be overridden for a same-page anchor CTA.
 */
export function CTA({
  href = CLINIC.bookingUrl,
  variant = "gold",
  children,
}: {
  href?: string;
  variant?: CTAVariant;
  children: string;
}) {
  const isExternal = href.startsWith("http");
  return (
    <p className="mdx-cta" data-aos="fade-up">
      <a
        href={href}
        className={`btn btn-${variant}`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    </p>
  );
}
