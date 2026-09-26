"use client";

import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import type { ChecklistStatus, RecommendationPriority, SafetyLevel } from "@/shared/api/contract";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentIcon,
  HomeIcon,
  InfoIcon,
  KeyIcon,
  ListCheckIcon,
  RefreshIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "@/shared/ui/icons";
import { buttonPrimary, buttonSecondary, card } from "@/shared/ui/styles";
import { PublicChecks } from "@/shared/ui/PublicChecks";
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
 *
 * **"없음"은 `undefined` 만이 아니다.** 분석 서버의 프롬프트가 확인할 수 없는 값을 `null` 로 채우라고
 * 지시하므로, 필드가 `null` 로 오는 것이 정상이다. 그래서 존재 확인은 전부 `!= null` 로 한다 —
 * `!== undefined` 로 보면 `null` 이 통과해 빈 줄이 찍히거나 화면이 멈춘다.
 */

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * 등급별 표시. '안전'을 "계약해도 된다"로 읽지 않도록 설명을 단정하지 않는다 —
 * 등기부 밖의 위험은 보지 못하기 때문이다.
 */
const SAFETY: Record<SafetyLevel, { label: string; desc: string; next: string; Icon: Icon; tone: string; iconTone: string }> = {
  SAFE: {
    label: "안전",
    desc: "등기부에서는 걱정할 만한 내용이 보이지 않았어요",
    next: "그래도 등기부에 안 나오는 위험(먼저 사는 세입자, 세금 체납, 시세)은 아래 공공 서비스에서 따로 확인해 주세요.",
    Icon: ShieldCheckIcon,
    tone: "border-safe/25 bg-safe-soft",
    iconTone: "bg-safe text-surface",
  },
  CAUTION: {
    label: "주의",
    desc: "한번 따져 봐야 할 내용이 있어요",
    next: "아래 ‘주의’ 항목의 금액과 순서를 내 보증금과 비교해 보고, 중개사에게 설명을 부탁해 보세요.",
    Icon: InfoIcon,
    tone: "border-caution/25 bg-caution-soft",
    iconTone: "bg-caution text-surface",
  },
  DANGER: {
    label: "위험",
    desc: "보증금을 잃을 수 있는 내용이 있어요",
    next: "계약은 잠시 멈추고, 아래 ‘위험’ 항목을 법률 전문가에게 꼭 확인받아 보세요.",
    Icon: AlertIcon,
    tone: "border-danger/25 bg-danger-soft",
    iconTone: "bg-danger text-surface",
  },
};

const STATUS_STYLE: Record<ChecklistStatus, { pill: string; bar: string }> = {
  양호: { pill: "bg-safe-soft text-safe", bar: "bg-safe" },
  주의: { pill: "bg-caution-soft text-caution", bar: "bg-caution" },
  위험: { pill: "bg-danger-soft text-danger", bar: "bg-danger" },
};

const PRIORITY_STYLE: Record<RecommendationPriority, string> = {
  필수: "bg-brand text-brand-ink",
  권장: "bg-brand-soft text-brand",
  참고: "bg-surface-muted text-muted",
};

/** 체크리스트 분류의 그림. 모르는 분류가 와도 기본 그림으로 보여 준다. */
const CATEGORY_ICON: Record<string, Icon> = {
  소유권: KeyIcon,
  담보권: HomeIcon,
  법적위험: AlertIcon,
  특수권리: DocumentIcon,
};

