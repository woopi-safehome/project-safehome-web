import Link from "next/link";
import { DeedUploadForm } from "@/features/analysis/components/DeedUploadForm";
import { HowItWorks } from "@/features/guide/components/HowItWorks";
import { CheckCoverage } from "@/features/guide/components/CheckCoverage";
import { GradeGuide } from "@/features/guide/components/GradeGuide";
import { CallToAction } from "@/features/guide/components/CallToAction";
import { HeroIllustration } from "@/shared/ui/illustrations";
import { ClockIcon, ListCheckIcon, LockIcon } from "@/shared/ui/icons";
import { card } from "@/shared/ui/styles";

/**
 * 라우팅과 조립만 한다. 화면의 로직은 features 가 갖는다.
 *
 * 첫 화면은 "이게 뭐고, 바로 써 볼 수 있나?"에 답한다 — 업로드와 무엇을 봐 주는지까지만 둔다.
 * 준비물(등기부 받는 법)·주의사항·자주 묻는 질문은 `/guide` 가 갖는다. 같은 구역을 두 페이지에 두면
 * "이용 방법"을 눌러도 새로운 게 없어 보여서, 한 구역은 한 페이지에만 둔다.
 */
const TRUST_POINTS = [
  { Icon: LockIcon, label: "회원가입 없이" },
  { Icon: ClockIcon, label: "1분 정도면 끝나요" },
  { Icon: ListCheckIcon, label: "11가지 항목 확인" },
] as const;

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft/60 via-canvas to-canvas">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium text-brand">전세·월세 계약을 앞두고 계신가요?</p>
            <h1 className="text-3xl font-bold leading-snug tracking-tight sm:text-[2.75rem] sm:leading-[1.25]">
              도장 찍기 전에,
              <br />
              <span className="text-brand">등기부</span>부터 같이 확인해요
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted sm:text-[17px]">
              등기부등본은 처음 보면 무엇이 중요한지 알기 어려워요. PDF를 올려 주시면 보증금에 영향을 줄 수 있는 내용을
              찾아서 쉬운 말로 풀어 드릴게요.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {TRUST_POINTS.map(({ Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <Icon width={16} height={16} className="text-brand" />
                  {label}
                </li>
              ))}
            </ul>
            <HeroIllustration className="hidden h-56 w-auto self-start opacity-90 lg:block" />
          </div>

          <div id="analyze" className={`${card} scroll-mt-24 p-6 sm:p-8`}>
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="text-xl font-bold">등기부등본 올리기</h2>
              <p className="text-sm text-muted">인터넷등기소에서 저장한 PDF 파일이면 돼요.</p>
            </div>
            <DeedUploadForm />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-20 sm:px-6">
        <HowItWorks />
        <CheckCoverage />
        <GradeGuide />
        <p className="-mt-14 text-sm text-muted">
          등기부등본 받는 법, 분석 전에 알아 둘 점, 자주 묻는 질문은{" "}
          <Link href="/guide" className="font-medium text-brand underline-offset-4 hover:underline">
            이용 방법
          </Link>
          에 모아 뒀어요.
        </p>
        <CallToAction />
      </div>
    </main>
  );
}
