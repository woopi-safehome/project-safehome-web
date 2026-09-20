import { HistoryList } from "@/features/history/components/HistoryList";
import { AccountActions } from "@/features/auth/components/AccountActions";

/**
 * 라우팅과 조립만 한다. 목록과 계정 동작은 각 기능이 갖는다 —
 * 기능끼리 가로로 참조하지 않으므로 둘을 나란히 두는 일은 여기서 한다.
 */
export default function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold sm:text-2xl">분석 이력</h1>
      <HistoryList />
      <AccountActions />
    </main>
  );
}
