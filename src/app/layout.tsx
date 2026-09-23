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
  title: "SafeHome — 등기부등본 안전 분석",
  description:
    "전세·월세 계약 전, 등기부등본 PDF 를 올리면 소유권·근저당·압류 등 보증금 위험 신호를 AI 가 정리해 드립니다.",
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
