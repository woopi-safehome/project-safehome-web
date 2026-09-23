import type { ComponentType, SVGProps } from "react";
import { AlertIcon, DocumentIcon, HomeIcon, KeyIcon } from "@/shared/ui/icons";
import { SectionHeading } from "./SectionHeading";

/**
 * 점검 항목 소개. **판정 기준이 아니라 설명 문구다** — 항목과 판정은 ai-api 가 정하고,
 * 여기는 사용자가 "무엇을 봐 주는지" 이해하도록 풀어 쓴 것이다.
 * 항목이 바뀌면 ai-api README 의 체크리스트 항목 표와 맞춰 고친다.
 */
type Group = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  category: string;
  summary: string;
  items: { name: string; why: string }[];
};

const GROUPS: Group[] = [
  {
    Icon: KeyIcon,
    category: "소유권",
    summary: "집주인이 정말 이 집의 주인인가",
    items: [
      { name: "소유 형태", why: "공유지분이면 다른 공유자의 빚으로 경매될 수 있어요" },
      { name: "소유권 이전 이력", why: "짧은 기간 잦은 이전은 갭투자·전세사기의 대표 패턴이에요" },
    ],
  },
  {
    Icon: HomeIcon,
    category: "담보권",
    summary: "내 보증금보다 먼저 돌려받는 돈이 있는가",
    items: [
      { name: "근저당 설정", why: "대출 담보가 크면 경매 때 보증금이 남지 않을 수 있어요" },
      { name: "선순위 권리", why: "나보다 앞선 권리는 경매 대금에서 먼저 가져가요" },
    ],
  },
  {
    Icon: AlertIcon,
    category: "법적 위험",
    summary: "집주인이 분쟁이나 체납에 걸려 있는가",
    items: [
      { name: "가압류·가처분", why: "집주인의 채무 분쟁 신호예요" },
      { name: "압류", why: "세금 체납이면 국가가 보증금보다 먼저 가져가요" },
      { name: "경매 진행", why: "경매개시결정이 있으면 계약 자체가 위험해요" },
    ],
  },
  {
    Icon: DocumentIcon,
    category: "특수 권리",
    summary: "계약을 무력화할 수 있는 권리가 있는가",
    items: [
      { name: "전세권·임차권 등기", why: "기존 세입자의 보증금이 먼저 변제돼요" },
      { name: "신탁등기", why: "신탁사 동의 없는 계약은 보호받지 못할 수 있어요" },
      { name: "가등기", why: "본등기가 되면 임차권이 사라질 수 있어요" },
      { name: "지상권", why: "건물 사용에 제한이 생길 수 있어요" },
    ],
  },
];

export function CheckCoverage() {
  return (
    <section aria-labelledby="coverage-title" className="flex flex-col gap-12">
      <SectionHeading
        id="coverage-title"
        eyebrow="점검 항목"
        title="보증금을 지키는 데 필요한 11가지를 봐요"
        description="전세사기 피해에서 반복된 위험 신호를 기준으로, 등기부등본의 권리관계를 항목별로 확인해요."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map(({ Icon, category, summary, items }) => (
          <article key={category} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon width={22} height={22} />
              </span>
              <div>
                <h3 className="text-lg font-bold">{category}</h3>
                <p className="text-sm text-muted">{summary}</p>
              </div>
            </div>
            <ul className="flex flex-col divide-y divide-line">
              {items.map((item) => (
                <li key={item.name} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
                  <span className="w-36 shrink-0 text-sm font-semibold">{item.name}</span>
                  <span className="text-sm text-muted">{item.why}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
