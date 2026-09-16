/**
 * 브라우저까지 내려가는 값은 전부 공개된 것으로 다룬다.
 * 서버 비밀값을 여기에 두지 않는다 — 번들에 그대로 들어간다.
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
} as const;
