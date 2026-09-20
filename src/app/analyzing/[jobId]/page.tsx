import { AnalyzingView } from "@/features/analysis/components/AnalyzingView";

/**
 * 라우팅과 조립만 한다. 진행 표시의 로직은 features 가 갖는다.
 */
export default async function AnalyzingPage(props: PageProps<"/analyzing/[jobId]">) {
  const { jobId } = await props.params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <h1 className="text-xl font-semibold sm:text-2xl">분석 중</h1>
      <AnalyzingView jobId={jobId} />
    </main>
  );
}
