import { LoginPanel } from "@/features/auth/components/LoginPanel";

/**
 * 라우팅과 조립만 한다.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <h1 className="text-2xl font-semibold sm:text-3xl">등기부등본 안전 분석</h1>
      <LoginPanel />
    </main>
  );
}
