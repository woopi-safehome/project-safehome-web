import Link from "next/link";
import { DeedUploadForm } from "@/features/analysis/components/DeedUploadForm";

/**
 * 라우팅과 조립만 한다. 화면의 로직은 features 가 갖는다.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">등기부등본 안전 분석</h1>
        <p className="max-w-sm text-sm text-black/60 dark:text-white/60">
          등기부등본을 올리면 보증금 관점의 위험 요소를 정리해 드립니다.
        </p>
      </header>

      <DeedUploadForm />

      <Link href="/history" className="text-xs underline underline-offset-4">
        지난 분석 이력 보기
      </Link>
    </main>
  );
}
