/**
 * 서버가 정하는 형식. 원본은 api 저장소 README 의 "App→API 계약" 절이다.
 * 여기서 값을 바꾸지 않는다 — 맞추는 쪽은 이쪽이다.
 * 모르는 필드가 와도 무시하고 동작해야 한다. 서버가 이 앱보다 먼저 배포된다.
 */

export const JOB_STATUS = ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] as const;
export type JobStatus = (typeof JOB_STATUS)[number];

export const ANALYSIS_STEP = ["PDF_PARSING", "LLM_ANALYSIS", "POST_PROCESSING"] as const;
export type AnalysisStep = (typeof ANALYSIS_STEP)[number];

export const SAFETY_LEVEL = ["SAFE", "CAUTION", "DANGER"] as const;
export type SafetyLevel = (typeof SAFETY_LEVEL)[number];

/** 아래 셋은 분석 결과 안에 들어오는 값이라 원본이 ai-api 저장소의 계약 절이다. */

export const CHECKLIST_STATUS = ["양호", "주의", "위험"] as const;
export type ChecklistStatus = (typeof CHECKLIST_STATUS)[number];

export const RECOMMENDATION_PRIORITY = ["필수", "권장", "참고"] as const;
export type RecommendationPriority = (typeof RECOMMENDATION_PRIORITY)[number];

export const RISK_LEVEL = ["낮음", "보통", "높음"] as const;
export type RiskLevel = (typeof RISK_LEVEL)[number];

export type LeaseType = "전세" | "월세";

/** 모든 JSON 응답은 이 봉투에 감싸인다. `type` 이 판별 필드다. 단 스트리밍은 예외다. */
export type ApiEnvelope<T> =
  | { type: "success"; data: T; message: string; pagination: Pagination | null }
  | { type: "error"; code: string; message: string; details: unknown };

export type Pagination = {
  currentPage: number; // 1부터. 요청의 page 는 0부터라 기준이 다르다.
  totalPages: number;
  totalElements: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
};
