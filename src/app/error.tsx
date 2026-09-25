"use client";

import { AlertIcon, RefreshIcon } from "@/shared/ui/icons";
import { buttonPrimary } from "@/shared/ui/styles";

/**
 * 화면이 예기치 않게 깨졌을 때의 마지막 그물.
 * 기능 안에서 다루는 서버 오류는 각 화면이 문구와 함께 보여준다 — 여기까지 오면 그 밖의 경우다.
 *
 * 이 파일은 클라이언트 컴포넌트여야 한다. 그리고 이 버전의 되돌리기 인자는 `retry` 다.
 */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertIcon width={28} height={28} />
      </span>
      <p role="alert" className="text-base font-semibold">
        화면을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
      <button type="button" onClick={retry} className={buttonPrimary}>
        <RefreshIcon width={18} height={18} />
        다시 시도
      </button>
    </main>
  );
}
