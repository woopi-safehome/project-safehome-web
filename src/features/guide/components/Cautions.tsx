import type { ComponentType, SVGProps } from "react";
import { ClockIcon, DocumentIcon, InfoIcon, LockIcon, ScaleIcon, SearchIcon } from "@/shared/ui/icons";
import { SectionHeading } from "./SectionHeading";

/**
 * 주의사항. **이 서비스가 보지 못하는 것**을 먼저 말한다 —
 * 등기부만으로는 알 수 없는 위험을 숨기면, 좋은 등급이 오히려 사용자를 안심시켜 버린다.
 */
type Caution = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  emphasis?: boolean;
};

const CAUTIONS: Caution[] = [
  {
    Icon: ScaleIcon,
    title: "분석은 참고 정보예요",
    body: "법률 자문이나 권리 보증이 아니에요. 최종 판단은 공인중개사·법률 전문가와 함께 하세요.",
    emphasis: true,
  },
  {
    Icon: SearchIcon,
    title: "등기부에 없는 위험은 못 봐요",
    body: "선순위 임차인(전입세대 열람), 집주인의 세금 체납(납세증명서), 시세 대비 보증금(깡통전세)은 따로 확인해야 해요.",
    emphasis: true,
  },
  {
    Icon: ClockIcon,
    title: "계약 당일에 다시 확인하세요",
    body: "등기부는 하루 만에도 바뀔 수 있어요. 계약서 작성과 잔금 지급 직전에 새로 발급해 변동을 확인하세요.",
  },
  {
    Icon: DocumentIcon,
    title: "원본 PDF 를 올려 주세요",
    body: "인터넷등기소에서 저장한 PDF 만 읽을 수 있어요. 사진이나 스캔한 파일은 글자를 인식하지 못해요.",
  },
  {
    Icon: LockIcon,
    title: "개인정보가 담긴 문서예요",
    body: "등기부에는 소유자 이름과 주소가 있어요. 로그인하지 않고 분석한 결과는 올린 브라우저에서만 볼 수 있고, 링크를 공유해도 열리지 않아요.",
  },
  {
    Icon: InfoIcon,
    title: "하루 분석 횟수가 정해져 있어요",
    body: "많은 분이 함께 쓸 수 있도록 하루에 할 수 있는 분석 수를 제한해요. 넘기면 다음 날 다시 이용할 수 있어요.",
  },
];

export function Cautions() {
  return (
    <section aria-labelledby="caution-title" className="flex flex-col gap-12">
      <SectionHeading
        id="caution-title"
        eyebrow="주의사항"
        title="분석 전에 꼭 알아두세요"
        description="등급이 좋다고 해서 안심하기엔 이릅니다. 서비스가 할 수 있는 것과 없는 것을 먼저 알려드려요."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAUTIONS.map(({ Icon, title, body, emphasis }) => (
          <li
            key={title}
            className={`flex gap-4 rounded-2xl border p-5 ${
              emphasis === true ? "border-caution/30 bg-caution-soft" : "border-line bg-surface"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                emphasis === true ? "bg-surface text-caution" : "bg-brand-soft text-brand"
              }`}
            >
              <Icon />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
