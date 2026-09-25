import { ArrowRightIcon } from "./icons";

/**
 * 등기부로는 알 수 없는 것을 확인할 수 있는 공공 서비스로 이어 준다.
 *
 * 이 서비스는 등기부만 본다. 집주인의 세금 체납, 먼저 들어와 사는 세입자, 전세보증 가입 가능 여부는
 * 등기부에 나오지 않는다 — 그것을 말만 하고 끝내면 사용자는 어디서 확인하는지 모른 채 떠난다.
 *
 * **주소와 설명은 각 기관의 안내 원문으로 확인한 것이다(2026-09-23).** 기관이 페이지를 옮기거나
 * 제도가 바뀌면 여기가 낡으므로, 조건(금액 기준 등)처럼 자주 바뀌는 값은 적지 않고 원문으로 보낸다.
 */
const CHECKS = [
  {
    title: "집주인 체납과 전세보증 가입",
    body: "HUG 안심전세 앱에서 집주인의 세금 체납, 전세보증 사고 이력, 시세와 보증 가입 가능 여부를 볼 수 있어요.",
    source: "주택도시보증공사",
    href: "https://www.khug.or.kr/jeonse/web/s01/s010102.jsp",
  },
  {
    title: "이 집에 먼저 사는 세입자",
    body: "주민센터에서 전입세대확인서를 떼면 이 집에 주소를 둔 세대와 전입일을 알 수 있어요.",
    source: "정부24",
    href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=13100000305",
  },
  {
    title: "집주인의 밀린 국세",
    body: "임대차가 시작되기 전까지는 집주인 동의 없이 세무서에서 미납국세를 열람할 수 있어요. 홈택스로 미리 신청해 두세요.",
    source: "국세청",
    href: "https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?nttSn=1325154&mi=2207",
  },
] as const;

export function PublicChecks({ title = "등기부로 알 수 없는 것도 확인해 보세요" }: { title?: string }) {
  return (
    <section aria-labelledby="public-checks-title" className="rounded-3xl bg-brand-soft/70 p-5 sm:p-7">
      <h2 id="public-checks-title" className="text-base font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        아래 내용은 등기부에 나오지 않아서 SafeHome이 판단할 수 없어요. 공공 서비스에서 직접 확인하실 수 있어요.
      </p>
      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {CHECKS.map((c) => (
          <li key={c.href}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-1.5 rounded-2xl bg-surface p-4 ring-1 ring-line/70 transition hover:ring-brand/40"
            >
              <span className="text-sm font-semibold">{c.title}</span>
              <span className="text-sm leading-relaxed text-muted">{c.body}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-semibold text-brand">
                {c.source} 바로가기
                <ArrowRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
