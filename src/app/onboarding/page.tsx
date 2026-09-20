import { Onboarding } from "@/features/onboarding/components/Onboarding";

/**
 * 라우팅과 조립만 한다.
 */
export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-10">
      <Onboarding />
    </main>
  );
}
