/**
 * 토큰 보관소.
 *
 * 서버 인증은 `Authorization: Bearer` 헤더 하나뿐이다 — 브라우저가 알아서 실어 보내 주는 것이
 * 아무것도 없으므로 이쪽이 직접 들고 있다가 매 요청에 붙여야 한다.
 *
 * `localStorage` 에 둔다. 새로고침을 넘겨야 하는데 서버가 httpOnly 쿠키를 발급하지 않아
 * 다른 선택지가 없다. **XSS 가 나면 그대로 읽힌다** — 보관 방식을 바꿀 때
 * 고칠 곳이 이 파일 하나가 되도록 여기에 가둬 둔다.
 */

const ACCESS_KEY = "safehome.accessToken";
const REFRESH_KEY = "safehome.refreshToken";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

/** 서버 렌더링 중에는 저장소가 없다. 없으면 비로그인으로 다룬다. */
function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // 브라우저가 저장소를 막아 둔 경우(프라이빗 모드 등). 접근 자체가 던진다.
    return null;
  }
}

/**
 * 토큰이 바뀐 것을 화면이 알아야 한다. localStorage 는 스스로 알려 주지 않으므로 여기서 알린다.
 * 다른 탭에서의 변경은 브라우저의 storage 이벤트로 들어온다 — 한 탭에서 로그아웃하면 다른 탭도 따라간다.
 */
const listeners = new Set<() => void>();

export function subscribeTokens(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", listener);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * 구독자에게 넘길 값. **객체가 아니라 문자열이어야 한다** —
 * 매번 새 객체를 돌려주면 React 가 바뀐 것으로 보고 무한히 다시 그린다.
 */
export function accessTokenSnapshot(): string | null {
  return readTokens()?.accessToken ?? null;
}

export function readTokens(): Tokens | null {
  const s = storage();
  if (s === null) return null;

  const accessToken = s.getItem(ACCESS_KEY);
  const refreshToken = s.getItem(REFRESH_KEY);
  // 한쪽만 남은 상태는 갱신도 호출도 못 한다. 없는 것으로 다룬다.
  if (accessToken === null || refreshToken === null) return null;

  return { accessToken, refreshToken };
}

export function writeTokens(tokens: Tokens): void {
  const s = storage();
  if (s === null) return;
  s.setItem(ACCESS_KEY, tokens.accessToken);
  s.setItem(REFRESH_KEY, tokens.refreshToken);
  notify();
}

export function clearTokens(): void {
  const s = storage();
  if (s === null) return;
  s.removeItem(ACCESS_KEY);
  s.removeItem(REFRESH_KEY);
  notify();
}
