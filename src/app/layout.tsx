import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = IBM_Plex_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Musico",
    template: "%s | Musico",
  },
  description: "YouTube 기반 무료 음악 스트리밍과 플레이리스트를 제공하는 클래식 MP3 플레이어 웹 서비스",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Musico",
    description: "차트, 검색, 큐, 플레이리스트를 클래식 MP3 플레이어 UI로 조작하는 음악 스트리밍 서비스",
    url: "/",
    siteName: "Musico",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${display.variable} ${body.variable}`}>
        <Script id="ethereum-placeholder" strategy="beforeInteractive">
          {`
            if (typeof window !== "undefined" && typeof window.ethereum === "undefined") {
              Object.defineProperty(window, "ethereum", {
                value: {},
                writable: true,
                configurable: true
              });
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
