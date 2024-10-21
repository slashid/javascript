import { useOnboarding } from "./onboarding-context.hook";

export type OnboardingSuccessProps = {
  children: React.ReactNode;
};

export function OnboardingSuccess({ children }: OnboardingSuccessProps) {
  const { state } = useOnboarding();

  if (state.completionState !== "complete") {
    return null;
  }

  return children;
}
