import Link from "next/link";
import { ArrowRightIcon } from "@/shared/ui/icons";

/**
 * 안내를 다 읽은 사람을 분석으로 돌려보낸다. 긴 페이지 끝에서 길을 잃지 않게.
 * 짙은 남색 판은 광고처럼 무겁게 보여서, 옅은 브랜드 바탕에 차분하게 둔다.
 */
export function CallToAction() {
  return (
    <section className="flex flex-col items-start gap-5 rounded-[2rem] bg-brand-soft px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">계약서에 도장 찍기 전, 1분만 확인해 보세요</h2>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          보증금은 한 번 잃으면 되찾기가 정말 어려워요. 등기부등본 한 장으로 미리 살펴보세요.
        </p>
      </div>
      <Link
        href="/#analyze"
        className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink shadow-sm shadow-brand/20 transition hover:bg-brand-strong"
      >
        무료로 확인해 보기
        <ArrowRightIcon width={18} height={18} />
      </Link>
    </section>
  );
}
