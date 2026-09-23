import { Onboarding } from "@/features/onboarding/components/Onboarding";

/**
 * 라우팅과 조립만 한다.
 */
export default function OnboardingPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-gradient-to-b from-brand-soft/60 to-canvas px-4 py-10">
      <Onboarding />
    </main>
  );
}
