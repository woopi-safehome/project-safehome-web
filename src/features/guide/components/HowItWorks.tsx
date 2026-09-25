import Link from "next/link";
import {
  AnalyzeIllustration,
  IssueIllustration,
  ResultIllustration,
  UploadIllustration,
} from "@/shared/ui/illustrations";
import { card } from "@/shared/ui/styles";
import { SectionHeading } from "./SectionHeading";

/** 이용 순서. 첫 방문자가 "무엇을 준비해야 하는지"부터 알 수 있게 발급 단계를 맨 앞에 둔다. */
const STEPS = [
  {
    Illustration: IssueIllustration,
    title: "등기부등본 받기",
    body: "인터넷등기소에서 계약할 집의 ‘등기사항전부증명서’를 열람하고 PDF로 저장해 주세요.",
    link: { href: "/guide#issue", label: "받는 방법 보기" },
  },
  {
    Illustration: UploadIllustration,
    title: "PDF 올리기",
    body: "파일을 올리고 전세인지 월세인지 골라 주세요. 계약 유형에 맞춰서 살펴볼게요.",
  },
  {
    Illustration: AnalyzeIllustration,
    title: "AI가 읽기",
    body: "갑구와 을구에 적힌 권리들을 하나씩 읽으면서 11가지 항목을 확인해요.",
  },
  {
    Illustration: ResultIllustration,
    title: "결과 보기",
    body: "등급과 항목별 설명, 계약 전에 챙기면 좋을 일까지 한 화면에서 볼 수 있어요.",
  },
] as const;

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="flex flex-col gap-10">
      <SectionHeading
        id="how-title"
        eyebrow="이용 방법"
        title="이렇게 진행돼요"
        description="가입할 필요 없이 바로 쓸 수 있고, 결과는 보통 1분 안팎이면 나와요."
      />
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className={`${card} flex flex-col overflow-hidden`}>
            <div className="bg-surface-muted/70 px-6 pt-6">
              <step.Illustration className="mx-auto h-36 w-auto" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-6">
              <h3 className="flex items-center gap-2.5 text-lg font-semibold">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                  {i + 1}
                </span>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              {"link" in step && (
                <Link href={step.link.href} className="mt-auto pt-2 text-sm font-medium text-brand hover:underline">
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
