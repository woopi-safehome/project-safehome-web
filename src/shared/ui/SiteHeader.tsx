import Link from "next/link";
import { loginAvailable } from "@/shared/config/env";
import { LogoMark } from "./icons";

/**
 * 모든 화면 위의 머리글. 어디서든 분석을 시작하고, 사용법을 찾을 수 있어야 한다.
 * 로그인 상태를 보지 않는다 — 공용 영역이라 기능(auth)을 알 수 없고,
 * 이력 화면이 로그인이 필요하면 그쪽에서 안내한다.
 *
 * **로그인을 쓸 수 없으면 "분석 이력"을 내놓지 않는다.** 이력은 로그인해야만 생기므로,
 * 로그인이 안 되는 동안은 누르면 막다른 곳에 닿는 메뉴가 된다. 기준은 `loginAvailable` 이 갖는다.
 */
export const HISTORY_ENABLED = loginAvailable;

const NAV = [
  { href: "/guide", label: "이용 방법" },
  ...(HISTORY_ENABLED ? [{ href: "/history", label: "분석 이력" }] : []),
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="SafeHome 첫 화면">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight">
            Safe<span className="text-brand">Home</span>
          </span>
        </Link>

        <nav aria-label="주 메뉴" className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#analyze"
            className="ml-1 hidden rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-strong sm:inline-flex"
          >
            분석하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
