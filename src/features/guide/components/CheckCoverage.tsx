import type { ComponentType, SVGProps } from "react";
import { AlertIcon, DocumentIcon, HomeIcon, KeyIcon } from "@/shared/ui/icons";
import { card } from "@/shared/ui/styles";
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
    summary: "이 집의 진짜 주인은 누구일까",
    items: [
      { name: "소유 형태", why: "여러 사람이 나눠 가진 집이면, 다른 공유자의 빚 때문에 경매로 넘어갈 수 있어요" },
      { name: "소유권 이전 이력", why: "짧은 사이에 주인이 자주 바뀌었다면 갭투자나 전세사기에서 흔히 보이는 모습이에요" },
    ],
  },
  {
    Icon: HomeIcon,
    category: "담보권",
    summary: "내 보증금보다 먼저 받아 갈 돈이 있을까",
    items: [
      { name: "근저당 설정", why: "집을 담보로 빌린 돈이 많으면, 경매가 열렸을 때 보증금이 남지 않을 수 있어요" },
      { name: "선순위 권리", why: "나보다 앞선 권리는 경매 대금에서 먼저 돈을 받아 가요" },
    ],
  },
  {
    Icon: AlertIcon,
    category: "법적 위험",
    summary: "집주인이 빚이나 세금 문제에 얽혀 있진 않을까",
    items: [
      { name: "가압류·가처분", why: "집주인이 누군가와 돈 문제로 다투고 있다는 신호예요" },
      { name: "압류", why: "세금이 밀려 있으면 나라가 보증금보다 먼저 가져갈 수 있어요" },
      { name: "경매 진행", why: "이미 경매가 시작된 집이라면 계약을 다시 생각해 봐야 해요" },
    ],
  },
  {
    Icon: DocumentIcon,
    category: "특수 권리",
    summary: "내 계약을 흔들 수 있는 권리가 있을까",
    items: [
      { name: "전세권·임차권 등기", why: "앞서 살던 세입자의 보증금이 내 보증금보다 먼저 돌려받게 돼요" },
      { name: "신탁등기", why: "집의 권한이 신탁회사에 있어서, 동의 없이 한 계약은 보호받지 못할 수 있어요" },
      { name: "가등기", why: "나중에 본등기가 되면 내 임차권이 사라질 수도 있어요" },
      { name: "지상권", why: "건물을 쓰는 데 제약이 생길 수 있어요" },
    ],
  },
];

export function CheckCoverage() {
  return (
    <section aria-labelledby="coverage-title" className="flex flex-col gap-10">
      <SectionHeading
        id="coverage-title"
        eyebrow="무엇을 보나요"
        title="보증금과 관련된 11가지를 확인해요"
        description="전세사기 사례에서 자주 나왔던 신호들을 기준으로 골랐어요. 등기부에 적힌 권리를 하나씩 따라가며 봐요."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map(({ Icon, category, summary, items }) => (
          <article key={category} className={`${card} flex flex-col gap-5 p-6`}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon width={22} height={22} />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{category}</h3>
                <p className="text-sm text-muted">{summary}</p>
              </div>
            </div>
            <ul className="flex flex-col divide-y divide-line">
              {items.map((item) => (
                <li key={item.name} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
                  <span className="w-36 shrink-0 text-sm font-medium">{item.name}</span>
                  <span className="text-sm leading-relaxed text-muted">{item.why}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
