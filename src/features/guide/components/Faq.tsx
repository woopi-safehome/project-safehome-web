import { ChevronDownIcon } from "@/shared/ui/icons";
import { SectionHeading } from "./SectionHeading";

/**
 * 자주 묻는 질문. 서버가 정하는 숫자(하루 횟수·파일 크기)는 적지 않는다 —
 * 서버 설정이 바뀌면 여기만 거짓이 된다. 넘으면 서버가 이유를 알려 준다.
 */
const FAQ = [
  {
    q: "로그인해야 쓸 수 있나요?",
    a: "아니요, 로그인 없이 바로 쓰실 수 있어요. 다만 로그인하지 않은 결과는 올린 브라우저에서만 볼 수 있어서, 창을 닫거나 쿠키를 지우면 다시 찾기 어려워요. 기록을 남겨 두고 싶으시면 로그인해 주세요.",
  },
  {
    q: "올린 PDF 파일은 저장되나요?",
    a: "원본 PDF는 분석에만 쓰고 따로 보관하지 않아요. 분석 결과만 다시 보실 수 있게 저장해 둬요.",
  },
  {
    q: "분석은 얼마나 걸리나요?",
    a: "보통 1분 안팎이에요. 권리 기록이 긴 집은 조금 더 걸릴 수 있으니, 분석하는 동안 창은 열어 두세요.",
  },
  {
    q: "‘안전’이 나오면 계약해도 되나요?",
    a: "등기부에서 걱정할 내용이 안 보였다는 뜻이지, 계약이 안전하다고 보증하는 건 아니에요. 먼저 사는 세입자나 집주인 세금 체납, 시세는 등기부로 알 수 없으니 꼭 따로 확인해 주세요.",
  },
  {
    q: "전세·월세는 왜 고르나요?",
    a: "같은 등기부라도 계약 유형에 따라 신경 써야 할 부분이 달라요. 전세는 보증금을 온전히 돌려받을 수 있는지, 월세는 소액 보증금 보호를 중심으로 설명해요. 고르지 않으면 두 경우를 함께 봐요.",
  },
  {
    q: "결과가 좀 이상한 것 같아요.",
    a: "AI가 문서를 읽다가 일부를 놓치거나 잘못 읽을 때가 있어요. 결과에 나온 항목을 등기부 원문과 한 번 맞춰 보시고, 중요한 결정 전에는 전문가 확인을 받아 주세요.",
  },
] as const;

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="flex flex-col gap-10">
      <SectionHeading id="faq-title" eyebrow="궁금한 점" title="자주 물어보시는 것들" />
      <div className="flex w-full max-w-3xl flex-col gap-3">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group rounded-3xl bg-surface ring-1 ring-line/70 open:ring-brand/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDownIcon className="shrink-0 text-subtle transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
