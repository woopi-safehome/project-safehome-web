import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loginWithKakao, withdraw } from "./api";
import { readTokens, writeTokens } from "@/shared/api/tokens";

function stubFetch(body: unknown, status = 200) {
  const fn = vi.fn(async (url: string, init: RequestInit) => {
    void url;
    void init;
    return { status, ok: status < 400, json: async () => body };
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function success(data: unknown) {
  return { type: "success", data, message: "Success", pagination: null };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loginWithKakao", () => {
  it("받은 토큰을 보관하고 신규 여부를 돌려준다", async () => {
    stubFetch(
      success({ accessToken: "a1", refreshToken: "r1", expiresIn: 3600, isNewUser: true }),
    );

    await expect(loginWithKakao("kakao-token")).resolves.toEqual({ isNewUser: true });
    expect(readTokens()).toEqual({ accessToken: "a1", refreshToken: "r1" });
  });

  it("카카오 토큰을 본문에 담아 보낸다", async () => {
    const fetchFn = stubFetch(
      success({ accessToken: "a1", refreshToken: "r1", expiresIn: 3600, isNewUser: false }),
    );

    await loginWithKakao("kakao-token");

    expect(fetchFn.mock.calls[0][1].body).toBe(JSON.stringify({ kakaoAccessToken: "kakao-token" }));
  });

  it("서버가 거절하면 토큰을 보관하지 않는다", async () => {
    stubFetch({ type: "error", code: "KAKAO_API_ERROR", message: "…", details: null }, 502);

    await expect(loginWithKakao("낡은토큰")).rejects.toThrow();
    expect(readTokens()).toBeNull();
  });
});

describe("withdraw", () => {
  it("서버가 지운 뒤에 토큰을 버린다", async () => {
    writeTokens({ accessToken: "a1", refreshToken: "r1" });
    const fetchFn = stubFetch(success(null));

    await withdraw();

    expect(fetchFn.mock.calls[0][1].method).toBe("DELETE");
    expect(readTokens()).toBeNull();
  });

  it("실패하면 토큰을 남긴다", async () => {
    // 먼저 버리면 다시 시도할 인증 수단이 사라진다.
    writeTokens({ accessToken: "a1", refreshToken: "r1" });
    stubFetch({ type: "error", code: "INTERNAL_SERVER_ERROR", message: "…", details: null }, 500);

    await expect(withdraw()).rejects.toThrow();
    expect(readTokens()).toEqual({ accessToken: "a1", refreshToken: "r1" });
  });
});
