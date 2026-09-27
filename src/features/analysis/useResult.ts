"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/shared/api/client";
import { getJob, type DeedJob } from "./api";

/**
 * 결과 조회. 분석중 화면에서 넘어오지만 **주소로 바로 들어올 수도 있으므로** 여기서 다시 조회한다.
 * 앞 화면이 들고 있던 값을 넘겨받는 구조로 만들면 새로고침에서 빈 화면이 된다.
 */

export type ResultState = {
  job: DeedJob | null;
  loading: boolean;
  error: string | null;
  /** 다시 불러와도 같은 답이 오는 실패(권한 없음)면 false. 화면이 '다시 시도'를 내놓지 않는다. */
  retryable: boolean;
};

/** 어느 jobId 의 결과인지 함께 들고 있는다. 주소가 바뀌면 옛 결과가 잠깐 비치는 것을 막는다. */
type Held = ResultState & { of: string };

/**
 * 결과는 분석한 사람만 볼 수 있다 — 비회원은 업로드한 브라우저(익명 쿠키), 회원은 본인.
 * 링크를 다른 브라우저·기기에서 열면 403 이 온다. 고장이 아니므로 '서버 오류'로 보이면 안 된다.
 */
export const FORBIDDEN_MESSAGE = "이 결과는 분석한 브라우저에서만 볼 수 있어요.";

function isForbidden(e: unknown): boolean {
  return e instanceof ApiError && e.status === 403;
}

function messageOf(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.code === "NETWORK_ERROR") return "네트워크 연결을 확인하세요.";
    if (e.code === "NOT_FOUND") return "결과를 찾을 수 없습니다.";
    if (isForbidden(e)) return FORBIDDEN_MESSAGE;
    return `서버 오류가 발생했습니다. (${e.status})`;
  }
  return "알 수 없는 오류가 발생했습니다.";
}

export function useResult(jobId: string): ResultState & { reload: () => void } {
  const [held, setHeld] = useState<Held>({ of: jobId, job: null, loading: true, error: null, retryable: true });
  // 값이 바뀌어야 효과가 다시 돈다. 재조회는 이 값을 올리는 것으로 표현한다.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let left = false;

    getJob(jobId)
      .then((job) => {
        if (!left) setHeld({ of: jobId, job, loading: false, error: null, retryable: true });
      })
      .catch((e: unknown) => {
        if (!left) setHeld({ of: jobId, job: null, loading: false, error: messageOf(e), retryable: !isForbidden(e) });
      });

    return () => {
      left = true;
    };
  }, [jobId, attempt]);

  const reload = useCallback(() => {
    setHeld((s) => ({ ...s, loading: true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  // 들고 있는 것이 다른 작업의 결과라면 아직 불러오는 중이다.
  const stale = held.of !== jobId;

  return {
    job: stale ? null : held.job,
    loading: stale || held.loading,
    error: stale ? null : held.error,
    retryable: stale || held.retryable,
    reload,
  };
}
