import { CLINIC } from "@/lib/seo";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { TrackedEventName } from "@/components/ui/TrackedLink";

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
  // 전환 의미가 있는 목적지(네이버 예약, 전화)만 트래킹한다 — 같은 페이지
  // 앵커 등으로 href가 재정의된 CTA는 이벤트 없이 일반 <a>로 렌더링한다.
  const trackedEvent: TrackedEventName | null =
    href === CLINIC.bookingUrl ? "naver_booking_click" : href.startsWith("tel:") ? "phone_click" : null;

  const sharedProps = {
    href,
    className: `btn btn-${variant}`,
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noopener noreferrer" : undefined,
  };

  return (
    <p className="mdx-cta" data-aos="fade-up">
      {trackedEvent ? (
        <TrackedLink {...sharedProps} event={trackedEvent} location="cta">
          {children}
        </TrackedLink>
      ) : (
        <a {...sharedProps}>{children}</a>
      )}
    </p>
  );
}
