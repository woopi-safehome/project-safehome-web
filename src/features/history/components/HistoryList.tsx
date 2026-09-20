"use client";

import Link from "next/link";
import type { JobStatus, SafetyLevel } from "@/shared/api/contract";
import type { DeedJobSummary } from "../api";
import { useHistory } from "../useHistory";

/**
 * 분석 이력 목록. 판정을 다시 계산하지 않고 서버가 준 등급을 그대로 보여준다.
 */

const STATUS: Record<JobStatus, { label: string; tone: string }> = {
  COMPLETED: { label: "완료", tone: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" },
  IN_PROGRESS: { label: "분석 중", tone: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200" },
  PENDING: { label: "분석 중", tone: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200" },
  FAILED: { label: "실패", tone: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" },
};

const SAFETY: Record<SafetyLevel, string> = {
  SAFE: "안전",
  CAUTION: "주의",
  DANGER: "위험",
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

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{job.fileName}</p>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${status.tone}`}>
          {status.label}
        </span>
      </div>

      {job.address !== null && (
        <p className="mt-2 truncate text-xs text-black/60 dark:text-white/60">{job.address}</p>
      )}

      <div className="mt-3 flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
        {job.safetyLevel !== null && (
          <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
            {SAFETY[job.safetyLevel]}
          </span>
        )}
        {job.leaseType !== null && (
          <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
            {job.leaseType}
          </span>
        )}
        {date !== "" && <span>{date}</span>}
      </div>
    </>
  );

  const className = "block rounded-xl border border-black/10 p-4 dark:border-white/15";
  const to = destinationOf(job);

  if (to === null) {
    return (
      <li className={className}>
        {body}
        <p className="mt-2 text-xs text-black/50 dark:text-white/50">
          분석에 실패한 파일입니다. 새로운 파일을 다시 업로드해 주세요.
        </p>
      </li>
    );
  }

  return (
    <li>
      <Link href={to} className={`${className} transition-colors hover:border-black/30 dark:hover:border-white/30`}>
        {body}
      </Link>
    </li>
  );
}

export function HistoryList() {
  const { jobs, loading, loadingMore, hasNext, error, reload, loadMore } = useHistory();

  if (loading) {
    return (
      <p role="status" className="text-sm text-black/60 dark:text-white/60">
        이력을 불러오는 중…
      </p>
    );
  }

  if (error !== null) {
    // 로그인이 없어서 막힌 것이면 다시 시도해도 같다. 갈 곳을 준다.
    const needsLogin = error === "로그인이 필요합니다.";
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p role="alert" className="text-sm">
          {error}
        </p>
        {needsLogin ? (
          <Link
            href="/login"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            로그인하기
          </Link>
        ) : (
          <button
            type="button"
            onClick={reload}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm">분석 이력이 없습니다</p>
        <Link
          href="/"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          분석 시작하기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
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
          className="self-center rounded-full border border-black/15 px-6 py-2.5 text-sm transition-opacity disabled:opacity-40 dark:border-white/20"
        >
          {loadingMore ? "불러오는 중…" : "더 보기"}
        </button>
      )}
    </div>
  );
}
