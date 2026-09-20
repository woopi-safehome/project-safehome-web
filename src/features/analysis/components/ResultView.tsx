"use client";

import Link from "next/link";
import type { SafetyLevel } from "@/shared/api/contract";
import type {
  ChecklistItem,
  DeedAnalysis,
  OwnershipInfo,
  PropertyInfo,
  Recommendation,
  ReferenceItem,
  RiskSummary,
} from "../result";
import { useResult } from "../useResult";

/**
 * 결과 표시. **판정을 다시 계산하지 않는다** — 등급도 상태도 서버가 정한 값을 그대로 쓴다.
 * 조건부 필드가 셋이라(`references`, 그 안의 laws·cases, `checklist[].analysis`)
 * 있으면 보여주고 없으면 그 자리를 비운다.
 */

const SAFETY: Record<SafetyLevel, { label: string; desc: string; tone: string }> = {
  SAFE: { label: "안전", desc: "이 부동산은 안전합니다", tone: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" },
  CAUTION: { label: "주의", desc: "확인이 필요한 사항이 있습니다", tone: "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100" },
  DANGER: { label: "위험", desc: "위험 요소가 발견되었습니다", tone: "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100" },
};

const STATUS_TONE: Record<string, string> = {
  양호: "text-emerald-700 dark:text-emerald-300",
  주의: "text-amber-700 dark:text-amber-300",
  위험: "text-red-700 dark:text-red-300",
};

function Card({ title, trailing, children }: { title: string; trailing?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        {trailing}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === "") return null;
  return (
    <div className="flex gap-3 py-1 text-sm">
      <dt className="w-24 shrink-0 text-black/50 dark:text-white/50">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs ${tone}`}>{children}</span>;
}

function Property({ info }: { info: PropertyInfo }) {
  return (
    <dl>
      <Row label="주소" value={info.address} />
      <Row label="종류" value={info.type} />
      <Row label="면적" value={info.area} />
      <Row label="구조" value={info.structure} />
      <Row label="용도" value={info.purpose} />
      <Row label="준공" value={info.buildYear} />
    </dl>
  );
}

function Ownership({ info }: { info: OwnershipInfo }) {
  return (
    <dl>
      <Row label="소유자" value={info.currentOwner} />
      <Row label="구분" value={info.ownerType} />
      <Row label="지분" value={info.shareRatio} />
      <Row label="최근 이전" value={info.recentTransferDate} />
      <Row label="이전 원인" value={info.recentTransferCause} />
      <Row label="이전 횟수" value={info.transferCount} />
    </dl>
  );
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
      {items.map((it) => (
        <li key={it.id} className="py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm">{it.item}</span>
            <span className={`shrink-0 text-xs font-medium ${STATUS_TONE[it.status] ?? ""}`}>
              {it.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-black/60 dark:text-white/60">{it.detail}</p>
          {/* 모델이 채웠을 때만 온다. 항목 자체는 늘 있다. */}
          {it.analysis !== undefined && (
            <div className="mt-2 rounded-lg bg-black/[0.03] p-3 text-xs dark:bg-white/[0.06]">
              <p>{it.analysis.findings}</p>
              <p className="mt-1 text-black/60 dark:text-white/60">{it.analysis.leaseImpact}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function Risk({ summary }: { summary: RiskSummary }) {
  return (
    <>
      <p className="text-xs text-black/50 dark:text-white/50">임대차 유형: {summary.leaseType}</p>
      <p className="mt-2 text-sm leading-relaxed">{summary.content}</p>
    </>
  );
}

function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((r) => (
        <li key={r.title} className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-xs text-black/50 dark:text-white/50">
            {r.priority}
          </span>
          <div>
            <p className="text-sm font-medium">{r.title}</p>
            <p className="mt-0.5 text-xs text-black/60 dark:text-white/60">{r.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReferenceList({ title, items }: { title: string; items: ReferenceItem[] }) {
  return (
    <div className="mt-2 first:mt-0">
      <h3 className="text-xs font-medium text-black/50 dark:text-white/50">{title}</h3>
      <ul className="mt-1 flex flex-col gap-2">
        {items.map((r) => (
          <li key={`${r.source}-${r.article}-${r.title}`} className="text-xs">
            <p className="font-medium">
              {r.title} <span className="text-black/40 dark:text-white/40">{r.article}</span>
            </p>
            <p className="mt-0.5 text-black/60 dark:text-white/60">{r.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomeLink() {
  return (
    <Link href="/" className="text-xs underline underline-offset-4">
      새 분석 시작하기
    </Link>
  );
}

function Analysis({ analysis }: { analysis: DeedAnalysis }) {
  // 등기부등본이 아니면 판정 자체를 건너뛴다. 이유만 온다.
  if (!analysis.isValidDeed) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p role="alert" className="text-sm">
          {analysis.reason ?? "등기부등본으로 보이지 않습니다."}
        </p>
        <HomeLink />
      </div>
    );
  }

  const safety = analysis.safetyLevel === undefined ? null : SAFETY[analysis.safetyLevel];
  const refs = analysis.references;
  const hasRefs = (refs?.laws?.length ?? 0) > 0 || (refs?.cases?.length ?? 0) > 0;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      {safety !== null && (
        <div className={`rounded-xl px-5 py-6 text-center ${safety.tone}`}>
          <p className="text-2xl font-bold">{safety.label}</p>
          <p className="mt-1 text-sm">{safety.desc}</p>
        </div>
      )}

      {analysis.analysisSummary !== undefined && (
        <Card title="분석 결과 요약">
          <p className="text-sm leading-relaxed">{analysis.analysisSummary}</p>
        </Card>
      )}

      {analysis.propertyInfo !== undefined && (
        <Card title="부동산 정보">
          <Property info={analysis.propertyInfo} />
        </Card>
      )}

      {analysis.ownershipInfo !== undefined && (
        <Card
          title="소유권 정보"
          trailing={
            analysis.ownershipInfo.frequentTransferWarning === true ? (
              <Chip tone="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                잦은 이전
              </Chip>
            ) : undefined
          }
        >
          <Ownership info={analysis.ownershipInfo} />
        </Card>
      )}

      {analysis.checklist !== undefined && analysis.checklist.length > 0 && (
        <Card title="안전 체크리스트">
          <Checklist items={analysis.checklist} />
        </Card>
      )}

      {analysis.riskSummary !== undefined && (
        <Card
          title="위험요소 종합 요약"
          trailing={
            <Chip tone="bg-black/5 dark:bg-white/10">{analysis.riskSummary.level}</Chip>
          }
        >
          <Risk summary={analysis.riskSummary} />
        </Card>
      )}

      {analysis.overallSummary !== undefined && (
        <Card title="전체 요약">
          <p className="text-sm leading-relaxed">{analysis.overallSummary}</p>
        </Card>
      )}

      {analysis.recommendations !== undefined && analysis.recommendations.length > 0 && (
        <Card title="권고 사항">
          <Recommendations items={analysis.recommendations} />
        </Card>
      )}

      {/* 등급이 SAFE 가 아니어도 검색이 실패하면 없다. 등급만 보고 존재를 단정하지 않는다. */}
      {hasRefs && (
        <Card title="관련 법령·사례">
          {refs?.laws !== undefined && refs.laws.length > 0 && (
            <ReferenceList title="법령" items={refs.laws} />
          )}
          {refs?.cases !== undefined && refs.cases.length > 0 && (
            <ReferenceList title="사례" items={refs.cases} />
          )}
        </Card>
      )}

      <div className="py-4 text-center">
        <HomeLink />
      </div>
    </div>
  );
}

export function ResultView({ jobId }: { jobId: string }) {
  const { job, loading, error, reload } = useResult(jobId);

  if (loading) {
    return (
      <p role="status" className="text-sm text-black/60 dark:text-white/60">
        결과를 불러오는 중…
      </p>
    );
  }

  // 실패한 작업은 서버가 사유를 담아 준다. 있으면 그것을 쓴다 — 실제 응답에서 확인했다.
  const missing =
    job?.result == null
      ? (job?.status === "FAILED" ? job.description : null) ?? "결과를 찾을 수 없습니다."
      : null;
  const message = error ?? missing;
  if (message !== null) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p role="alert" className="text-sm">
          {message}
        </p>
        <button
          type="button"
          onClick={reload}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          다시 시도
        </button>
        <HomeLink />
      </div>
    );
  }

  return <Analysis analysis={job!.result!} />;
}
