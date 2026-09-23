import { ChevronDownIcon } from "@/shared/ui/icons";
import { SectionHeading } from "./SectionHeading";

/**
 * 자주 묻는 질문. 서버가 정하는 숫자(하루 횟수·파일 크기)는 적지 않는다 —
 * 서버 설정이 바뀌면 여기만 거짓이 된다. 넘으면 서버가 이유를 알려 준다.
 */
const FAQ = [
  {
    q: "로그인해야 쓸 수 있나요?",
    a: "아니요. 로그인 없이 바로 분석할 수 있어요. 다만 비회원 결과는 올린 브라우저에서만 볼 수 있어서, 창을 닫거나 쿠키를 지우면 다시 찾을 수 없어요. 이력을 남기려면 로그인하세요.",
  },
  {
    q: "올린 PDF 파일은 저장되나요?",
    a: "PDF 원본은 분석에만 쓰고 보관하지 않아요. 분석 결과는 다시 볼 수 있도록 저장돼요.",
  },
  {
    q: "분석은 얼마나 걸리나요?",
    a: "보통 1분 안팎이에요. 권리 이력이 긴 등기부는 조금 더 걸릴 수 있어요. 분석 중에는 창을 닫지 말아 주세요.",
  },
  {
    q: "‘안전’이 나오면 계약해도 되나요?",
    a: "등기부상 위험 신호가 없다는 뜻이지, 계약이 안전하다는 보증은 아니에요. 선순위 임차인·세금 체납·시세 대비 보증금은 등기부로 알 수 없으니 꼭 따로 확인하세요.",
  },
  {
    q: "전세·월세 선택은 왜 하나요?",
    a: "같은 등기부라도 계약 유형에 따라 위험의 의미가 달라요. 전세는 보증금 전액 회수, 월세는 소액 보증금 최우선변제 중심으로 설명해 드려요. 고르지 않으면 두 유형 공통 관점으로 분석해요.",
  },
  {
    q: "분석 결과가 이상해요.",
    a: "AI 가 문서를 읽는 과정에서 일부 내용을 놓치거나 잘못 읽을 수 있어요. 결과의 근거가 된 항목을 등기부 원문과 대조해 보고, 중요한 결정 전에는 전문가 확인을 받으세요.",
  },
] as const;

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="flex flex-col gap-12">
      <SectionHeading id="faq-title" eyebrow="FAQ" title="자주 묻는 질문" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group rounded-2xl border border-line bg-surface open:border-brand/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDownIcon className="shrink-0 text-subtle transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
