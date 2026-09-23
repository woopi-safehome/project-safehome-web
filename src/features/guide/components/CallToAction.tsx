import Link from "next/link";
import { ArrowRightIcon } from "@/shared/ui/icons";

/** 안내를 다 읽은 사람을 분석으로 돌려보낸다. 긴 페이지 끝에서 길을 잃지 않게. */
export function CallToAction() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center text-white sm:px-12">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/40 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
      <div className="relative flex flex-col items-center gap-5">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          계약서에 도장 찍기 전, 1분만 확인하세요
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-white/75">
          보증금은 한 번 잃으면 되찾기 어렵습니다. 등기부등본 한 장으로 위험 신호를 먼저 살펴보세요.
        </p>
        <Link
          href="/#analyze"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-navy transition-transform hover:-translate-y-0.5"
        >
          무료로 분석 시작하기
          <ArrowRightIcon width={18} height={18} />
        </Link>
      </div>
    </section>
  );
}
