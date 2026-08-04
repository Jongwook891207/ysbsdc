"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

/**
 * Ports `.treat-card.top` from index.html — whole-card click navigates to
 * `href` (index.html's inline script did this via `card.dataset.href` +
 * `window.location.href`), except clicks on the inner "자세히 보기" link,
 * which already navigates there itself.
 */
export function TreatmentTopCard({
  href,
  badge,
  icon,
  title,
  desc,
  delay,
}: {
  href: string;
  badge: string;
  icon: string;
  title: string;
  desc: string;
  delay?: number;
}) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) return;
    router.push(href);
  }

  return (
    <div className="treat-card top" data-aos="fade-up" data-aos-delay={delay} onClick={handleClick}>
      <span className="treat-top-badge">{badge}</span>
      <div className="treat-icon-box">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p className="treat-desc">{desc}</p>
      <Link href={href} className="treat-more">
        자세히 보기 <span className="arrow">→</span>
      </Link>
    </div>
  );
}
