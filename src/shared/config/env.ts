/**
 * 브라우저까지 내려가는 값은 전부 공개된 것으로 다룬다.
 * 서버 비밀값을 여기에 두지 않는다 — 번들에 그대로 들어간다.
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  /**
   * 카카오 JavaScript 키. **없으면 로그인 화면이 버튼을 잠근다.**
   * 앱의 네이티브 키와 다른 값이며, 카카오 콘솔에 이 웹 주소를 플랫폼으로 등록해야 한다.
   */
  kakaoJsKey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "",
} as const;
