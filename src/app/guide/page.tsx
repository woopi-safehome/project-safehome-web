import type { Metadata } from "next";
import { IssueSteps } from "@/features/guide/components/IssueSteps";
import { HowItWorks } from "@/features/guide/components/HowItWorks";
import { GradeGuide } from "@/features/guide/components/GradeGuide";
import { Cautions } from "@/features/guide/components/Cautions";
import { Faq } from "@/features/guide/components/Faq";
import { CallToAction } from "@/features/guide/components/CallToAction";

export const metadata: Metadata = {
  title: "이용 방법 — SafeHome",
  description: "등기부등본 PDF 받는 법부터 결과 보는 법, 계약 전에 챙길 일까지 차례대로 안내해요.",
};

/** 라우팅과 조립만 한다. 안내 내용은 guide 기능이 갖는다. */
export default function GuidePage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-brand-soft/60 via-canvas to-canvas">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-14 sm:px-6">
          <p className="text-sm font-medium text-brand">이용 방법</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">처음이라도 어렵지 않아요</h1>
          <p className="max-w-xl text-base leading-relaxed text-muted">
            등기부등본 받는 법부터 결과 보는 법, 계약 전에 챙길 일까지 차례대로 알려 드릴게요.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-20 sm:px-6">
        <IssueSteps />
        <HowItWorks />
        <GradeGuide />
        <Cautions />
        <Faq />
        <CallToAction />
      </div>
    </main>
  );
}
