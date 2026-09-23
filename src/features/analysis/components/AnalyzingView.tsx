"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisStep } from "@/shared/api/contract";
import { ANALYSIS_STEP } from "@/shared/api/contract";
import { AlertIcon, CheckCircleIcon, RefreshIcon } from "@/shared/ui/icons";
import { buttonPrimary, card } from "@/shared/ui/styles";
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

/** 단계 목록의 짧은 이름. 위의 긴 문구는 지금 단계 하나만 보여 준다. */
const STEP_TITLE: Record<AnalysisStep, { title: string; detail: string }> = {
  PDF_PARSING: { title: "문서 읽기", detail: "표제부 · 갑구 · 을구 구분" },
  LLM_ANALYSIS: { title: "권리관계 분석", detail: "11개 항목 점검" },
  POST_PROCESSING: { title: "결과 정리", detail: "안전 등급 산출" },
};

/** 문서를 훑는 그림. 진행이 멈춘 것이 아니라는 것을 움직임으로 알린다. */
function ScanningDocument() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-40 w-32">
      <div className="absolute inset-0 rounded-xl border border-line bg-surface shadow-lg shadow-brand/10" />
      <div className="absolute left-4 right-4 top-5 flex flex-col gap-2.5">
        <div className="h-2 w-14 rounded-full bg-brand" />
        {[88, 70, 80, 60, 84, 66, 76].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-line" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="animate-scan absolute left-2 right-2 top-8 h-10 rounded-md border-y-2 border-brand/60 bg-brand/10" />
    </div>
  );
}

export function AnalyzingView({ jobId }: { jobId: string }) {
  const { displayStep, completed, error, retry } = useAnalyzing(jobId);
  const router = useRouter();

  useEffect(() => {
    // replace 로 보낸다. 뒤로 가기가 이미 끝난 분석 화면으로 돌아오면 안 된다.
    if (completed) router.replace(`/result/${jobId}`);
  }, [completed, jobId, router]);

  if (error !== null) {
    return (
      <div className={`${card} flex w-full max-w-md flex-col items-center gap-5 p-8 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <AlertIcon width={28} height={28} />
        </span>
        <p role="alert" className="text-base font-semibold">
          {error}
        </p>
        <button type="button" onClick={retry} className={buttonPrimary}>
          <RefreshIcon width={18} height={18} />
          다시 시도
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className={`${card} flex w-full max-w-md flex-col items-center gap-4 p-10 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-safe-soft text-safe">
          <CheckCircleIcon width={28} height={28} />
        </span>
        {/* 곧 결과 화면으로 넘어간다. 그 사이 빈 화면이 보이지 않게 한다. */}
        <p role="status" className="text-base font-semibold">
          분석이 끝났어요
        </p>
        <p className="text-sm text-muted">결과 화면으로 이동하고 있어요…</p>
      </div>
    );
  }

  const current = ANALYSIS_STEP.indexOf(displayStep);

  return (
    <div className={`${card} flex w-full max-w-md flex-col gap-8 p-8`}>
      <ScanningDocument />

      <p role="status" aria-live="polite" className="text-center text-base font-semibold">
        {STEP_LABEL[displayStep]}
      </p>

      <ol className="flex flex-col gap-1" aria-label="분석 단계">
        {ANALYSIS_STEP.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li
              key={step}
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${active ? "bg-brand-soft" : ""}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-brand text-brand-ink"
                    : active
                      ? "border-2 border-brand text-brand"
                      : "border border-line text-subtle"
                }`}
              >
                {done ? "✓" : active ? <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> : i + 1}
              </span>
              <span className="flex flex-col">
                <span className={`text-sm font-semibold ${i > current ? "text-subtle" : ""}`}>
                  {STEP_TITLE[step].title}
                </span>
                <span className="text-xs text-muted">{STEP_TITLE[step].detail}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="rounded-xl bg-surface-muted px-4 py-3 text-center text-xs leading-relaxed text-muted">
        보통 1분 안팎 걸려요. 창을 닫지 말고 잠시만 기다려 주세요.
      </p>
    </div>
  );
}
