"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/shared/api/client";
import { getMyJobs, type DeedJobSummary } from "./api";

/**
 * 분석 이력 목록.
 *
 * **더 불러오기가 실패해도 이미 있는 목록은 그대로 둔다.** 목록을 지우거나 오류 화면으로 바꾸면
 * 사용자가 보고 있던 것이 사라진다. 첫 조회의 실패만 화면 전체의 오류로 다룬다.
 */

export type HistoryState = {
  jobs: DeedJobSummary[];
  loading: boolean;
  loadingMore: boolean;
  hasNext: boolean;
  error: string | null;
};

function messageOf(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.code === "NETWORK_ERROR") return "네트워크 연결을 확인하세요.";
    // 갱신까지 실패한 뒤에야 여기 온다. 통신 계층이 이미 한 번 시도했다.
    if (e.code === "UNAUTHORIZED") return "로그인이 필요합니다.";
    return "분석 이력을 불러올 수 없습니다.";
  }
  return "알 수 없는 오류가 발생했습니다.";
}

const INITIAL: HistoryState = {
  jobs: [],
  loading: true,
  loadingMore: false,
  hasNext: false,
  error: null,
};

export function useHistory() {
  const [state, setState] = useState<HistoryState>(INITIAL);
  const [attempt, setAttempt] = useState(0);
  // 성공한 페이지만 센다. 실패한 시도로 번호가 밀리면 한 쪽이 통째로 빠진다.
  const loaded = useRef(0);

  useEffect(() => {
    let left = false;
    loaded.current = 0;

    getMyJobs(0)
      .then((page) => {
        if (left) return;
        setState({
          jobs: page.items,
          loading: false,
          loadingMore: false,
          hasNext: page.pagination.hasNext,
          error: null,
        });
      })
      .catch((e: unknown) => {
        if (!left) setState({ ...INITIAL, loading: false, error: messageOf(e) });
      });

    return () => {
      left = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  const loadMore = useCallback(async () => {
    let skip = false;
    setState((s) => {
      // 마지막 쪽이거나 이미 불러오는 중이면 아무것도 하지 않는다.
      if (!s.hasNext || s.loadingMore || s.loading) {
        skip = true;
        return s;
      }
      return { ...s, loadingMore: true };
    });
    if (skip) return;

    const next = loaded.current + 1;
    try {
      const page = await getMyJobs(next);
      loaded.current = next;
      setState((s) => ({
        ...s,
        jobs: [...s.jobs, ...page.items],
        hasNext: page.pagination.hasNext,
        loadingMore: false,
      }));
    } catch {
      // 목록은 그대로 두고 멈추기만 한다. 다시 누르면 같은 쪽을 다시 시도한다.
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, []);

  return { ...state, reload, loadMore };
}
