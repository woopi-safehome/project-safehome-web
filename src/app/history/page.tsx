import { HistoryList } from "@/features/history/components/HistoryList";
import { AccountActions } from "@/features/auth/components/AccountActions";

/**
 * 라우팅과 조립만 한다. 목록과 계정 동작은 각 기능이 갖는다 —
 * 기능끼리 가로로 참조하지 않으므로 둘을 나란히 두는 일은 여기서 한다.
 */
export default function HistoryPage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-10 sm:py-14">
      <div className="flex w-full max-w-2xl flex-col gap-1">
        <p className="text-sm font-semibold text-brand">내 기록</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">분석 이력</h1>
      </div>
      <HistoryList />
      <AccountActions />
    </main>
  );
}
