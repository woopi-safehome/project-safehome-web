import { IssueIllustration } from "@/shared/ui/illustrations";
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
    title: "인터넷등기소 접속 · 로그인",
    body: "대법원 인터넷등기소에 접속해 로그인하세요. 열람·발급에는 회원 로그인이 필요해요.",
  },
  {
    title: "‘열람하기’ → 부동산 등기",
    body: "상단 메뉴에서 열람(또는 발급)을 고르고, 계약할 집의 주소를 입력해 찾으세요.",
    tip: "아파트·빌라·오피스텔은 ‘집합건물’, 단독주택은 ‘건물’로 검색돼요.",
  },
  {
    title: "‘등기사항전부증명서’ 선택",
    body: "검색된 부동산 중 동·호수가 맞는지 확인하고, 등기사항전부증명서를 선택하세요.",
    tip: "호수가 다르면 전혀 다른 집의 분석이 돼요. 계약서 주소와 꼭 대조하세요.",
  },
  {
    title: "수수료 결제",
    body: "열람은 건당 수백 원 수준의 수수료가 있어요. 카드·휴대폰 등으로 결제할 수 있어요.",
  },
  {
    title: "PDF 로 저장",
    body: "열람 화면의 저장 기능이나 인쇄 → ‘PDF 로 저장’으로 파일을 만들어 두세요.",
    tip: "화면을 캡처하거나 사진으로 찍은 파일은 글자를 읽을 수 없어요.",
  },
] as const;

export function IssueSteps() {
  return (
    <section aria-labelledby="issue" className="flex flex-col gap-12">
      <SectionHeading
        id="issue"
        eyebrow="준비하기"
        title="등기부등본 PDF 받는 법"
        description="등기부등본은 누구나 인터넷등기소에서 열람할 수 있어요. 집주인 동의는 필요 없어요."
      />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface p-8 text-center lg:sticky lg:top-24">
          <IssueIllustration className="h-44 w-auto" />
          <p className="text-sm leading-relaxed text-muted">
            계약하려는 집의 <strong className="text-ink">정확한 동·호수</strong>로 발급한
            <br />
            최신 등기부등본이 필요해요.
          </p>
          <a
            href={IROS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-brand hover:border-brand"
          >
            인터넷등기소 바로가기 ↗
          </a>
        </div>
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-ink">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
                {"tip" in step && (
                  <p className="rounded-lg bg-brand-soft px-3 py-2 text-xs leading-relaxed text-brand-strong">
                    TIP · {step.tip}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
