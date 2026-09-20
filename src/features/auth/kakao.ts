import { env } from "@/shared/config/env";

/**
 * 카카오에서 액세스 토큰을 받아 온다. **아직 구현되어 있지 않다.**
 *
 * 앱은 카카오톡 앱 연동과 웹뷰 OAuth 두 갈래를 쓰지만, 웹은 카카오 JavaScript SDK 하나뿐이다.
 * 채우려면 세 가지가 먼저 필요하다.
 *
 * 1. 카카오 개발자 콘솔에서 **JavaScript 키** 발급 (앱의 네이티브 키와 다른 값이다)
 * 2. 플랫폼 > Web 에 이 사이트 주소 등록 — 등록하지 않으면 SDK 가 거부한다
 * 3. `NEXT_PUBLIC_KAKAO_JS_KEY` 주입
 *
 * **SDK 의 어느 흐름을 쓸지는 키가 생긴 뒤에 문서를 보고 정한다.** 버전에 따라
 * 쓸 수 있는 방식이 다르므로 기억에 의존해 미리 적어 두면 틀린 코드가 남는다.
 *
 * 이 함수가 채워지면 로그인 화면과 서버 교환은 그대로 동작한다 — 둘 다 이미 있다.
 */
export async function getKakaoAccessToken(): Promise<string> {
  if (env.kakaoJsKey === "") {
    throw new Error("카카오 로그인 설정이 없습니다.");
  }
  throw new Error("카카오 로그인은 아직 연결되지 않았습니다.");
}
