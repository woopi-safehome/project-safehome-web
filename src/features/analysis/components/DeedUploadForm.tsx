"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { ERROR_CODE, type LeaseType } from "@/shared/api/contract";
import { ApiError } from "@/shared/api/client";
import { AlertIcon, DocumentIcon, LockIcon, UploadIcon } from "@/shared/ui/icons";
import { buttonPrimary } from "@/shared/ui/styles";
import { uploadDeed } from "../api";

/**
 * 업로드 입력만 담당한다. 서버 호출은 이 기능의 api 계층이 맡고,
 * 분석 결과의 해석은 서버가 한다 — 화면에서 위험도를 다시 계산하지 않는다.
 */

/** 유형을 고르면 무엇이 달라지는지. 고르지 않아도 되므로 강요하지 않고 알려만 준다. */
const LEASE_HINT: Record<LeaseType | "none", string> = {
  전세: "보증금 전액을 돌려받을 수 있는지를 중심으로 분석해요.",
  월세: "소액 보증금 최우선변제와 퇴거 위험을 중심으로 분석해요.",
  none: "고르지 않으면 전세·월세 공통 관점으로 분석해요.",
};

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export function DeedUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [leaseType, setLeaseType] = useState<LeaseType | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limited, setLimited] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dropHint, setDropHint] = useState<string | null>(null);
  const router = useRouter();

  const ready = file !== null && !uploading;

  function choose(next: File | null) {
    setFile(next);
    setDropHint(null);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped === undefined) return;
    // 고르기 창은 PDF 만 보여 주지만 끌어 놓기는 아무 파일이나 온다. 여기서만 거른다.
    if (dropped.type !== "application/pdf") {
      setDropHint("PDF 파일만 올릴 수 있어요.");
      return;
    }
    choose(dropped);
  }

  async function submit() {
    if (file === null) return;

    setUploading(true);
    setError(null);
    setLimited(false);

    try {
      const jobId = await uploadDeed(file, leaseType);
      // 업로드가 끝나도 분석은 이제 시작이다. 진행 상황은 저쪽에서 구독한다.
      router.push(`/analyzing/${jobId}`);
    } catch (e) {
      // 서버가 준 문구를 그대로 쓴다. 판정도 안내도 서버가 정한다.
      setError(e instanceof ApiError ? e.message : "업로드에 실패했습니다.");
      // 하루 제한은 다시 눌러도 같다. 무엇을 하면 되는지 따로 알린다.
      setLimited(e instanceof ApiError && e.code === ERROR_CODE.dailyLimitExceeded);
      setUploading(false);
    }
  }

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      {/* 입력에 초점이 가면 이 테두리로 보여 준다. 입력 자체는 보이지 않기 때문이다. */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${
          dragging
            ? "border-brand bg-brand-soft"
            : file !== null
              ? "border-brand/40 bg-brand-soft/50"
              : "border-line bg-surface-muted/50 hover:border-brand/50 hover:bg-brand-soft/40"
        }`}
      >
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            file !== null ? "bg-brand text-brand-ink" : "bg-surface text-brand shadow-sm ring-1 ring-line"
          }`}
        >
          {file !== null ? <DocumentIcon width={26} height={26} /> : <UploadIcon width={26} height={26} />}
        </span>
        <span className="flex flex-col gap-1">
          <span className="break-all text-base font-semibold">
            {file ? file.name : "등기부등본 PDF 를 선택하세요"}
          </span>
          <span className="text-sm text-muted">
            {file ? `${formatSize(file.size)} · 눌러서 다른 파일 고르기` : "여기로 끌어 놓거나 눌러서 파일 고르기"}
          </span>
        </span>
        {/*
          `hidden`(display:none)으로 감추면 **키보드로 도달할 수 없어 파일을 아예 고를 수 없다.**
          마우스로는 라벨이 대신 열어 주므로 이 결함은 눈에 띄지 않는다.
          `sr-only` 는 보이지 않게만 하고 초점은 받는다.
        */}
        <input
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => choose(e.target.files?.[0] ?? null)}
        />
      </label>
      {dropHint !== null && <p className="-mt-3 text-center text-sm text-danger">{dropHint}</p>}

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-sm font-semibold">
          계약 유형 <span className="font-normal text-subtle">(선택)</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(["전세", "월세"] as const).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={leaseType === type}
              onClick={() => setLeaseType(leaseType === type ? null : type)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                leaseType === type
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line bg-surface text-ink hover:border-brand/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">{LEASE_HINT[leaseType ?? "none"]}</p>
      </fieldset>

      <button type="submit" disabled={!ready} className={`${buttonPrimary} w-full py-3.5 text-base`}>
        {uploading ? "업로드 중…" : "분석 시작"}
      </button>

      {error !== null && (
        <div className="-mt-2 flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-danger">
          <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p role="alert" className="text-sm font-medium">
              {error}
            </p>
            {limited && (
              // 다시 눌러도 같다. 언제 풀리는지만 알려 준다.
              <p className="text-xs opacity-80">내일 다시 분석할 수 있습니다.</p>
            )}
          </div>
        </div>
      )}

      <p className="flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-muted">
        <LockIcon width={14} height={14} className="mt-0.5 shrink-0" />
        <span>
          로그인 없이 분석할 수 있어요. 로그인하면 분석 이력이 남아요.
          <br />
          올린 PDF 원본은 분석에만 쓰고 보관하지 않아요.
        </span>
      </p>
    </form>
  );
}
