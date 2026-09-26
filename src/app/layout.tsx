import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { SiteHeader } from "@/shared/ui/SiteHeader";
import { SiteFooter } from "@/shared/ui/SiteFooter";
import "./globals.css";

/**
 * 한글 글꼴. 이전 글꼴(Geist)은 라틴 문자만 있어 한글은 시스템 글꼴로 떨어졌다 —
 * 운영체제마다 화면이 달라 보였다. 한글 글리프는 쓰는 글자 범위만 나눠 받는다.
 */
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "등기부 분석 — 계약 전에 등기부등본부터 확인해요",
  description:
    "전세·월세 계약 전에 등기부등본 PDF를 올려 보세요. 보증금에 영향을 줄 수 있는 내용을 AI가 찾아 쉬운 말로 알려 드려요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
