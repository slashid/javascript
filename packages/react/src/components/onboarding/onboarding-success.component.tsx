import { Card } from "@slashid/react-primitives";
import { useOnboarding } from "./onboarding-context.hook";

export type OnboardingSuccessProps = {
  children: React.ReactNode;
};

export function OnboardingSuccess({ children }: OnboardingSuccessProps) {
  const { state } = useOnboarding();

  if (state.completionState !== "complete") {
    return null;
  }

  return (
    <Card className="sid-onboarding sid-onboarding--success">{children}</Card>
  );
}
