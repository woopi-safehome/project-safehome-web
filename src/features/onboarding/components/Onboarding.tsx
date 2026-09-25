"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnalyzeIllustration, ResultIllustration, UploadIllustration } from "@/shared/ui/illustrations";
import { buttonPrimary, card } from "@/shared/ui/styles";

/**
 * 처음 온 사람에게 서비스를 소개한다. 순서는 앱의 온보딩과 같다.
 * 문구는 2026-09 웹 문구를 부드럽게 다듬으며 앱과 달라졌다 — 앱은 이번 공모전 범위 밖이라 맞추지 않았다.
 * **건너뛸 수 있어야 한다** — 이미 아는 사람을 붙잡아 두지 않는다.
 */
const PAGES = [
  {
    title: "등기부등본만\n올려 주세요",
    description: "PDF 파일 하나면 충분해요\n나머지는 AI가 읽어 볼게요",
    Illustration: UploadIllustration,
  },
  {
    title: "어려운 권리관계를\n대신 읽어요",
    description: "갑구와 을구에 적힌 권리를\n하나씩 살펴볼게요",
    Illustration: AnalyzeIllustration,
  },
  {
    title: "결과는\n한눈에 보여요",
    description: "안전·주의·위험 세 가지 등급과\n계약 전에 할 일을 알려 드려요",
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
