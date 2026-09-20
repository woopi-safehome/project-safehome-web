"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/shared/api/client";
import { streamJobEvents } from "@/shared/api/stream";
import type { AnalysisStep } from "@/shared/api/contract";
import { getJob, type DeedJob } from "./api";

/**
 * 분석 진행 상태. 이 기능에서 가장 복잡한 곳이다.
 *
 * ```
 * 구독 시작 → 단계 이벤트 수신 → (완료 수신) → 결과 조회 → 완료
 * ```
 *
 * **끝나는 경우가 셋이다** — 정상 완료, 실패 이벤트, **스트림의 비정상 종료.**
 * 세 번째를 빠뜨리면 연결이 끊겼을 때 화면이 영원히 진행 중으로 남는다. 그래서 재시도 경로를 둔다.
 */

/**
 * 각 단계를 최소 이만큼은 붙잡아 둔다.
 *
 * **이 지연은 의도된 것이다.** 단계 전환이 너무 빠르면 사용자가 무엇이 일어났는지 인지하지 못하고
 * 화면이 깜빡이며 넘어간다. 진행이 느려 보인다고 지우면 그 증상이 돌아온다.
 * 서버가 실제로 걸린 시간과 화면 표시가 어긋나는 이유이기도 하다.
 */
const MIN_STEP_DISPLAY_MS = 1500;

export type AnalyzingState = {
  displayStep: AnalysisStep;
  job: DeedJob | null;
  error: string | null;
  completed: boolean;
};

const INITIAL: AnalyzingState = {
  displayStep: "PDF_PARSING",
  job: null,
  error: null,
  completed: false,
};

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

function messageOf(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.code === "NETWORK_ERROR") return "네트워크 연결을 확인하세요.";
    return `서버 오류가 발생했습니다. (${e.status})`;
  }
  return "알 수 없는 오류가 발생했습니다.";
}

type Emit = (next: (prev: AnalyzingState) => AnalyzingState) => void;

async function run(jobId: string, signal: AbortSignal, emit: Emit): Promise<void> {
  let shownStep: AnalysisStep = INITIAL.displayStep;
  let shownAt = Date.now();

  /**
   * 지금 보이는 단계가 최소 시간을 채울 때까지 기다린다.
   * 기다리는 동안 스트림을 읽지 않으므로, 서버가 앞서 나가면 단계가 큐처럼 밀려서 차례로 표시된다.
   */
  async function hold(): Promise<void> {
    const remaining = MIN_STEP_DISPLAY_MS - (Date.now() - shownAt);
    if (remaining > 0) await sleep(remaining, signal);
    shownAt = Date.now();
  }

  for await (const event of streamJobEvents(jobId, signal)) {
    if (event.step !== null && event.step !== shownStep) {
      await hold();
      shownStep = event.step;
      emit((s) => ({ ...s, displayStep: shownStep }));
    }

    if (event.status === "COMPLETED") {
      let job: DeedJob;
      try {
        // 완료 이벤트에 결과가 없다. 여기서 따로 조회한다.
        job = await getJob(jobId);
      } catch {
        emit((s) => ({ ...s, error: "결과를 불러오지 못했습니다." }));
        return;
      }
      await hold();
      emit((s) => ({ ...s, job, completed: true }));
      return;
    }

    if (event.status === "FAILED") {
      await hold();
      emit((s) => ({ ...s, error: "분석에 실패했습니다. 다시 시도해주세요." }));
      return;
    }
  }

  // 완료도 실패도 받지 못한 채 스트림이 닫혔다 — 세 번째 종료 경우.
  emit((s) => ({ ...s, error: "연결이 끊어졌습니다. 다시 시도해주세요." }));
}

export function useAnalyzing(jobId: string) {
  const [state, setState] = useState<AnalyzingState>(INITIAL);
  // 값이 바뀌어야 효과가 다시 돈다. 재시도는 이 값을 올리는 것으로 표현한다.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // 떠난 뒤의 갱신은 버린다. 개발 모드에서 효과가 두 번 도는 경우도 여기서 걸러진다.
    const emit: Emit = (next) => {
      if (!controller.signal.aborted) setState(next);
    };

    run(jobId, controller.signal, emit).catch((e) => {
      if (controller.signal.aborted) return;
      emit((s) => ({ ...s, error: messageOf(e) }));
    });

    return () => controller.abort();
  }, [jobId, attempt]);

  const retry = useCallback(() => {
    setState(INITIAL);
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
