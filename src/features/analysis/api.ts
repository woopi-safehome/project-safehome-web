import { apiFetch } from "@/shared/api/client";
import type { AnalysisStep, JobStatus, LeaseType } from "@/shared/api/contract";
import type { DeedAnalysis } from "./result";

/** 이 기능이 서버에 무엇을 묻는지. 형식의 원본은 api 저장소 README 의 계약 절이다. */

/**
 * 업로드하면 서버는 작업을 만들고 **식별자만 즉시** 돌려준다.
 * 분석은 그 뒤에 비동기로 돌므로, 진행 상황은 스트림으로 따로 구독해야 한다.
 */
export async function uploadDeed(file: File, leaseType: LeaseType | null): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  // 선택 항목이다. 고르지 않으면 서버가 공통 관점으로 분석한다.
  if (leaseType !== null) form.append("leaseType", leaseType);

  const { jobId } = await apiFetch<{ jobId: string }>("/api/deed/upload", {
    method: "POST",
    body: form,
  });
  return jobId;
}

export type DeedJob = {
  jobId: string;
  fileName: string;
  fileSize: number;
  status: JobStatus;
  step: AnalysisStep | null;
  description: string | null;
  /** 분석이 끝나기 전에는 null. 구조는 ai-api 가 정한다 — [`result.ts`](./result.ts) 참조. */
  result: DeedAnalysis | null;
};

/**
 * **완료 이벤트는 결과를 담고 있지 않다.** 스트림에서 완료를 받으면 이것으로 따로 조회해야 한다.
 * 두 단계를 하나로 착각하면 결과가 비어 보인다.
 */
export async function getJob(jobId: string): Promise<DeedJob> {
  return apiFetch<DeedJob>(`/api/deed/jobs/${jobId}`);
}
