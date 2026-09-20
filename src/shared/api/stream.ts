import { ApiError, authorizedFetch } from "./client";
import type { AnalysisStep, JobStatus } from "./contract";

/**
 * 분석 진행 상황 구독 (SSE).
 *
 * **`EventSource` 를 쓸 수 없다.** 인증이 Bearer 헤더뿐인데 `EventSource` 는 헤더를 붙이지 못한다.
 * 그래서 fetch 로 열고 본문 스트림을 직접 읽는다 — 앱이 같은 이유로 같은 일을 한다.
 *
 * **이 응답만 봉투에 감싸이지 않는다.** 이벤트 페이로드가 그대로 온다.
 * 서버는 status 가 COMPLETED 또는 FAILED 이면 스트림을 닫으므로, 그때 이 반복도 끝난다.
 */

export type JobEvent = {
  jobId: string;
  status: JobStatus;
  step: AnalysisStep | null;
  message: string;
  /** 오프셋 없는 로컬 시각이다. Date 로 파싱하면 브라우저 시간대로 해석되어 어긋난다. */
  timestamp: string;
};

/** 열지 못한 경우 봉투에서 코드를 꺼내 본다. 스트림이 아니라 에러 응답이 왔을 때다. */
async function openFailure(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    if (body?.type === "error") return new ApiError(body.code, body.message, res.status);
  } catch {
    // 아래 기본 오류로 떨어진다.
  }
  return new ApiError("STREAM_FAILED", "분석 진행 상황을 받지 못했습니다.", res.status);
}

export async function* streamJobEvents(
  jobId: string,
  signal?: AbortSignal,
): AsyncGenerator<JobEvent> {
  const res = await authorizedFetch(`/api/deed/jobs/${jobId}/stream`, {
    headers: { Accept: "text/event-stream" },
    signal,
  });

  if (!res.ok || res.body === null) throw await openFailure(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      // 청크가 줄 중간에서 잘린다. 마지막 조각은 다음 청크와 이어 붙여야 한다.
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice("data:".length).trim();
        if (payload === "") continue;

        try {
          yield JSON.parse(payload) as JobEvent;
        } catch {
          throw new ApiError("INVALID_RESPONSE", "진행 상황을 해석하지 못했습니다.", res.status);
        }
      }
    }
  } finally {
    // 화면이 먼저 떠나도 연결을 놓아 준다.
    await reader.cancel().catch(() => {});
  }
}
