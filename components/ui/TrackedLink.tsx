"use client";

import type { ComponentPropsWithoutRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * 전환 클릭(전화·네이버 예약·길찾기) 전용 <a> 래퍼.
 *
 * - 이벤트는 비즈니스 의미가 있는 3종으로 제한한다(phone_click /
 *   naver_booking_click / map_click). 범용 outbound_click을 늘리지 않는 것이
 *   의도된 정책이다 — 새 이벤트가 필요하면 이 타입에 명시적으로 추가한다.
 * - 트래킹은 클릭 동작에 어떤 영향도 주지 않는다: preventDefault 없이
 *   기본 내비게이션(tel:, 새 탭, 외부 URL)을 그대로 따르고, GA가 로드되지
 *   않았거나 차단된 환경에서도 try/catch로 조용히 무시한다.
 * - sendGAEvent는 dataLayer 큐에 push하는 방식이라 GA 스크립트 로드
 *   전/차단 시에도 예외 없이 동작하지만, 만약을 위해 한 번 더 감싼다.
 * - 그 외 모든 표준 <a> 속성(target, rel, aria-label, data-aos 등)은
 *   그대로 통과시킨다.
 */
export type TrackedEventName = "phone_click" | "naver_booking_click" | "map_click";

export type TrackedLinkLocation =
  | "header"
  | "floating_bar"
  | "location_section"
  | "footer"
  | "cta";

type TrackedLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  href: string;
  event: TrackedEventName;
  location: TrackedLinkLocation;
};

export function TrackedLink({ href, event, location, children, ...rest }: TrackedLinkProps) {
  function handleClick() {
    try {
      sendGAEvent("event", event, {
        page_path: window.location.pathname,
        page_title: document.title,
        link_url: href,
        link_location: location,
      });
    } catch {
      // GA 미로드/차단 환경 — 클릭 동작에는 영향 없음.
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
