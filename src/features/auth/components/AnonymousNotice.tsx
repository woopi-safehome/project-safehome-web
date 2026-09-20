"use client";

import Link from "next/link";
import { useSession } from "../useSession";

/**
 * 비회원에게 이 결과가 남지 않는다는 것을 알린다.
 *
 * **비회원 분석은 의도적으로 일회성이다.** 이 주소를 잃으면 다시 찾을 방법이 없고,
 * 이 브라우저에 몰래 남겨 두지도 않는다 — 이력을 원하면 로그인하는 것이 정책이다.
 * 그 사실을 말해 주지 않으면 사용자는 닫은 뒤에야 알게 된다.
 *
 * 로그인했으면 아무것도 내놓지 않는다. 이미 이력에 남기 때문이다.
 */
export function AnonymousNotice() {
  const { isAuthenticated } = useSession();

  if (isAuthenticated) return null;

  return (
    <aside className="w-full max-w-2xl rounded-xl border border-black/10 px-5 py-4 text-center text-xs leading-relaxed text-black/60 dark:border-white/15 dark:text-white/60">
      <p>
        비회원 분석은 <strong className="font-medium">이 주소를 벗어나면 다시 찾을 수 없습니다.</strong>
      </p>
      <p className="mt-1">
        이력을 남기려면{" "}
        <Link href="/login" className="underline underline-offset-4">
          로그인
        </Link>{" "}
        후 분석하세요.
      </p>
    </aside>
  );
}
