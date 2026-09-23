import { LoginPanel } from "@/features/auth/components/LoginPanel";

/**
 * 라우팅과 조립만 한다.
 */
export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-brand-soft/60 to-canvas px-4 py-16">
      <h1 className="sr-only">로그인</h1>
      <LoginPanel />
    </main>
  );
}
