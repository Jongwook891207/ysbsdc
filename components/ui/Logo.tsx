import Image from "next/image";
import Link from "next/link";

/** Ports `.logo` from index.html: mark image + "연세[백세]치과의원" wordmark. */
export function Logo() {
  return (
    <Link href="/" className="logo">
      <Image
        src="/images/logo.png"
        alt="부천 오정구 원종동 고강동 연세백세치과의원 로고"
        className="logo-img"
        width={34}
        height={34}
        priority
      />
      <span className="logo-text">
        연세<span className="logo-highlight">백세</span>치과의원
      </span>
    </Link>
  );
}
