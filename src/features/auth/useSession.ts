"use client";

import { useCallback, useSyncExternalStore } from "react";
import { accessTokenSnapshot, clearTokens, subscribeTokens } from "@/shared/api/tokens";

/**
 * 로그인 여부.
 *
 * **토큰이 있다는 것과 그 토큰이 아직 유효하다는 것은 다르다.** 여기서는 유효성을 확인하지 않는다 —
 * 만료된 토큰은 서버가 401 로 답하고 통신 계층이 갱신을 시도한다.
 * 화면이 미리 확인하려 들면 서버와 판단이 갈라지고, 확인하는 동안 화면이 멈춘다.
 */

/** 서버 렌더링 시점에는 저장소가 없다. 로그인하지 않은 것으로 그린다. */
function serverSnapshot(): string | null {
  return null;
}

export function useSession() {
  const accessToken = useSyncExternalStore(subscribeTokens, accessTokenSnapshot, serverSnapshot);

  const logout = useCallback(() => {
    // 서버에 알릴 것이 없다. 토큰을 버리면 끝이다.
    clearTokens();
  }, []);

  return { isAuthenticated: accessToken !== null, logout };
}
