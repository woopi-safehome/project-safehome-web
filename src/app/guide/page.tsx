import type { Metadata } from "next";
import { IssueSteps } from "@/features/guide/components/IssueSteps";
import { Cautions } from "@/features/guide/components/Cautions";
import { Faq } from "@/features/guide/components/Faq";
import { CallToAction } from "@/features/guide/components/CallToAction";

export const metadata: Metadata = {
  title: "이용 방법 — 등기부 분석",
  description: "등기부등본 PDF 받는 법, 분석 전에 알아 둘 점, 자주 묻는 질문을 모았어요.",
};

/**
 * 라우팅과 조립만 한다. 안내 내용은 guide 기능이 갖는다.
 *
 * 이 페이지는 "처음인데 뭘 준비하고, 뭘 조심해야 하나?"에 답한다. 진행 순서·점검 항목·등급은
 * 첫 화면이 갖는다 — 같은 구역을 두 페이지에 두지 않는다.
 */
export default function GuidePage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-brand-soft/60 via-canvas to-canvas">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-14 sm:px-6">
          <p className="text-sm font-medium text-brand">이용 방법</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">처음이라도 어렵지 않아요</h1>
          <p className="max-w-xl text-base leading-relaxed text-muted">
            등기부등본 받는 법부터 분석 전에 알아 둘 점, 자주 묻는 질문까지 여기 모아 뒀어요.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-20 sm:px-6">
        <IssueSteps />
        <Cautions />
        <Faq />
        <CallToAction />
      </div>
    </main>
  );
}
