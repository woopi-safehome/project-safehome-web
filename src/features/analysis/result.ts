import type {
  ChecklistStatus,
  RecommendationPriority,
  RiskLevel,
  SafetyLevel,
} from "@/shared/api/contract";

/**
 * 분석 결과의 구조.
 *
 * **원본은 ai-api 저장소 README 의 계약 절이다.** 백엔드는 이 객체를 해석하지 않고 그대로 통과시키므로,
 * 형식이 의심스러우면 api 가 아니라 ai-api 쪽을 본다.
 *
 * **없을 수 있는 필드가 셋이다.** 존재를 가정하지 말고, 없을 때 무엇을 보여줄지 정해 둔다.
 * - `references` — 등급이 SAFE 가 아니고 검색까지 성공했을 때만 붙는다.
 *   검색 실패를 치명적으로 다루지 않으므로 **등급만 보고 존재를 단정할 수 없다.**
 * - `references.laws` · `references.cases` — `references` 가 있어도 **한쪽만 있을 수 있다.**
 * - `checklist[].analysis` — 모델이 채웠을 때만 붙는다. **항목 자체는 항상 11개다.**
 */

export type PropertyInfo = {
  address: string;
  type: string;
  area: string;
  structure?: string;
  purpose?: string;
  buildYear?: string;
};

export type OwnershipInfo = {
  currentOwner: string;
  ownerType: string;
  shareRatio?: string;
  recentTransferDate?: string;
  recentTransferCause?: string;
  transferCount?: number;
  /** 갭투자 신호. 잦은 소유권 이전은 보증금 관점에서 위험 요소다. */
  frequentTransferWarning?: boolean;
};

export type ChecklistItem = {
  id: string;
  category: string;
  item: string;
  status: ChecklistStatus;
  detail: string;
  analysis?: { findings: string; leaseImpact: string };
};

export type RiskSummary = {
  leaseType: string;
  level: RiskLevel;
  content: string;
};

export type Recommendation = {
  priority: RecommendationPriority;
  title: string;
  description: string;
};

export type ReferenceItem = {
  source: string;
  article: string;
  title: string;
  content: string;
  riskContext: string;
  tags?: string[];
};

export type References = {
  laws?: ReferenceItem[];
  cases?: ReferenceItem[];
};

/** 등기부등본이 아니면 `isValidDeed` 가 false 이고 `reason` 만 온다. 나머지는 계산조차 하지 않는다. */
export type DeedAnalysis = {
  isValidDeed: boolean;
  reason?: string;
  safetyLevel?: SafetyLevel;
  analysisSummary?: string;
  propertyInfo?: PropertyInfo;
  ownershipInfo?: OwnershipInfo;
  checklist?: ChecklistItem[];
  riskSummary?: RiskSummary;
  overallSummary?: string;
  recommendations?: Recommendation[];
  references?: References;
};
