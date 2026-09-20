import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "./client";
import { streamJobEvents, type JobEvent } from "./stream";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

/** 서버가 보낸 바이트를 청크 단위로 흘려 주는 가짜 응답. */
function sseResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  let i = 0;
  return {
    ok: true,
    status: 200,
    body: {
      getReader: () => ({
        read: async () =>
          i < chunks.length
            ? { done: false, value: encoder.encode(chunks[i++]) }
            : { done: true, value: undefined },
        cancel: async () => {},
      }),
    },
  };
}

async function collect(jobId: string): Promise<JobEvent[]> {
  const events: JobEvent[] = [];
  for await (const e of streamJobEvents(jobId)) events.push(e);
  return events;
}

function event(status: string, step: string | null) {
  return JSON.stringify({ jobId: "j1", status, step, message: "진행 중", timestamp: "2026-09-08T14:23:45.123" });
}

describe("streamJobEvents", () => {
  it("청크 경계에서 잘린 줄을 이어 붙인다", async () => {
    // 서버가 보낸 한 줄이 두 청크로 쪼개져 도착하는 것이 정상이다.
    const line = `data: ${event("IN_PROGRESS", "PDF_PARSING")}\n\n`;
    const cut = Math.floor(line.length / 2);
    vi.stubGlobal("fetch", vi.fn(async () => sseResponse([line.slice(0, cut), line.slice(cut)])));

    const events = await collect("j1");

    expect(events).toHaveLength(1);
    expect(events[0].step).toBe("PDF_PARSING");
  });

  it("data 가 아닌 줄은 무시한다", async () => {
    // 주석(:)과 이벤트 이름 줄은 페이로드가 아니다.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        sseResponse([`: heartbeat\nevent: progress\ndata: ${event("COMPLETED", null)}\n\n`]),
      ),
    );

    const events = await collect("j1");

    expect(events).toHaveLength(1);
    expect(events[0].status).toBe("COMPLETED");
  });

  it("스트림이 닫히면 반복이 끝난다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        sseResponse([
          `data: ${event("IN_PROGRESS", "LLM_ANALYSIS")}\n\n`,
          `data: ${event("COMPLETED", null)}\n\n`,
        ]),
      ),
    );

    await expect(collect("j1")).resolves.toHaveLength(2);
  });

  it("열지 못하면 봉투의 code 를 쓴다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 404,
        body: null,
        json: async () => ({ type: "error", code: "NOT_FOUND", message: "없는 작업입니다.", details: null }),
      })),
    );

    await expect(collect("없음")).rejects.toMatchObject({ code: "NOT_FOUND", status: 404 });
  });

  it("페이로드가 JSON 이 아니면 오류로 알린다", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => sseResponse(["data: 이건 JSON 이 아니다\n\n"])));

    await expect(collect("j1")).rejects.toBeInstanceOf(ApiError);
  });
});
