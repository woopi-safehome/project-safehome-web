"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { JobStatus, SafetyLevel } from "@/shared/api/contract";
import { HistoryIllustration } from "@/shared/ui/illustrations";
import { ChevronRightIcon, DocumentIcon, RefreshIcon } from "@/shared/ui/icons";
import { buttonPrimary, buttonSecondary, card } from "@/shared/ui/styles";
import type { DeedJobSummary } from "../api";
import { useHistory } from "../useHistory";

/**
 * 분석 이력 목록. 판정을 다시 계산하지 않고 서버가 준 등급을 그대로 보여준다.
 */

const STATUS: Record<JobStatus, { label: string; tone: string }> = {
  COMPLETED: { label: "완료", tone: "bg-brand-soft text-brand" },
  IN_PROGRESS: { label: "분석 중", tone: "bg-surface-muted text-muted" },
  PENDING: { label: "분석 중", tone: "bg-surface-muted text-muted" },
  FAILED: { label: "실패", tone: "bg-danger-soft text-danger" },
};

const SAFETY: Record<SafetyLevel, { label: string; tone: string }> = {
  SAFE: { label: "안전", tone: "bg-safe-soft text-safe" },
  CAUTION: { label: "주의", tone: "bg-caution-soft text-caution" },
  DANGER: { label: "위험", tone: "bg-danger-soft text-danger" },
};

/**
 * 계약상 오프셋 없는 로컬 시각이라, 날짜 부분을 문자열로 잘라 쓴다.
 * `new Date()` 로 파싱하면 브라우저 시간대로 해석되어 하루가 밀릴 수 있다.
 */
function formatDate(createdAt: string | null): string {
  if (createdAt === null) return "";
  const date = createdAt.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.replaceAll("-", ".") : "";
}

/** 끝난 작업은 결과로, 도는 중이면 진행 화면으로. 실패한 것은 갈 곳이 없다. */
function destinationOf(job: DeedJobSummary): string | null {
  if (job.status === "COMPLETED") return `/result/${job.jobId}`;
  if (job.status === "FAILED") return null;
  return `/analyzing/${job.jobId}`;
}

function JobCard({ job }: { job: DeedJobSummary }) {
  const status = STATUS[job.status];
  const date = formatDate(job.createdAt);
  const to = destinationOf(job);

  const body = (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <DocumentIcon width={22} height={22} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-sm font-semibold">{job.fileName}</p>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.tone}`}>
            {status.label}
          </span>
        </div>
        {job.address !== null && <p className="truncate text-sm text-muted">{job.address}</p>}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {job.safetyLevel !== null && (
            <span className={`rounded-full px-2 py-0.5 font-bold ${SAFETY[job.safetyLevel].tone}`}>
              {SAFETY[job.safetyLevel].label}
            </span>
          )}
          {job.leaseType !== null && (
            <span className="rounded-full bg-surface-muted px-2 py-0.5">{job.leaseType}</span>
          )}
          {date !== "" && <span>{date}</span>}
        </div>
        {to === null && (
          <p className="text-xs text-danger">분석하지 못한 파일이에요. 다른 파일로 다시 올려 주세요.</p>
        )}
      </div>
      {to !== null && <ChevronRightIcon className="mt-3 shrink-0 text-subtle" />}
    </div>
  );

  const className = `${card} block p-4`;

  if (to === null) {
    return <li className={className}>{body}</li>;
  }

  return (
    <li>
      <Link href={to} className={`${className} transition-all hover:border-brand/40 hover:shadow-md hover:shadow-brand/5`}>
        {body}
      </Link>
    </li>
  );
}

/** 목록이 비었거나 막혔을 때의 화면. 무엇을 하면 되는지를 버튼으로 준다. */
function Empty({ message, role, action }: { message: string; role?: "alert"; action: ReactNode }) {
  return (
    <div className={`${card} flex w-full max-w-2xl flex-col items-center gap-5 px-6 py-10 text-center`}>
      <HistoryIllustration className="h-36 w-auto" />
      <p role={role} className="text-base font-semibold">
        {message}
      </p>
      {action}
    </div>
  );
}

export function HistoryList() {
  const { jobs, loading, loadingMore, hasNext, error, reload, loadMore } = useHistory();

  if (loading) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <p role="status" className="sr-only">
          이력을 불러오는 중…
        </p>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${card} h-24 animate-pulse bg-surface-muted/60`} />
        ))}
      </div>
    );
  }

  if (error !== null) {
    // 로그인이 없어서 막힌 것이면 다시 시도해도 같다. 갈 곳을 준다.
    const needsLogin = error === "로그인이 필요합니다.";
    return (
      <Empty
        message={error}
        role="alert"
        action={
          needsLogin ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted">로그인하면 분석한 등기부등본을 언제든 다시 볼 수 있어요.</p>
              <Link href="/login" className={buttonPrimary}>
                로그인하기
              </Link>
            </div>
          ) : (
            <button type="button" onClick={reload} className={buttonPrimary}>
              <RefreshIcon width={18} height={18} />
              다시 시도
            </button>
          )
        }
      />
    );
  }

  if (jobs.length === 0) {
    return (
      <Empty
        message="아직 분석한 기록이 없어요"
        action={
          <Link href="/#analyze" className={buttonPrimary}>
            분석 시작하기
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {jobs.map((job) => (
          <JobCard key={job.jobId} job={job} />
        ))}
      </ul>
      {hasNext && (
        <button
          type="button"
          onClick={() => void loadMore()}
          disabled={loadingMore}
          className={`${buttonSecondary} self-center`}
        >
          {loadingMore ? "불러오는 중…" : "더 보기"}
        </button>
      )}
    </div>
  );
}
