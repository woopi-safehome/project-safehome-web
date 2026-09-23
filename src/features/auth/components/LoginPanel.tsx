"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/shared/config/env";
import { ApiError } from "@/shared/api/client";
import { HistoryIllustration } from "@/shared/ui/illustrations";
import { CheckCircleIcon, InfoIcon } from "@/shared/ui/icons";
import { card } from "@/shared/ui/styles";
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

const BENEFITS = ["분석한 등기부등본을 언제든 다시 보기", "여러 집을 비교할 수 있는 분석 이력", "다른 기기에서도 이어 보기"] as const;

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
    <div className={`${card} flex w-full max-w-md flex-col items-center gap-6 p-8 text-center shadow-xl shadow-brand/5`}>
      <HistoryIllustration className="h-36 w-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">로그인하고 이력을 남기세요</h2>
        <p className="text-sm text-muted">로그인하면 분석한 등기부등본을 다시 볼 수 있습니다.</p>
      </div>

      <ul className="flex w-full flex-col gap-2 rounded-2xl bg-surface-muted p-4 text-left">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm">
            <CheckCircleIcon width={18} height={18} className="shrink-0 text-brand" />
            {b}
          </li>
        ))}
      </ul>

      {error !== null && (
        <p role="alert" className="w-full rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void start()}
        disabled={!configured || working}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-semibold text-black/85 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {working ? "로그인 중…" : "카카오로 시작하기"}
      </button>

      {!configured && (
        <p role="status" className="flex items-start gap-1.5 text-left text-xs leading-relaxed text-muted">
          <InfoIcon width={14} height={14} className="mt-0.5 shrink-0" />
          카카오 로그인 설정이 아직 없습니다. 지금은 로그인 없이 분석만 할 수 있습니다.
        </p>
      )}
    </div>
  );
}
