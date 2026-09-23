"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/shared/api/client";
import { withdraw } from "../api";
import { useSession } from "../useSession";

/**
 * 로그아웃과 회원 탈퇴.
 * **로그인하지 않았으면 아무것도 내놓지 않는다** — 누를 수 없는 버튼을 두지 않는다.
 */
export function AccountActions() {
  const { isAuthenticated, logout } = useSession();
  // 앱과 같이 둘 다 한 번 더 묻는다. 한 번에 일어나면 안 되는 일들이다.
  const [asking, setAsking] = useState<"logout" | "withdraw" | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isAuthenticated) return null;

  async function remove() {
    setWorking(true);
    setError(null);
    try {
      await withdraw();
      router.replace("/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "탈퇴하지 못했습니다.");
      setWorking(false);
      setAsking(null);
    }
  }

  const question =
    asking === "logout" ? "로그아웃 하시겠습니까?" : "탈퇴 시 모든 분석 기록이 삭제됩니다. 정말 탈퇴하시겠습니까?";

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3 border-t border-line pt-6">
      {error !== null && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {asking === null ? (
        <div className="flex items-center gap-5 text-sm">
          <button
            type="button"
            onClick={() => setAsking("logout")}
            className="underline underline-offset-4"
          >
            로그아웃
          </button>
          <button
            type="button"
            onClick={() => setAsking("withdraw")}
            className="text-muted underline underline-offset-4"
          >
            회원탈퇴
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-5 text-sm">
          <p className="whitespace-pre-line text-center text-ink">
            {question}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAsking(null)}
              className="underline underline-offset-4"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => (asking === "logout" ? logout() : void remove())}
              disabled={working}
              className="font-semibold text-danger underline underline-offset-4 disabled:opacity-40"
            >
              {working ? "처리 중…" : asking === "logout" ? "로그아웃" : "탈퇴"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
