import { ResultView } from "@/features/analysis/components/ResultView";
import { AnonymousNotice } from "@/features/auth/components/AnonymousNotice";

/**
 * 라우팅과 조립만 한다. 결과 표시와 로그인 여부는 각 기능이 갖는다 —
 * 기능끼리 가로로 참조하지 않으므로 둘을 나란히 두는 일은 여기서 한다.
 */
export default async function ResultPage(props: PageProps<"/result/[jobId]">) {
  const { jobId } = await props.params;

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold sm:text-2xl">분석 결과</h1>
      <ResultView jobId={jobId} />
      <AnonymousNotice />
    </main>
  );
}
