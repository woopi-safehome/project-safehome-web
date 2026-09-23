import { DeedUploadForm } from "@/features/analysis/components/DeedUploadForm";
import { HowItWorks } from "@/features/guide/components/HowItWorks";
import { CheckCoverage } from "@/features/guide/components/CheckCoverage";
import { GradeGuide } from "@/features/guide/components/GradeGuide";
import { Cautions } from "@/features/guide/components/Cautions";
import { Faq } from "@/features/guide/components/Faq";
import { CallToAction } from "@/features/guide/components/CallToAction";
import { HeroIllustration } from "@/shared/ui/illustrations";
import { CheckCircleIcon, ClockIcon, ListCheckIcon, LockIcon } from "@/shared/ui/icons";

/**
 * 라우팅과 조립만 한다. 화면의 로직은 features 가 갖는다.
 *
 * 첫 화면은 **바로 분석할 사람**과 **처음 온 사람**을 함께 받는다.
 * 업로드는 맨 위에 두어 한 번에 닿게 하고, 사용법·주의사항은 그 아래로 이어 읽게 한다.
 */
const TRUST_POINTS = [
  { Icon: LockIcon, label: "로그인 없이 바로" },
  { Icon: ClockIcon, label: "1분 안팎" },
  { Icon: ListCheckIcon, label: "11개 항목 점검" },
] as const;

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-soft/70 to-canvas">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1.5 text-xs font-semibold text-brand">
              <CheckCircleIcon width={16} height={16} />
              전세사기 예방 · 등기부등본 AI 분석
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
              계약 전에,
              <br />
              <span className="text-brand">등기부등본</span>부터 확인하세요
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              등기부등본 PDF 를 올리면 소유권·근저당·압류·신탁 등 보증금을 위협하는 신호를 AI 가 찾아
              알기 쉬운 말로 정리해 드려요.
            </p>
            <ul className="flex flex-wrap gap-2">
              {TRUST_POINTS.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-sm font-medium shadow-sm ring-1 ring-line"
                >
                  <Icon width={16} height={16} className="text-brand" />
                  {label}
                </li>
              ))}
            </ul>
            <HeroIllustration className="hidden h-60 w-auto self-start lg:block" />
          </div>

          <div
            id="analyze"
            className="scroll-mt-24 rounded-3xl border border-line bg-surface p-6 shadow-xl shadow-brand/5 sm:p-8"
          >
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="text-xl font-bold">등기부등본 분석하기</h2>
              <p className="text-sm text-muted">인터넷등기소에서 받은 PDF 를 올려 주세요.</p>
            </div>
            <DeedUploadForm />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-20 sm:px-6">
        <HowItWorks />
        <CheckCoverage />
        <GradeGuide />
        <Cautions />
        <Faq />
        <CallToAction />
      </div>
    </main>
  );
}
