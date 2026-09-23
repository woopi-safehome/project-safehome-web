import Link from "next/link";
import { SearchIcon } from "@/shared/ui/icons";
import { buttonPrimary } from "@/shared/ui/styles";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <SearchIcon width={28} height={28} />
      </span>
      <p className="text-base font-semibold">찾을 수 없는 주소입니다.</p>
      <Link href="/" className={buttonPrimary}>
        첫 화면으로
      </Link>
    </main>
  );
}
