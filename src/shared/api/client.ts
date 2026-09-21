import { env } from "@/shared/config/env";
import { clearTokens, readTokens, writeTokens } from "./tokens";
import type { ApiEnvelope } from "./contract";

/**
 * 서버로 나가는 유일한 통로. 화면에서 직접 fetch 하지 않는다.
 * 여기 모아 두지 않으면 인증 헤더와 봉투 처리가 흩어지고, 계약이 바뀔 때 빠뜨리는 곳이 생긴다.
 *
 * **회원 인증은 Bearer 헤더, 비회원의 주인은 쿠키다.** 서버가 비회원에게 익명 쿠키를 발급하고,
 * 그 쿠키를 함께 보낸 요청만 자기 분석을 볼 수 있다. 쿠키는 스크립트가 읽지 못하므로(`HttpOnly`)
 * 이쪽에서 꺼내 붙일 수 없고, **브라우저가 알아서 싣도록 같은 출처로 보내야 한다.**
 *
 * 그래서 요청은 이 앱의 주소로 보내고, `/api/*` 는 이 앱이 백엔드로 넘긴다(`next.config.ts`).
 * 백엔드를 직접 부르면 교차 출처가 되어 쿠키가 빠지고, 비회원은 자기 결과를 볼 수 없게 된다.
 */

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** 서버에 닿지도 못한 경우. status 가 없으므로 0 으로 구분한다. */
function networkError(): ApiError {
  return new ApiError("NETWORK_ERROR", "서버에 연결할 수 없습니다.", 0);
}

function url(path: string): string {
  return `${env.apiUrl}${path}`;
}

/**
 * 토큰이 있으면 실어 보낸다. 없으면 그냥 보낸다 — 보호된 엔드포인트면 서버가 401 로 답한다.
 * Content-Type 은 건드리지 않는다. FormData 일 때 직접 지정하면 multipart 경계가 빠져 파싱이 깨진다.
 */
async function send(path: string, init: RequestInit | undefined, accessToken: string | null) {
  const headers = new Headers(init?.headers);
  if (accessToken !== null) headers.set("Authorization", `Bearer ${accessToken}`);

  try {
    // 같은 출처면 이것이 기본값이지만 적어 둔다 — 빠뜨린 것과 정한 것을 구분하기 위해서다.
    return await fetch(url(path), { ...init, headers, credentials: "same-origin" });
  } catch {
    throw networkError();
  }
}

/** 갱신 요청이 겹치면 refreshToken 이 서로를 무효화한다. 한 번만 날아가도록 묶는다. */
let refreshing: Promise<string | null> | null = null;

/**
 * 액세스 토큰 재발급. 성공하면 새 토큰을 돌려준다.
 *
 * **서버가 갱신을 거절하면 토큰을 지우지만, 네트워크 오류에서는 지우지 않는다.**
 * 잠깐 끊긴 것으로 로그인 상태를 날리면 사용자는 이유 없이 로그아웃된다.
 */
async function refreshAccessToken(): Promise<string | null> {
  const tokens = readTokens();
  if (tokens === null) return null;

  const res = await send(
    "/api/auth/refresh",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    },
    null,
  );

  let body: ApiEnvelope<{ accessToken: string; refreshToken: string }>;
  try {
    body = await res.json();
  } catch {
    // 갱신 응답을 읽지 못한 것은 서버 장애다. 거절로 단정하지 않는다.
    throw new ApiError("INVALID_RESPONSE", "서버 응답을 해석하지 못했습니다.", res.status);
  }

  if (body.type === "error") {
    // 서버가 명시적으로 거절했다. 이 refreshToken 으로는 다시 시도해도 같다.
    clearTokens();
    return null;
  }
  if (body.type !== "success") {
    // 봉투가 아니다. 거절인지 장애인지 알 수 없으므로 토큰을 건드리지 않는다.
    throw new ApiError("INVALID_RESPONSE", "서버 응답을 해석하지 못했습니다.", res.status);
  }

  writeTokens({ accessToken: body.data.accessToken, refreshToken: body.data.refreshToken });
  return body.data.accessToken;
}

function refreshOnce(): Promise<string | null> {
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/**
 * 인증을 붙여 보내고, 401 이면 한 번만 갱신 후 재시도한다.
 * 봉투를 풀지 않으므로 스트리밍도 이 통로를 쓴다.
 *
 * 재시도는 한 번뿐이다 — 갱신한 토큰으로도 401 이면 서버가 거절한 것이고, 더 돌면 무한 루프가 된다.
 */
export async function authorizedFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await send(path, init, readTokens()?.accessToken ?? null);
  if (res.status !== 401 || readTokens() === null) return res;

  const accessToken = await refreshOnce();
  if (accessToken === null) return res;

  return send(path, init, accessToken);
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await authorizedFetch(path, init);

  let body: ApiEnvelope<T>;
  try {
    body = await res.json();
  } catch {
    // 봉투가 아닌 응답은 서버 장애이거나 프록시가 가로챈 것이다. 본문을 믿지 않는다.
    throw new ApiError("INVALID_RESPONSE", "서버 응답을 해석하지 못했습니다.", res.status);
  }

  if (body.type === "error") {
    throw new ApiError(body.code, body.message, res.status);
  }
  return body.data;
}
