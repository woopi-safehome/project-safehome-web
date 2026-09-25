import { IssueIllustration } from "@/shared/ui/illustrations";
import { card } from "@/shared/ui/styles";
import { SectionHeading } from "./SectionHeading";

/**
 * 등기부등본 발급 안내. 이 서비스가 읽을 수 있는 것은 인터넷등기소가 만든 PDF 뿐이라,
 * 그것을 얻는 방법까지 알려 줘야 첫 방문자가 막히지 않는다.
 *
 * 인터넷등기소의 화면 구성과 수수료는 바뀔 수 있다. 달라졌으면 여기를 고친다.
 */
const IROS_URL = "https://www.iros.go.kr";

const STEPS = [
  {
    title: "인터넷등기소에 로그인",
    body: "대법원 인터넷등기소에 들어가 로그인해 주세요. 열람하려면 회원 로그인이 필요해요.",
  },
  {
    title: "‘열람하기’에서 집 찾기",
    body: "위쪽 메뉴에서 열람(또는 발급)을 누르고, 계약할 집 주소로 검색해요.",
    tip: "아파트·빌라·오피스텔은 ‘집합건물’, 단독주택은 ‘건물’로 나와요.",
  },
  {
    title: "‘등기사항전부증명서’ 고르기",
    body: "검색 결과에서 동과 호수가 맞는지 확인하고, 등기사항전부증명서를 선택해요.",
    tip: "호수가 다르면 전혀 다른 집을 분석하게 돼요. 계약서 주소와 꼭 맞춰 보세요.",
  },
  {
    title: "수수료 결제",
    body: "열람 수수료는 건당 몇백 원 정도예요. 카드나 휴대폰으로 결제할 수 있어요.",
  },
  {
    title: "PDF로 저장",
    body: "열람 화면의 저장 버튼이나 인쇄 → ‘PDF로 저장’으로 파일을 만들어 주세요.",
    tip: "화면을 캡처하거나 사진으로 찍은 파일은 글자를 읽을 수 없어요.",
  },
] as const;

export function IssueSteps() {
  return (
    <section aria-labelledby="issue" className="flex flex-col gap-10">
      <SectionHeading
        id="issue"
        eyebrow="준비하기"
        title="등기부등본 PDF 받는 법"
        description="등기부등본은 누구나 인터넷등기소에서 볼 수 있어요. 집주인 동의도 필요 없어요."
      />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className={`${card} flex flex-col items-center gap-5 p-8 text-center lg:sticky lg:top-24`}>
          <IssueIllustration className="h-44 w-auto" />
          <p className="text-sm leading-relaxed text-muted">
            계약하려는 집의 <strong className="font-semibold text-ink">정확한 동·호수</strong>로 뗀
            <br />
            최신 등기부등본이 필요해요.
          </p>
          <a
            href={IROS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-brand ring-1 ring-line hover:ring-brand/40"
          >
            인터넷등기소 열기 ↗
          </a>
        </div>
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className={`${card} flex gap-4 p-5`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
                {"tip" in step && (
                  <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs leading-relaxed text-muted">{step.tip}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
