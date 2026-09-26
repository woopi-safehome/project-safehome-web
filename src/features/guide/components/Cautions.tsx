import type { ComponentType, SVGProps } from "react";
import { ClockIcon, DocumentIcon, InfoIcon, LockIcon, ScaleIcon, SearchIcon } from "@/shared/ui/icons";
import { PublicChecks } from "@/shared/ui/PublicChecks";
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
    title: "참고용 정보예요",
    body: "법률 자문이나 권리를 보증하는 게 아니에요. 최종 판단은 공인중개사나 법률 전문가와 함께 해 주세요.",
    emphasis: true,
  },
  {
    Icon: SearchIcon,
    title: "등기부에 없는 건 볼 수 없어요",
    body: "먼저 사는 세입자, 집주인의 세금 체납, 집값에 비해 보증금이 너무 높은지(깡통전세)는 등기부에 나오지 않아요. 아래 공공 서비스에서 확인해 보세요.",
    emphasis: true,
  },
  {
    Icon: ClockIcon,
    title: "계약하는 날 한 번 더 보세요",
    body: "등기부는 하루 사이에도 바뀔 수 있어요. 계약서를 쓸 때와 잔금을 보내기 직전에 새로 떼어 확인해 주세요.",
  },
  {
    Icon: DocumentIcon,
    title: "원본 PDF를 올려 주세요",
    body: "인터넷등기소에서 저장한 PDF만 읽을 수 있어요. 사진이나 스캔한 파일은 글자를 읽지 못해요.",
  },
  {
    Icon: LockIcon,
    title: "개인정보가 담긴 문서예요",
    body: "등기부에는 소유자 이름과 주소가 들어 있어요. 로그인 없이 분석한 결과는 올린 브라우저에서만 열리고, 링크를 보내도 다른 사람은 볼 수 없어요.",
  },
  {
    Icon: InfoIcon,
    title: "하루에 할 수 있는 횟수가 있어요",
    body: "여러 분이 함께 쓰실 수 있게 하루 분석 횟수를 정해 두었어요. 다 쓰시면 다음 날 다시 이용할 수 있어요.",
  },
];

export function Cautions() {
  return (
    <section aria-labelledby="caution-title" className="flex flex-col gap-10">
      <SectionHeading
        id="caution-title"
        eyebrow="알아 두면 좋아요"
        title="분석 전에 알아 두실 것들"
        description="좋은 등급이 나와도 안심하긴 조금 일러요. 이 서비스가 볼 수 있는 것과 볼 수 없는 것을 먼저 말씀드릴게요."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAUTIONS.map(({ Icon, title, body, emphasis }) => (
          <li
            key={title}
            className={`flex gap-4 rounded-3xl p-5 ${
              emphasis === true ? "bg-caution-soft ring-1 ring-caution/15" : "bg-surface ring-1 ring-line/70"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                emphasis === true ? "bg-surface text-caution" : "bg-brand-soft text-brand"
              }`}
            >
              <Icon />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* "못 본다"로 끝내지 않고 어디서 보는지까지 알려 준다. */}
      <PublicChecks title="등기부에 안 나오는 건 여기서 확인해 보세요" />
    </section>
  );
}
