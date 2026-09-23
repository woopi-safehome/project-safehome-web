import Link from "next/link";
import { LogoMark } from "./icons";

/**
 * 모든 화면 아래의 바닥글. **면책 문구가 여기 있다** — 분석 결과는 법률 판단이 아니며,
 * 어느 화면으로 들어오든 이 사실이 보여야 한다.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <LogoMark width={22} height={22} />
              <span className="font-bold">
                Safe<span className="text-brand">Home</span>
              </span>
            </div>
            <p className="text-sm text-muted">계약 전에, 등기부등본으로 먼저 확인하세요.</p>
          </div>
          <nav aria-label="바닥 메뉴" className="flex gap-5 text-sm text-muted">
            <Link href="/#analyze" className="hover:text-ink">분석하기</Link>
            <Link href="/guide" className="hover:text-ink">이용 방법</Link>
            <Link href="/history" className="hover:text-ink">분석 이력</Link>
          </nav>
        </div>
        <p className="rounded-xl bg-surface-muted px-4 py-3 text-xs leading-relaxed text-muted">
          SafeHome 의 분석은 등기부등본에 적힌 내용을 바탕으로 한 <strong className="font-semibold text-ink">참고 정보</strong>이며,
          법률 자문이나 권리 보증이 아닙니다. 등기부에 나타나지 않는 위험(선순위 임차인, 미납 세금, 시세 변동 등)은
          확인되지 않으므로, 계약 전 공인중개사·법률 전문가와 함께 최종 확인하세요.
        </p>
      </div>
    </footer>
  );
}
