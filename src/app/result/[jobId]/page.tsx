import { ResultView } from "@/features/analysis/components/ResultView";

/**
 * 라우팅과 조립만 한다. 결과 표시의 로직은 features 가 갖는다.
 */
export default async function ResultPage(props: PageProps<"/result/[jobId]">) {
  const { jobId } = await props.params;

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold sm:text-2xl">분석 결과</h1>
      <ResultView jobId={jobId} />
    </main>
  );
}
