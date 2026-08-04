import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmartFloatingBar } from "@/components/layout/SmartFloatingBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const DEFAULT_DESCRIPTION = "부천 오정구 원종동·고강동 연세백세치과의원";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      {/*
        S-Core Dream has no locally distributable font file (CDN-only
        webfont), so next/font/local isn't applicable here — this keeps
        the same CDN <link> the static HTML used. next/font would only
        become an option if a licensed local font file is obtained later.
      */}
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/S-CoreDream/S-CoreDream.css"
        />
        {/*
          Font Awesome (icon font) — kept as the CDN <link> the static site
          already used (index.html's Treatment Menu icons). Pure CSS/webfont,
          no JS bundle cost; same reasoning as the font link above.
        */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        {/*
          No site-wide Dentist/MedicalBusiness JSON-LD here — per the
          approved architecture, the complete entity is only rendered on
          the homepage (app/page.tsx). Other pages will reference it by
          @id (publisher/worksFor) once they have their own JSON-LD.
        */}
        <ScrollReveal />
        <Header />
        <main>{children}</main>
        <Footer />
        <SmartFloatingBar />
      </body>
    </html>
  );
}
