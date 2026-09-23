import Link from "next/link";
import { LogoMark } from "./icons";

/**
 * 모든 화면 위의 머리글. 어디서든 분석을 시작하고, 사용법을 찾을 수 있어야 한다.
 * 로그인 상태를 보지 않는다 — 공용 영역이라 기능(auth)을 알 수 없고,
 * 이력 화면이 로그인이 필요하면 그쪽에서 안내한다.
 */
const NAV = [
  { href: "/guide", label: "이용 방법" },
  { href: "/history", label: "분석 이력" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
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
            className="ml-1 hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-strong sm:inline-flex"
          >
            분석하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
