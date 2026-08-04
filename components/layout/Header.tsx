import { CLINIC } from "@/lib/seo";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon } from "@/components/ui/icons";
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
          <a href={`tel:${CLINIC.telephoneDisplay}`} className="gnb-tel">
            📞 {CLINIC.telephoneDisplay}
          </a>
          <a
            href={`tel:${CLINIC.telephoneDisplay}`}
            className="gnb-phone-btn"
            aria-label="전화 문의"
          >
            <PhoneIcon size={17} />
          </a>
          <a href={CLINIC.bookingUrl} target="_self" className="btn btn-navy gnb-book-btn">
            간편예약
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
