import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";
import { readTokens, writeTokens } from "./tokens";

type Reply = { body: unknown; status?: number; parsable?: boolean };

/** 경로별로 답을 정한다. 같은 경로를 여러 번 부르면 앞에서부터 하나씩 꺼내 쓴다. */
function stubFetch(routes: Record<string, Reply[]>) {
  // init 을 필수로 선언한다. send 가 늘 넘기므로 사실이고, 호출 인자를 꺼내 볼 때 타입이 선다.
  const fn = vi.fn(async (url: string, init: RequestInit) => {
    void init;
    const path = Object.keys(routes).find((p) => url.includes(p));
    const reply = path === undefined ? undefined : routes[path].shift();
    if (reply === undefined) throw new Error(`예상하지 못한 호출: ${url}`);

    return {
      status: reply.status ?? 200,
      ok: (reply.status ?? 200) < 400,
      json: async () => {
        if (reply.parsable === false) throw new SyntaxError("Unexpected token");
        return reply.body;
      },
    };
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function success(data: unknown): Reply {
  return { body: { type: "success", data, message: "Success", pagination: null } };
}

function failure(code: string, message: string, status: number): Reply {
  return { body: { type: "error", code, message, details: null }, status };
}

beforeEach(() => {
  localStorage.clear();
});

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
    stubFetch({ "/api/deed/upload": [success({ jobId: "job-1" })] });

    await expect(apiFetch<{ jobId: string }>("/api/deed/upload")).resolves.toEqual({
      jobId: "job-1",
    });
  });

  it("실패 봉투는 code 를 지닌 ApiError 로 바꾼다", async () => {
    stubFetch({ "/api/deed/jobs": [failure("NOT_FOUND", "없는 작업입니다.", 404)] });

    const err = await rejectedApiError(apiFetch("/api/deed/jobs/none"));

    expect(err.code).toBe("NOT_FOUND");
    expect(err.status).toBe(404);
    expect(err.message).toBe("없는 작업입니다.");
  });

  it("봉투가 아닌 응답은 본문을 믿지 않고 오류로 다룬다", async () => {
    // 프록시가 가로챈 HTML 이나 서버 장애 페이지가 이 경우다.
    stubFetch({ "/api/deed/jobs": [{ body: null, status: 502, parsable: false }] });

    const err = await rejectedApiError(apiFetch("/api/deed/jobs/x"));

    expect(err.code).toBe("INVALID_RESPONSE");
    expect(err.status).toBe(502);
  });

  it("서버에 닿지 못하면 NETWORK_ERROR 로 알린다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    const err = await rejectedApiError(apiFetch("/api/deed/jobs"));

    expect(err.code).toBe("NETWORK_ERROR");
  });
});

describe("인증", () => {
  it("토큰이 있으면 Authorization 헤더로 실어 보낸다", async () => {
    writeTokens({ accessToken: "a1", refreshToken: "r1" });
    const fetchFn = stubFetch({ "/api/deed/jobs": [success(null)] });

    await apiFetch("/api/deed/jobs");

    const headers = fetchFn.mock.calls[0][1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer a1");
  });

  it("같은 출처로 보내 쿠키가 실리게 한다", async () => {
    // 비회원 분석의 주인은 서버가 발급한 익명 쿠키다. 스크립트가 읽지 못하므로(HttpOnly)
    // 붙여 보낼 수 없고, 브라우저가 알아서 싣도록 같은 출처로 보내야 한다.
    const fetchFn = stubFetch({ "/api/deed/jobs": [success(null)] });

    await apiFetch("/api/deed/jobs");

    expect(fetchFn.mock.calls[0][1].credentials).toBe("same-origin");
  });

  it("백엔드 주소를 붙이지 않고 이 앱의 경로로 부른다", async () => {
    // 절대 주소로 부르면 교차 출처가 되어 쿠키가 빠진다. /api/* 는 이 앱이 백엔드로 넘긴다.
    const fetchFn = stubFetch({ "/api/deed/jobs": [success(null)] });

    await apiFetch("/api/deed/jobs");

    expect(fetchFn.mock.calls[0][0]).toBe("/api/deed/jobs");
  });

  it("401 이면 토큰을 갱신하고 한 번만 다시 보낸다", async () => {
    writeTokens({ accessToken: "stale", refreshToken: "r1" });
    const fetchFn = stubFetch({
      "/api/deed/jobs": [failure("UNAUTHORIZED", "인증이 필요합니다.", 401), success({ ok: true })],
      "/api/auth/refresh": [success({ accessToken: "fresh", refreshToken: "r2", expiresIn: 3600 })],
    });

    await expect(apiFetch("/api/deed/jobs")).resolves.toEqual({ ok: true });

    expect(fetchFn).toHaveBeenCalledTimes(3);
    const retryHeaders = fetchFn.mock.calls[2][1].headers as Headers;
    expect(retryHeaders.get("Authorization")).toBe("Bearer fresh");
    expect(readTokens()).toEqual({ accessToken: "fresh", refreshToken: "r2" });
  });

  it("서버가 갱신을 거절하면 토큰을 지운다", async () => {
    writeTokens({ accessToken: "stale", refreshToken: "expired" });
    stubFetch({
      "/api/deed/jobs": [failure("UNAUTHORIZED", "인증이 필요합니다.", 401)],
      "/api/auth/refresh": [failure("UNAUTHORIZED", "만료된 토큰입니다.", 401)],
    });

    await rejectedApiError(apiFetch("/api/deed/jobs"));

    expect(readTokens()).toBeNull();
  });

  it("갱신 중 네트워크가 끊기면 토큰을 지우지 않는다", async () => {
    // 잠깐 끊긴 것으로 로그인 상태를 날리면 사용자는 이유 없이 로그아웃된다.
    writeTokens({ accessToken: "stale", refreshToken: "r1" });
    let call = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        call += 1;
        if (call === 1) return { status: 401, ok: false, json: async () => ({}) };
        throw new TypeError("Failed to fetch");
      }),
    );

    const err = await rejectedApiError(apiFetch("/api/deed/jobs"));

    expect(err.code).toBe("NETWORK_ERROR");
    expect(readTokens()).toEqual({ accessToken: "stale", refreshToken: "r1" });
  });

  it("토큰이 없으면 갱신을 시도하지 않는다", async () => {
    const fetchFn = stubFetch({
      "/api/deed/jobs": [failure("UNAUTHORIZED", "인증이 필요합니다.", 401)],
    });

    const err = await rejectedApiError(apiFetch("/api/deed/jobs"));

    expect(err.code).toBe("UNAUTHORIZED");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});
