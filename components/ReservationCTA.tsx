/**
 * Stage 1: placeholder. Ports the GNB 간편예약 button, the mobile Smart
 * Floating Bar, and the various in-page "네이버 간편예약 / 전화상담" CTAs
 * into one source of truth for the booking URL
 * (https://m.booking.naver.com/booking/13/bizes/1704928) and phone number.
 */
export function ReservationCTA() {
  const phone = "032-678-2080";
  const bookingUrl = "https://m.booking.naver.com/booking/13/bizes/1704928";

  return (
    <div>
      <a href={`tel:${phone}`}>전화상담</a>
      <a href={bookingUrl} target="_self">
        네이버 간편예약
      </a>
    </div>
  );
}
