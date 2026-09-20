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
};

/** 어느 jobId 의 결과인지 함께 들고 있는다. 주소가 바뀌면 옛 결과가 잠깐 비치는 것을 막는다. */
type Held = ResultState & { of: string };

function messageOf(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.code === "NETWORK_ERROR") return "네트워크 연결을 확인하세요.";
    if (e.code === "NOT_FOUND") return "결과를 찾을 수 없습니다.";
    return `서버 오류가 발생했습니다. (${e.status})`;
  }
  return "알 수 없는 오류가 발생했습니다.";
}

export function useResult(jobId: string): ResultState & { reload: () => void } {
  const [held, setHeld] = useState<Held>({ of: jobId, job: null, loading: true, error: null });
  // 값이 바뀌어야 효과가 다시 돈다. 재조회는 이 값을 올리는 것으로 표현한다.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let left = false;

    getJob(jobId)
      .then((job) => {
        if (!left) setHeld({ of: jobId, job, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (!left) setHeld({ of: jobId, job: null, loading: false, error: messageOf(e) });
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
    reload,
  };
}
