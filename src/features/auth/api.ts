import { apiFetch } from "@/shared/api/client";
import { clearTokens, writeTokens } from "@/shared/api/tokens";

/** 이 기능이 서버에 무엇을 묻는지. 형식의 원본은 api 저장소 README 의 계약 절이다. */

type Issued = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  isNewUser: boolean;
};

/**
 * 카카오에서 받은 토큰을 서버에 넘기고 이 서비스의 토큰을 받는다.
 *
 * **카카오 토큰을 얻는 일은 여기서 하지 않는다.** 그쪽은 플랫폼마다 달라
 * 웹은 카카오 JavaScript SDK 가 맡는다. 이 함수는 그 결과만 받는다.
 *
 * `isNewUser` 로 처음 온 사람인지 알 수 있다 — 앱은 이 값으로 온보딩을 띄운다.
 */
export async function loginWithKakao(kakaoAccessToken: string): Promise<{ isNewUser: boolean }> {
  const issued = await apiFetch<Issued>("/api/auth/kakao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kakaoAccessToken }),
  });

  writeTokens({ accessToken: issued.accessToken, refreshToken: issued.refreshToken });
  return { isNewUser: issued.isNewUser };
}

/**
 * 회원 탈퇴. 서버가 카카오 연결 해제까지 함께 처리한다.
 * **서버가 지운 뒤에만 토큰을 버린다** — 먼저 버리면 요청을 보낼 인증 수단이 사라진다.
 */
export async function withdraw(): Promise<void> {
  await apiFetch<null>("/api/users/me", { method: "DELETE" });
  clearTokens();
}
