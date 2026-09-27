import { AlertIcon, InfoIcon, ShieldCheckIcon } from "@/shared/ui/icons";
import { card } from "@/shared/ui/styles";
import { SectionHeading } from "./SectionHeading";

/**
 * 등급 읽는 법. 등급을 정하는 것은 서버다 — 여기는 뜻과 **다음에 할 일**만 설명한다.
 * '어떤 경우인지'의 예시는 분석 서버 판정 규칙(ai-api judgment.py)과 맞춘다. 규칙이 바뀌면 여기도 본다 —
 * 예시가 어긋나면 결과에서 '위험'을 받은 사용자가 안내와 다르다고 느낀다.
 * 뜻과 할 일은 결과 화면의 등급 카드(analysis/ResultView 의 SAFETY)와 같은 말로 쓴다.
 * '안전'을 "계약해도 된다"로 읽지 않도록 모든 등급에 할 일을 붙인다.
 */
const GRADES = [
  {
    Icon: ShieldCheckIcon,
    label: "안전",
    tone: "bg-safe-soft text-safe",
    meaning: "등기부에서는 걱정할 만한 기록을 찾지 못했어요.",
    next: "등기부에 안 나오는 위험은 따로 확인해 주세요. 먼저 사는 세입자, 집주인의 밀린 세금, 시세예요. 잔금 전에 등기부를 한 번 더 떼어 보는 것도 잊지 마세요.",
  },
  {
    Icon: InfoIcon,
    label: "주의",
    tone: "bg-caution-soft text-caution",
    meaning: "당장 문제는 아니어도 따져 볼 권리가 있어요. 근저당이 한두 건 있거나, 여러 사람이 나눠 가진 집이거나, 앞선 세입자의 전세권이 남아 있는 경우예요.",
    next: "근저당 금액에 내 보증금을 더해 집값과 견줘 보세요. 잔금 때 갚기로 한 근저당이 있다면, 말소 조건을 계약서 특약에 적어 두세요.",
  },
  {
    Icon: AlertIcon,
    label: "위험",
    tone: "bg-danger-soft text-danger",
    meaning: "보증금을 잃을 수 있는 기록이 있어요. 근저당이 세 건 이상이거나, 압류·가압류·경매·신탁·가등기가 있거나, 최근 3년 사이 집주인이 두 번 이상 바뀐 경우예요.",
    next: "계약금을 보내기 전에 멈추세요. 그 기록이 무엇인지 법률 전문가에게 꼭 확인받고, 설명 없이 계약을 서두르면 더 조심하세요.",
  },
] as const;

export function GradeGuide() {
  return (
    <section aria-labelledby="grade-title" className="flex flex-col gap-10">
      <SectionHeading
        id="grade-title"
        eyebrow="결과 읽는 법"
        title="결과는 세 가지 등급으로 나와요"
        description="항목 가운데 가장 나쁜 결과가 전체 등급이 돼요. 하나라도 ‘위험’이면 전체도 ‘위험’이에요."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {GRADES.map(({ Icon, label, tone, meaning, next }) => (
          <article key={label} className={`${card} flex flex-col gap-4 p-6`}>
            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${tone}`}>
              <Icon width={18} height={18} />
              {label}
            </span>
            <p className="font-medium leading-relaxed">{meaning}</p>
            <div className="mt-auto flex flex-col gap-1 rounded-2xl bg-surface-muted p-4 text-sm leading-relaxed">
              <p className="font-semibold">이렇게 해 보세요</p>
              <p className="text-muted">{next}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
