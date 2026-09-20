"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisStep } from "@/shared/api/contract";
import { ANALYSIS_STEP } from "@/shared/api/contract";
import { useAnalyzing } from "../useAnalyzing";

/**
 * 진행 상황만 보여준다. 단계 표시의 규칙과 종료 처리는 훅이 갖는다.
 * 여기서 위험도를 계산하거나 결과를 해석하지 않는다 — 서버가 정한다.
 */

const STEP_LABEL: Record<AnalysisStep, string> = {
  PDF_PARSING: "등기부등본의 내용을 읽어오고 있어요",
  LLM_ANALYSIS: "소유권, 근저당, 가압류를 꼼꼼히 살펴보고 있어요",
  POST_PROCESSING: "분석을 마무리하고 안전 등급을 판단하고 있어요",
};

export function AnalyzingView({ jobId }: { jobId: string }) {
  const { displayStep, completed, error, retry } = useAnalyzing(jobId);
  const router = useRouter();

  useEffect(() => {
    // replace 로 보낸다. 뒤로 가기가 이미 끝난 분석 화면으로 돌아오면 안 된다.
    if (completed) router.replace(`/result/${jobId}`);
  }, [completed, jobId, router]);

  if (error !== null) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
        <p role="alert" className="text-sm">
          {error}
        </p>
        <button
          type="button"
          onClick={retry}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-3 text-center">
        {/* 곧 결과 화면으로 넘어간다. 그 사이 빈 화면이 보이지 않게 한다. */}
        <p role="status" className="text-sm font-medium">
          분석이 끝났어요
        </p>
      </div>
    );
  }

  const current = ANALYSIS_STEP.indexOf(displayStep);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
      <p role="status" aria-live="polite" className="text-sm">
        {STEP_LABEL[displayStep]}
      </p>

      <ol className="flex items-center gap-2" aria-label="분석 단계">
        {ANALYSIS_STEP.map((step, i) => (
          <li
            key={step}
            aria-current={step === displayStep ? "step" : undefined}
            className={`h-1.5 w-12 rounded-full transition-colors ${
              i <= current ? "bg-foreground" : "bg-black/15 dark:bg-white/20"
            }`}
          />
        ))}
      </ol>

      <p className="text-xs text-black/50 dark:text-white/50">
        창을 닫지 말고 잠시만 기다려 주세요.
      </p>
    </div>
  );
}
