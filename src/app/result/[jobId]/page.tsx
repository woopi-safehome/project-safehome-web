import { ResultView } from "@/features/analysis/components/ResultView";
import { AnonymousNotice } from "@/features/auth/components/AnonymousNotice";

/**
 * 라우팅과 조립만 한다. 결과 표시와 로그인 여부는 각 기능이 갖는다 —
 * 기능끼리 가로로 참조하지 않으므로 둘을 나란히 두는 일은 여기서 한다.
 */
export default async function ResultPage(props: PageProps<"/result/[jobId]">) {
  const { jobId } = await props.params;

  return (
    <main className="flex flex-1 flex-col items-center gap-6 bg-gradient-to-b from-brand-soft/60 to-canvas to-40% px-4 py-10 sm:py-14">
      <div className="flex w-full max-w-3xl flex-col gap-1">
        <p className="text-sm font-medium text-brand">분석이 끝났어요</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">이 집의 등기부를 살펴봤어요</h1>
      </div>
      <AnonymousNotice />
      <ResultView jobId={jobId} />
    </main>
  );
}
