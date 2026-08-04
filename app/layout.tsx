import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmartFloatingBar } from "@/components/layout/SmartFloatingBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildDentistJsonLd } from "@/lib/jsonld";
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
      </head>
      <body>
        <JsonLd data={buildDentistJsonLd()} />
        <Header />
        <main>{children}</main>
        <Footer />
        <SmartFloatingBar />
      </body>
    </html>
  );
}
