import { AlertIcon, InfoIcon, ShieldCheckIcon } from "@/shared/ui/icons";
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
    meaning: "등기부에서 위험 신호가 발견되지 않았어요.",
    next: "등기부 밖의 위험(선순위 임차인·세금 체납·시세)은 따로 확인하세요.",
  },
  {
    Icon: InfoIcon,
    label: "주의",
    tone: "bg-caution-soft text-caution",
    meaning: "근저당·선순위 권리처럼 따져 봐야 할 권리가 있어요.",
    next: "금액과 순위를 보증금과 비교하고, 중개사에게 설명을 요청하세요.",
  },
  {
    Icon: AlertIcon,
    label: "위험",
    tone: "bg-danger-soft text-danger",
    meaning: "압류·경매·신탁처럼 보증금을 잃을 수 있는 신호가 있어요.",
    next: "계약을 서두르지 말고, 반드시 법률 전문가의 확인을 받으세요.",
  },
] as const;

export function GradeGuide() {
  return (
    <section aria-labelledby="grade-title" className="flex flex-col gap-12">
      <SectionHeading
        id="grade-title"
        eyebrow="결과 읽는 법"
        title="세 가지 등급으로 알려드려요"
        description="가장 나쁜 항목 하나가 전체 등급을 정해요. 위험 항목이 하나라도 있으면 ‘위험’이에요."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {GRADES.map(({ Icon, label, tone, meaning, next }) => (
          <article key={label} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ${tone}`}>
              <Icon width={18} height={18} />
              {label}
            </span>
            <p className="font-semibold leading-relaxed">{meaning}</p>
            <p className="mt-auto rounded-xl bg-surface-muted p-3 text-sm leading-relaxed text-muted">
              <span className="font-semibold text-ink">다음 할 일 · </span>
              {next}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
