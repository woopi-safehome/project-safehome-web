"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 처음 온 사람에게 서비스를 소개한다. 앱의 온보딩과 같은 순서·문구를 쓴다.
 * **건너뛸 수 있어야 한다** — 이미 아는 사람을 붙잡아 두지 않는다.
 */

const PAGES = [
  {
    title: "등기부등본을\n업로드하세요",
    description: "PDF 파일을 선택하기만 하면\nAI가 즉시 분석을 시작합니다",
  },
  {
    title: "AI가 꼼꼼하게\n분석합니다",
    description: "표제부, 갑구, 을구의 권리관계를\n자동으로 파악해 드립니다",
  },
  {
    title: "안전 등급으로\n한눈에 확인",
    description: "위험 요소를 SAFE / CAUTION / DANGER\n등급으로 명확하게 알려드립니다",
  },
] as const;

export function Onboarding() {
  const [page, setPage] = useState(0);
  const router = useRouter();

  const isLast = page === PAGES.length - 1;
  const finish = () => router.replace("/");

  return (
    <div className="flex w-full max-w-md flex-1 flex-col items-center gap-10">
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={finish}
          className="text-xs text-black/50 underline underline-offset-4 dark:text-white/50"
        >
          건너뛰기
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        {/* 줄바꿈이 문구의 일부다. 앱과 같은 자리에서 끊는다. */}
        <h2 className="whitespace-pre-line text-2xl font-bold leading-snug">{PAGES[page].title}</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-black/60 dark:text-white/60">
          {PAGES[page].description}
        </p>
      </div>

      <ol className="flex items-center gap-2" aria-label="소개 단계">
        {PAGES.map((p, i) => (
          <li
            key={p.title}
            aria-current={i === page ? "step" : undefined}
            className={`h-1.5 rounded-full transition-all ${
              i === page ? "w-6 bg-foreground" : "w-1.5 bg-black/20 dark:bg-white/25"
            }`}
          />
        ))}
      </ol>

      <button
        type="button"
        onClick={() => (isLast ? finish() : setPage(page + 1))}
        className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        {isLast ? "시작하기" : "다음"}
      </button>
    </div>
  );
}
