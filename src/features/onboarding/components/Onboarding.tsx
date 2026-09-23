"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnalyzeIllustration, ResultIllustration, UploadIllustration } from "@/shared/ui/illustrations";
import { buttonPrimary, card } from "@/shared/ui/styles";

/**
 * 처음 온 사람에게 서비스를 소개한다. 앱의 온보딩과 같은 순서·문구를 쓴다.
 * **건너뛸 수 있어야 한다** — 이미 아는 사람을 붙잡아 두지 않는다.
 */
const PAGES = [
  {
    title: "등기부등본을\n업로드하세요",
    description: "PDF 파일을 선택하기만 하면\nAI가 즉시 분석을 시작합니다",
    Illustration: UploadIllustration,
  },
  {
    title: "AI가 꼼꼼하게\n분석합니다",
    description: "표제부, 갑구, 을구의 권리관계를\n자동으로 파악해 드립니다",
    Illustration: AnalyzeIllustration,
  },
  {
    title: "안전 등급으로\n한눈에 확인",
    description: "위험 요소를 SAFE / CAUTION / DANGER\n등급으로 명확하게 알려드립니다",
    Illustration: ResultIllustration,
  },
] as const;

export function Onboarding() {
  const [page, setPage] = useState(0);
  const router = useRouter();

  const isLast = page === PAGES.length - 1;
  const finish = () => router.replace("/");
  const { Illustration } = PAGES[page];

  return (
    <div className={`${card} flex w-full max-w-md flex-1 flex-col items-center gap-8 p-6 sm:p-8`}>
      <div className="flex w-full justify-end">
        <button type="button" onClick={finish} className="text-sm text-muted underline-offset-4 hover:underline">
          건너뛰기
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <Illustration className="h-48 w-auto" />
        {/* 줄바꿈이 문구의 일부다. 앱과 같은 자리에서 끊는다. */}
        <h2 className="whitespace-pre-line text-2xl font-bold leading-snug tracking-tight">{PAGES[page].title}</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{PAGES[page].description}</p>
      </div>

      <ol className="flex items-center gap-2" aria-label="소개 단계">
        {PAGES.map((p, i) => (
          <li
            key={p.title}
            aria-current={i === page ? "step" : undefined}
            className={`h-2 rounded-full transition-all ${i === page ? "w-7 bg-brand" : "w-2 bg-line"}`}
          />
        ))}
      </ol>

      <button
        type="button"
        onClick={() => (isLast ? finish() : setPage(page + 1))}
        className={`${buttonPrimary} w-full py-3.5`}
      >
        {isLast ? "시작하기" : "다음"}
      </button>
    </div>
  );
}
