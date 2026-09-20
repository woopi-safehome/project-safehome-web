"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ERROR_CODE, type LeaseType } from "@/shared/api/contract";
import { ApiError } from "@/shared/api/client";
import { uploadDeed } from "../api";

/**
 * 업로드 입력만 담당한다. 서버 호출은 이 기능의 api 계층이 맡고,
 * 분석 결과의 해석은 서버가 한다 — 화면에서 위험도를 다시 계산하지 않는다.
 */
export function DeedUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [leaseType, setLeaseType] = useState<LeaseType | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limited, setLimited] = useState(false);
  const router = useRouter();

  const ready = file !== null && !uploading;

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
      className="flex w-full max-w-md flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      {/* 입력에 초점이 가면 이 테두리로 보여 준다. 입력 자체는 보이지 않기 때문이다. */}
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-black/20 px-6 py-10 text-center transition-colors hover:border-black/40 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 dark:border-white/20 dark:hover:border-white/40">
        <span className="text-sm font-medium">
          {file ? file.name : "등기부등본 PDF 를 선택하세요"}
        </span>
        <span className="text-xs text-black/50 dark:text-white/50">
          {file ? `${(file.size / 1024).toFixed(0)} KB` : "클릭해서 파일 고르기"}
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
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <fieldset className="flex gap-2">
        <legend className="mb-2 text-xs text-black/50 dark:text-white/50">
          임대차 유형 (선택)
        </legend>
        {(["전세", "월세"] as const).map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={leaseType === type}
            onClick={() => setLeaseType(leaseType === type ? null : type)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              leaseType === type
                ? "border-transparent bg-foreground text-background"
                : "border-black/15 hover:border-black/40 dark:border-white/20 dark:hover:border-white/40"
            }`}
          >
            {type}
          </button>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={!ready}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity disabled:opacity-40"
      >
        {uploading ? "업로드 중…" : "분석 시작"}
      </button>

      {error !== null && (
        <p role="alert" className="text-center text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {limited && (
        // 다시 눌러도 같다. 언제 풀리는지만 알려 준다.
        <p className="text-center text-xs text-black/50 dark:text-white/50">
          내일 다시 분석할 수 있습니다.
        </p>
      )}

      <p className="text-center text-xs text-black/50 dark:text-white/50">
        로그인 없이 분석할 수 있습니다. 로그인하면 분석 이력이 남습니다.
      </p>
    </form>
  );
}
