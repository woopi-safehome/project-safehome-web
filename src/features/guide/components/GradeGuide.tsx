import { AlertIcon, InfoIcon, ShieldCheckIcon } from "@/shared/ui/icons";
import { card } from "@/shared/ui/styles";
import { SectionHeading } from "./SectionHeading";

/**
 * 등급 읽는 법. 등급을 정하는 것은 서버다 — 여기는 뜻과 **다음에 할 일**만 설명한다.
 * '안전'을 "계약해도 된다"로 읽지 않도록 모든 등급에 할 일을 붙인다.
 */
const GRADES = [
  {
    Icon: ShieldCheckIcon,
    label: "안전",
    tone: "bg-safe-soft text-safe",
    meaning: "등기부에서는 걱정할 만한 내용이 보이지 않았어요.",
    next: "그래도 등기부에 안 나오는 위험(먼저 사는 세입자, 집주인 세금 체납, 시세)은 따로 확인해 주세요.",
  },
  {
    Icon: InfoIcon,
    label: "주의",
    tone: "bg-caution-soft text-caution",
    meaning: "근저당처럼 한번 따져 봐야 할 권리가 있어요.",
    next: "금액과 순서를 내 보증금과 비교해 보고, 중개사에게 설명을 부탁해 보세요.",
  },
  {
    Icon: AlertIcon,
    label: "위험",
    tone: "bg-danger-soft text-danger",
    meaning: "압류나 경매, 신탁처럼 보증금을 잃을 수 있는 내용이 있어요.",
    next: "계약은 잠시 멈추고, 법률 전문가에게 꼭 확인을 받아 보세요.",
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
