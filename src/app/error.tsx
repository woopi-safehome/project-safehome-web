"use client";

/**
 * 화면이 예기치 않게 깨졌을 때의 마지막 그물.
 * 기능 안에서 다루는 서버 오류는 각 화면이 문구와 함께 보여준다 — 여기까지 오면 그 밖의 경우다.
 *
 * 이 파일은 클라이언트 컴포넌트여야 한다. 그리고 이 버전의 되돌리기 인자는 `retry` 다.
 */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <p role="alert" className="text-sm">
        화면을 표시하지 못했습니다.
      </p>
      <button
        type="button"
        onClick={retry}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        다시 시도
      </button>
    </main>
  );
}
