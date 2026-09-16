import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";

function stubFetch(body: unknown, { status = 200, parsable = true } = {}) {
  const fn = vi.fn(async () => ({
    status,
    json: async () => {
      if (!parsable) throw new SyntaxError("Unexpected token");
      return body;
    },
  }));
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

/** 던져진 ApiError 를 돌려준다. 성공해 버리거나 다른 오류면 그 자체로 실패다. */
async function rejectedApiError(p: Promise<unknown>): Promise<ApiError> {
  try {
    await p;
  } catch (e) {
    if (e instanceof ApiError) return e;
    throw e;
  }
  throw new Error("오류가 나야 하는데 성공했다.");
}

describe("apiFetch", () => {
  it("성공 봉투에서 data 만 꺼낸다", async () => {
    stubFetch({ type: "success", data: { jobId: "job-1" }, message: "Success", pagination: null });

    await expect(apiFetch<{ jobId: string }>("/api/deed/upload")).resolves.toEqual({
      jobId: "job-1",
    });
  });

  it("실패 봉투는 code 를 지닌 ApiError 로 바꾼다", async () => {
    stubFetch({ type: "error", code: "NOT_FOUND", message: "없는 작업입니다.", details: null }, { status: 404 });

    const err = await rejectedApiError(apiFetch("/api/deed/jobs/none"));

    expect(err.code).toBe("NOT_FOUND");
    expect(err.status).toBe(404);
    expect(err.message).toBe("없는 작업입니다.");
  });

  it("봉투가 아닌 응답은 본문을 믿지 않고 오류로 다룬다", async () => {
    // 프록시가 가로챈 HTML 이나 서버 장애 페이지가 이 경우다.
    stubFetch(null, { status: 502, parsable: false });

    const err = await rejectedApiError(apiFetch("/api/deed/jobs/x"));

    expect(err.code).toBe("INVALID_RESPONSE");
    expect(err.status).toBe(502);
  });

  it("익명 식별자 쿠키가 실리도록 credentials 를 항상 보낸다", async () => {
    // 비로그인 사용자의 작업을 서버가 알아보려면 이 옵션이 있어야 한다.
    const fetchFn = stubFetch({ type: "success", data: null, message: "Success", pagination: null });

    await apiFetch("/api/deed/jobs");

    expect(fetchFn).toHaveBeenCalledWith(
      expect.stringContaining("/api/deed/jobs"),
      expect.objectContaining({ credentials: "include" }),
    );
  });
});
