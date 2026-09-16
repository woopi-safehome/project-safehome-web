import { env } from "@/shared/config/env";
import type { ApiEnvelope } from "./contract";

/**
 * 서버로 나가는 유일한 통로. 화면에서 직접 fetch 하지 않는다.
 * 여기 모아 두지 않으면 인증 헤더와 봉투 처리가 흩어지고, 계약이 바뀔 때 빠뜨리는 곳이 생긴다.
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

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    // 익명 식별자는 쿠키로 오간다. 로그인 여부와 무관하게 항상 실어 보낸다.
    credentials: "include",
  });

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
