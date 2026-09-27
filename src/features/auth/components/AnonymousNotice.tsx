"use client";

import Link from "next/link";
import { loginAvailable } from "@/shared/config/env";
import { InfoIcon } from "@/shared/ui/icons";
import { useSession } from "../useSession";

/**
 * 비회원에게 이 결과를 다시 찾는 방법을 알린다.
 *
 * **비회원 분석은 목록으로 모아 두지 않는다.** 결과는 이 브라우저(익명 쿠키)에서 이 주소로만 열린다 —
 * 주소를 잃으면 다시 찾을 방법이 없다. 이력을 원하면 로그인하는 것이 정책이다.
 * 그 사실을 말해 주지 않으면 사용자는 닫은 뒤에야 알게 된다 — 그래서 결과보다 위에 둔다.
 *
 * **로그인이 되지 않는 동안에는 로그인을 권하지 않는다**(`loginAvailable`).
 * 누르면 막다른 곳에 닿는 링크가 되고, 시연 영상에서도 그대로 보인다.
 *
 * 로그인했으면 아무것도 내놓지 않는다. 이미 이력에 남기 때문이다.
 */
export function AnonymousNotice() {
  const { isAuthenticated } = useSession();
  if (isAuthenticated) return null;

  return (
    <aside className="flex w-full max-w-3xl items-start gap-3 rounded-3xl bg-brand-soft px-5 py-4 text-sm leading-relaxed">
      <InfoIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand" />
      <div>
        <p>
          이 결과는 <strong className="font-semibold">분석한 이 브라우저에서만</strong> 열리고, 따로 목록으로 모아 두지 않아요.
        </p>
        {loginAvailable ? (
          <p className="text-muted">
            기록을 남기고 싶으시면{" "}
            <Link href="/login" className="font-semibold text-brand underline underline-offset-4">
              로그인
            </Link>{" "}
            후에 분석해 주세요.
          </p>
        ) : (
          <p className="text-muted">나중에 다시 보시려면 이 페이지를 즐겨찾기해 두세요.</p>
        )}
      </div>
    </aside>
  );
}
