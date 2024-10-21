import { useContext } from "react";
import { OnboardingContext } from "./onboarding.component";

export function useOnboarding() {
  const { state, api } = useContext(OnboardingContext);
  return { state, api };
}
