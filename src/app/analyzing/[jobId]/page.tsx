import { AnalyzingView } from "@/features/analysis/components/AnalyzingView";

/**
 * 라우팅과 조립만 한다. 진행 표시의 로직은 features 가 갖는다.
 */
export default async function AnalyzingPage(props: PageProps<"/analyzing/[jobId]">) {
  const { jobId } = await props.params;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-gradient-to-b from-brand-soft/60 to-canvas px-4 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-semibold text-brand">AI 분석 중</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">등기부등본을 살펴보고 있어요</h1>
      </div>
      <AnalyzingView jobId={jobId} />
    </main>
  );
}
