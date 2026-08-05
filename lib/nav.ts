/**
 * GNB / mobile menu structure — single source of truth shared by
 * DesktopNav and MobileNav so the menu only needs to be edited in one
 * place. Mirrors the nav in index.html / doctor.html / treatment.html /
 * mission.html exactly (labels, hrefs, dropdown groups).
 */
export interface NavLink {
  label: string;
  href: string;
}

export interface NavDropdownItem extends NavLink {
  /** Rendered with the `dd-label` + `highlight-pen` markup used in the
   * treatment dropdown; plain dropdowns (콘텐츠 / 비용·내원안내) omit it. */
  highlight?: string;
  /** Adds the `dd-divider` rule below this item, as in the source HTML. */
  divider?: boolean;
}

export interface NavDropdown {
  label: string;
  /** Base link for items that are both a direct link and a dropdown
   * trigger (진료 안내 links to /treatment as well as opening a panel). */
  href?: string;
  groupLabel?: string;
  items: NavDropdownItem[];
}

export type NavEntry =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; dropdown: NavDropdown };

export const NAV_ENTRIES: NavEntry[] = [
  { type: "link", label: "백세미션", href: "/mission" },
  { type: "link", label: "대표원장 스토리", href: "/doctor" },
  {
    type: "dropdown",
    dropdown: {
      label: "진료 안내",
      href: "/treatment",
      groupLabel: "핵심진료",
      items: [
        { label: "컴퓨터 분석 가이드", highlight: "임플란트", href: "/treatment#implant" },
        { label: "1:1 맞춤 어르신 틀니 & IARPD", highlight: "틀니", href: "/treatment#denture" },
        {
          label: "치과보존과 전문의 미세 신경치료",
          highlight: "신경치료",
          href: "/treatment#endodontics",
          divider: true,
        },
        { label: "원칙을 지키는 정직한 일반진료", highlight: "일반진료", href: "/treatment#general" },
      ],
    },
  },
  {
    type: "dropdown",
    dropdown: {
      label: "콘텐츠",
      href: "/column",
      items: [{ label: "원장 칼럼", href: "/column" }],
    },
  },
  {
    type: "dropdown",
    dropdown: {
      label: "비용 · 내원안내",
      href: "/#location",
      items: [{ label: "오시는 길", href: "/#location" }],
    },
  },
];

/** Shared by DesktopNav/MobileNav for `aria-current="page"`. */
export function isNavActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * If `href` is an in-page anchor (`/path#id`) whose path matches the
 * current route, returns the target element id so the caller can
 * smooth-scroll instead of doing a full navigation. Returns `null`
 * otherwise (no hash, or the anchor belongs to a different page — in
 * that case a normal `<Link>` navigation + browser hash-scroll applies).
 */
export function sameRouteHashTarget(href: string, pathname: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const targetPath = href.slice(0, hashIndex) || "/";
  if (targetPath !== pathname) return null;
  return href.slice(hashIndex + 1);
}
