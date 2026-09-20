import { apiFetch } from "@/shared/api/client";
import type { JobStatus, Pagination, SafetyLevel } from "@/shared/api/contract";

/** 이 기능이 서버에 무엇을 묻는지. 형식의 원본은 api 저장소 README 의 계약 절이다. */

export type DeedJobSummary = {
  jobId: string;
  fileName: string;
  fileSize: number;
  status: JobStatus;
  safetyLevel: SafetyLevel | null;
  address: string | null;
  /** 오프셋 없는 로컬 시각이다. Date 로 파싱하면 브라우저 시간대로 해석되어 어긋난다. */
  createdAt: string | null;
  leaseType: string | null;
};

export type JobPage = {
  items: DeedJobSummary[];
  pagination: Pagination;
};

/**
 * 내 분석 이력.
 *
 * **요청의 `page` 는 0부터고 응답의 `currentPage` 는 1부터다.** 기준이 서로 다르므로
 * 응답 값을 그대로 다음 요청에 넣으면 한 페이지를 건너뛴다. 다음 쪽이 있는지는 `hasNext` 로 본다.
 */
export async function getMyJobs(page: number): Promise<JobPage> {
  return apiFetch<JobPage>(`/api/deed/jobs?page=${page}`);
}
