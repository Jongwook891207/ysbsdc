import { CLINIC } from "@/lib/seo";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon } from "@/components/ui/icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

/**
 * Ports `header.gnb` from index.html / doctor.html / treatment.html /
 * mission.html. Only the interactive pieces (dropdown open state, mobile
 * hamburger) are Client Components — DesktopNav and MobileNav.
 */
export function Header() {
  return (
    <header className="gnb">
      <div className="gnb-inner">
        <Logo />
        <DesktopNav />
        <div className="gnb-actions">
          <TrackedLink href={`tel:${CLINIC.telephoneDisplay}`} event="phone_click" location="header" className="gnb-tel">
            📞 {CLINIC.telephoneDisplay}
          </TrackedLink>
          <TrackedLink
            href={`tel:${CLINIC.telephoneDisplay}`}
            event="phone_click"
            location="header"
            className="gnb-phone-btn"
            aria-label="전화 문의"
          >
            <PhoneIcon size={17} />
          </TrackedLink>
          <TrackedLink
            href={CLINIC.bookingUrl}
            event="naver_booking_click"
            location="header"
            target="_self"
            className="btn btn-navy gnb-book-btn"
          >
            간편예약
          </TrackedLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
