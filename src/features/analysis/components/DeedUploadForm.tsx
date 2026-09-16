"use client";

import { useState } from "react";
import type { LeaseType } from "@/shared/api/contract";

/**
 * 업로드 입력만 담당한다. 서버 호출은 이 기능의 api 계층이 맡고,
 * 분석 결과의 해석은 서버가 한다 — 화면에서 위험도를 다시 계산하지 않는다.
 */
export function DeedUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [leaseType, setLeaseType] = useState<LeaseType | null>(null);

  const ready = file !== null;

  return (
    <form
      className="flex w-full max-w-md flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        // 서버 연결은 api 의 비로그인 경로가 열린 뒤에 붙인다.
      }}
    >
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-black/20 px-6 py-10 text-center transition-colors hover:border-black/40 dark:border-white/20 dark:hover:border-white/40">
        <span className="text-sm font-medium">
          {file ? file.name : "등기부등본 PDF 를 선택하세요"}
        </span>
        <span className="text-xs text-black/50 dark:text-white/50">
          {file ? `${(file.size / 1024).toFixed(0)} KB` : "클릭해서 파일 고르기"}
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
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
        분석 시작
      </button>

      <p className="text-center text-xs text-black/50 dark:text-white/50">
        로그인 없이 분석할 수 있습니다. 로그인하면 분석 이력이 남습니다.
      </p>
    </form>
  );
}
