/**
 * Site-wide SEO constants — single source of truth so metadata.ts,
 * jsonld.ts, sitemap.ts, robots.ts, and rss.xml/route.ts never disagree
 * with each other about the domain, hospital name, or phone number.
 */
export const SITE_URL = "https://ysbsdc.com";
export const SITE_NAME = "연세백세치과의원";

export const CLINIC = {
  name: "연세백세치과의원",
  founder: "김종욱",
  telephone: "+82-32-678-2080",
  telephoneDisplay: "032-678-2080",
  address: {
    streetAddress: "성지로 101, 3층",
    addressLocality: "부천시 오정구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  addressFull: "경기도 부천시 오정구 성지로 101 3층",
  bookingUrl: "https://m.booking.naver.com/booking/13/bizes/1704928",
  mapUrl: "https://naver.me/GZZNpcLS",
  hours: {
    weekday: "평일 09:00~18:00 (화요일 야간 20:00까지)",
    saturday: "토요일 09:00~13:00 · 점심 12:30~14:00",
    closed: "일요일·공휴일 휴진",
  },
  directions: "서해선 원종역 도보 15분",
  parking: "건물 내 무료 주차 가능",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
