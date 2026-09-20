"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/shared/config/env";
import { ApiError } from "@/shared/api/client";
import { loginWithKakao } from "../api";
import { getKakaoAccessToken } from "../kakao";

/**
 * 로그인 화면.
 *
 * **카카오 토큰을 얻는 부분이 비어 있다.** 그 앞단에는 카카오 JavaScript 키가 필요하고,
 * 키가 없으면 버튼을 잠근다 — 눌리는데 아무 일도 안 일어나는 버튼을 두지 않는다.
 * 키가 생기면 [`kakao.ts`](../kakao.ts) 한 곳만 채우면 이 화면은 그대로 동작한다.
 *
 * 서버에 토큰을 넘기고 이 서비스의 토큰으로 바꾸는 뒷단은 이미 있고 테스트도 있다.
 */
export function LoginPanel() {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const configured = env.kakaoJsKey !== "";

  async function start() {
    setWorking(true);
    setError(null);
    try {
      const kakaoAccessToken = await getKakaoAccessToken();
      const { isNewUser } = await loginWithKakao(kakaoAccessToken);
      // 앱과 같다 — 처음 온 사람만 소개를 거친다.
      router.replace(isNewUser ? "/onboarding" : "/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "로그인하지 못했습니다.");
      setWorking(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">로그인하고 이력을 남기세요</h2>
        <p className="text-sm text-black/60 dark:text-white/60">
          로그인하면 분석한 등기부등본을 다시 볼 수 있습니다.
        </p>
      </div>

      {error !== null && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void start()}
        disabled={!configured || working}
        className="w-full rounded-full bg-[#FEE500] px-6 py-3 text-sm font-medium text-black/85 transition-opacity disabled:opacity-40"
      >
        {working ? "로그인 중…" : "카카오로 시작하기"}
      </button>

      {!configured && (
        <p role="status" className="text-xs text-black/50 dark:text-white/50">
          카카오 로그인 설정이 아직 없습니다. 지금은 로그인 없이 분석만 할 수 있습니다.
        </p>
      )}
    </div>
  );
}
