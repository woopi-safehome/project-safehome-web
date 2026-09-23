import Link from "next/link";
import {
  AnalyzeIllustration,
  IssueIllustration,
  ResultIllustration,
  UploadIllustration,
} from "@/shared/ui/illustrations";
import { SectionHeading } from "./SectionHeading";

/** 이용 순서. 첫 방문자가 "무엇을 준비해야 하는지"부터 알 수 있게 발급 단계를 맨 앞에 둔다. */
const STEPS = [
  {
    Illustration: IssueIllustration,
    title: "등기부등본 준비",
    body: "인터넷등기소에서 계약할 집의 ‘등기사항전부증명서’를 열람하고 PDF 로 저장하세요.",
    link: { href: "/guide#issue", label: "발급 방법 보기" },
  },
  {
    Illustration: UploadIllustration,
    title: "PDF 올리기",
    body: "파일을 올리고 전세·월세 중 계약 유형을 고르면 유형에 맞춰 분석해요.",
  },
  {
    Illustration: AnalyzeIllustration,
    title: "AI 분석",
    body: "표제부·갑구·을구를 읽고 소유권, 근저당, 압류 등 11개 항목을 점검해요.",
  },
  {
    Illustration: ResultIllustration,
    title: "결과 확인",
    body: "안전 등급과 항목별 설명, 계약 전에 꼭 해야 할 일을 정리해 드려요.",
  },
] as const;

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="flex flex-col gap-12">
      <SectionHeading
        id="how-title"
        eyebrow="이용 방법"
        title="4단계로 끝나요"
        description="회원가입 없이 바로 시작할 수 있어요. 보통 1분 안팎이면 결과가 나와요."
      />
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="bg-surface-muted/60 px-6 pt-6">
              <step.Illustration className="mx-auto h-36 w-auto" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-6">
              <p className="text-xs font-bold text-brand">STEP {i + 1}</p>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              {"link" in step && (
                <Link href={step.link.href} className="mt-auto pt-2 text-sm font-semibold text-brand hover:underline">
                  {step.link.label} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