function Card({
  title,
  Icon,
  trailing,
  children,
}: {
  title: string;
  Icon?: Icon;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`${card} p-5 sm:p-6`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          {Icon !== undefined && <Icon width={20} height={20} className="text-brand" />}
          {title}
        </h2>
        {trailing}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex gap-3 py-2 text-sm">
      <dt className="w-20 shrink-0 text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Chip({ children, tone }: { children: ReactNode; tone: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{children}</span>;
}

function Property({ info }: { info: PropertyInfo }) {
  return (
    <dl className="divide-y divide-line">
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
    <dl className="divide-y divide-line">
      <Row label="소유자" value={info.currentOwner} />
      <Row label="구분" value={info.ownerType} />
      <Row label="지분" value={info.shareRatio} />
      <Row label="최근 이전" value={info.recentTransferDate} />
      <Row label="이전 원인" value={info.recentTransferCause} />
      <Row label="이전 횟수" value={info.transferCount == null ? null : `${info.transferCount}회`} />
    </dl>
  );
}

/** 상태별 개수. 등급 옆에서 "무엇 때문에 이 등급인지"를 한눈에 보게 한다. */
function StatusCounts({ items }: { items: ChecklistItem[] }) {
  const counts = (["위험", "주의", "양호"] as const)
    .map((status) => ({ status, n: items.filter((it) => it.status === status).length }))
    .filter(({ n }) => n > 0);

  return (
    <ul className="flex flex-wrap justify-center gap-2 sm:justify-start" aria-label="항목별 상태">
      {counts.map(({ status, n }) => (
        <li key={status} className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[status].pill}`}>
          {`${status} ${n}건`}
        </li>
      ))}
    </ul>
  );
}

/** 항목 하나. */
function ChecklistEntry({ it }: { it: ChecklistItem }) {
  const style = STATUS_STYLE[it.status];
  return (
    <li className="relative overflow-hidden rounded-2xl bg-surface p-4 pl-5 ring-1 ring-line/70">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${style?.bar ?? "bg-line"}`} />
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold leading-relaxed">{it.item}</span>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${style?.pill ?? ""}`}>{it.status}</span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{it.detail}</p>
      {/* 모델이 채웠을 때만 온다. 항목 자체는 늘 있다. */}
      {it.analysis != null && (
        <div className="mt-3 flex flex-col gap-1.5 rounded-xl bg-surface-muted p-3 text-sm leading-relaxed">
          <p>{it.analysis.findings}</p>
          <p className="text-muted">{it.analysis.leaseImpact}</p>
        </div>
      )}
    </li>
  );
}

function GroupedList({ items }: { items: ChecklistItem[] }) {
  // 서버가 준 순서를 유지한 채 분류끼리만 묶는다. 순서를 바꾸는 것도 해석이다.
  const groups = items.reduce<{ category: string; items: ChecklistItem[] }[]>((acc, it) => {
    const last = acc[acc.length - 1];
    if (last !== undefined && last.category === it.category) last.items.push(it);
    else acc.push({ category: it.category, items: [it] });
    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => {
        const GroupIcon = CATEGORY_ICON[group.category] ?? ListCheckIcon;
        return (
          <div key={group.category} className="flex flex-col gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-muted">
              <GroupIcon width={15} height={15} />
              {group.category}
            </h3>
            <ul className="flex flex-col gap-2">
              {group.items.map((it) => (
                <ChecklistEntry key={it.id} it={it} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 살펴봐야 할 항목(주의·위험)을 먼저 펼쳐 보이고, 양호한 항목은 접어 둔다.
 * 11개가 같은 크기로 늘어서면 위험 1건이 양호 여러 건 사이에 묻힌다.
 *
 * **상태로 나누기만 한다.** 상태는 서버가 정한 값 그대로이고, 각 묶음 안의 순서도 서버 순서다.
 * 모르는 상태가 오면 양호로 치지 않고 펼친 쪽에 둔다 — 숨겨서 놓치는 것보다 낫다.
 */
function Checklist({ items }: { items: ChecklistItem[] }) {
  const attention = items.filter((it) => it.status !== "양호");
  const fine = items.filter((it) => it.status === "양호");

  // 전부 양호하면 접을 이유가 없다.
  if (attention.length === 0) return <GroupedList items={items} />;

  return (
    <div className="flex flex-col gap-5">
      <GroupedList items={attention} />
      {fine.length > 0 && (
        <details className="group rounded-2xl bg-surface-muted/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
            {`양호한 항목 ${fine.length}건 보기`}
            <ChevronDownIcon width={18} height={18} className="shrink-0 text-subtle transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4">
            <GroupedList items={fine} />
          </div>
        </details>
      )}
    </div>
  );
}

function Risk({ summary }: { summary: RiskSummary }) {
  return (
    <>
      {summary.leaseType != null && <p className="text-xs text-muted">계약 유형: {summary.leaseType}</p>}
      <p className="mt-2 text-sm leading-relaxed">{summary.content}</p>
    </>
  );
}

function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((r, i) => (
        <li key={`${i}-${r.title}`} className="flex gap-3 rounded-2xl p-4 ring-1 ring-line/70">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-muted">
            {i + 1}
          </span>
          <div className="flex flex-col gap-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              {r.priority != null && (
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${PRIORITY_STYLE[r.priority] ?? ""}`}>
                  {r.priority}
                </span>
              )}
              {r.title}
            </p>
            <p className="text-sm leading-relaxed text-muted">{r.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ReferenceList({ title, items }: { title: string; items: ReferenceItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-bold text-muted">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((r) => (
          <li key={`${r.source}-${r.article}-${r.title}`} className="rounded-2xl bg-surface-muted p-4 text-sm">
            <p className="font-semibold">
              {r.title} <span className="font-normal text-subtle">{r.article}</span>
            </p>
            <p className="mt-1 leading-relaxed text-muted">{r.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomeLink() {
  return (
    <Link href="/#analyze" className={buttonSecondary}>
      새로 분석하기
      <ArrowRightIcon width={16} height={16} />
    </Link>
  );
}

function Disclaimer() {
  return (
    <p className="flex gap-2 rounded-2xl bg-surface-muted px-4 py-3 text-xs leading-relaxed text-muted">
      <ScaleIcon width={16} height={16} className="mt-0.5 shrink-0" />
      <span>
        이 결과는 등기부등본 내용을 AI가 읽고 정리한 참고 정보예요. 법률 자문은 아니에요. AI가 잘못 읽을 수도 있으니
        중요한 항목은 등기부 원문과 맞춰 보시고, 계약 전에는 전문가와 함께 확인해 주세요.
      </span>
    </p>
  );
}

function Analysis({ analysis }: { analysis: DeedAnalysis }) {
  // 등기부등본이 아니면 판정 자체를 건너뛴다. 이유만 온다.
  if (!analysis.isValidDeed) {
    return (
      <div className={`${card} flex w-full max-w-md flex-col items-center gap-5 p-8 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-caution-soft text-caution">
          <DocumentIcon width={28} height={28} />
        </span>
        <p role="alert" className="text-base font-semibold">
          {analysis.reason ?? "등기부등본이 아닌 것 같아요."}
        </p>
        <p className="text-sm text-muted">인터넷등기소에서 받은 등기사항전부증명서 PDF를 올려 주세요.</p>
        <HomeLink />
      </div>
    );
  }

  const safety = analysis.safetyLevel == null ? null : SAFETY[analysis.safetyLevel];
  const checklist = analysis.checklist ?? [];
  const refs = analysis.references;
  const hasRefs = (refs?.laws?.length ?? 0) > 0 || (refs?.cases?.length ?? 0) > 0;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {safety != null && (
        <section className={`flex flex-col items-center gap-5 rounded-3xl border p-6 text-center sm:flex-row sm:items-start sm:p-8 sm:text-left ${safety.tone}`}>
          <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${safety.iconTone}`}>
            <safety.Icon width={32} height={32} />
          </span>
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <p className="text-xs font-medium text-muted">이 집의 등급</p>
              <p className="text-3xl font-bold tracking-tight">{safety.label}</p>
              <p className="mt-1 text-base font-medium">{safety.desc}</p>
            </div>
            {checklist.length > 0 && <StatusCounts items={checklist} />}
            <div className="flex flex-col gap-0.5 rounded-2xl bg-surface/75 px-4 py-3 text-sm leading-relaxed">
              <p className="font-semibold">이렇게 해 보세요</p>
              <p>{safety.next}</p>
            </div>
          </div>
        </section>
      )}

      {analysis.analysisSummary != null && (
        <Card title="한눈에 보기" Icon={CheckCircleIcon}>
          <p className="text-[15px] leading-relaxed">{analysis.analysisSummary}</p>
        </Card>
      )}

      {checklist.length > 0 && (
        <Card title="항목별 확인 결과" Icon={ListCheckIcon}>
          <Checklist items={checklist} />
        </Card>
      )}

      {analysis.riskSummary != null && (
        <Card
          title="위험 요소 정리"
          Icon={AlertIcon}
          trailing={
            analysis.riskSummary.level != null ? (
              <Chip tone="bg-surface-muted text-muted">{analysis.riskSummary.level}</Chip>
            ) : undefined
          }
        >
          <Risk summary={analysis.riskSummary} />
        </Card>
      )}

      {analysis.recommendations != null && analysis.recommendations.length > 0 && (
        <Card title="계약 전에 해 두면 좋은 일" Icon={CheckCircleIcon}>
          <Recommendations items={analysis.recommendations} />
        </Card>
      )}

      {/* 등급과 무관하게 늘 보인다. '안전'이어도 등기부 밖의 위험은 남아 있다. */}
      <PublicChecks />

      {analysis.overallSummary != null && (
        <Card title="정리하면" Icon={DocumentIcon}>
          <p className="text-sm leading-relaxed">{analysis.overallSummary}</p>
        </Card>
      )}

      {/* 집·소유자 정보는 사용자가 이미 아는 내용이라 판단에 필요한 것들 뒤로 둔다. */}
      {(analysis.propertyInfo != null || analysis.ownershipInfo != null) && (
        <div className="grid gap-4 md:grid-cols-2">
          {analysis.propertyInfo != null && (
            <Card title="집 정보" Icon={HomeIcon}>
              <Property info={analysis.propertyInfo} />
            </Card>
          )}
          {analysis.ownershipInfo != null && (
            <Card
              title="소유자 정보"
              Icon={KeyIcon}
              trailing={
                analysis.ownershipInfo.frequentTransferWarning === true ? (
                  <Chip tone="bg-caution-soft text-caution">잦은 이전</Chip>
                ) : undefined
              }
            >
              <Ownership info={analysis.ownershipInfo} />
            </Card>
          )}
        </div>
      )}

      {/* 등급이 SAFE 가 아니어도 검색이 실패하면 없다. 등급만 보고 존재를 단정하지 않는다. */}
      {hasRefs && (
        <Card title="참고한 법령과 사례" Icon={ScaleIcon}>
          <div className="flex flex-col gap-5">
            {refs?.laws != null && refs.laws.length > 0 && <ReferenceList title="법령" items={refs.laws} />}
            {refs?.cases != null && refs.cases.length > 0 && <ReferenceList title="사례" items={refs.cases} />}
          </div>
        </Card>
      )}

      <Disclaimer />

      <div className="flex justify-center py-4">
        <HomeLink />
      </div>
    </div>
  );
}

export function ResultView({ jobId }: { jobId: string }) {
  const { job, loading, error, reload } = useResult(jobId);

  if (loading) {
    return (
      <div className={`${card} flex w-full max-w-md flex-col items-center gap-4 p-10`}>
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-soft border-t-brand" aria-hidden="true" />
        <p role="status" className="text-sm text-muted">
          결과를 불러오고 있어요…
        </p>
      </div>
    );
  }

  // 실패한 작업은 서버가 사유를 담아 준다. 있으면 그것을 쓴다 — 실제 응답에서 확인했다.
  const missing =
    job?.result == null
      ? (job?.status === "FAILED" ? job.description : null) ?? "결과를 찾지 못했어요."
      : null;
  const message = error ?? missing;
  if (message !== null) {
    return (
      <div className={`${card} flex w-full max-w-md flex-col items-center gap-5 p-8 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <AlertIcon width={28} height={28} />
        </span>
        <p role="alert" className="text-base font-semibold">
          {message}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={reload} className={buttonPrimary}>
            <RefreshIcon width={18} height={18} />
            다시 시도
          </button>
          <HomeLink />
        </div>
      </div>
    );
  }

  return <Analysis analysis={job!.result!} />;
}
