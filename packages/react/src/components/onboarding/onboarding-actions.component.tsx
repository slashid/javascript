import { useContext } from "react";
import { OnboardingContext } from "./onboarding.component";

export function OnboardingActions() {
  const { api } = useContext(OnboardingContext);
  return (
    <div>
      <button onClick={() => api.previousStep()}>Previous</button>
      <button onClick={() => api.nextStep()}>Next</button>
    </div>
  );
}
