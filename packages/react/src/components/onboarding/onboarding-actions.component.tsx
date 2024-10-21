import { useContext } from "react";
import { OnboardingContext } from "./onboarding.component";

// TODO you still need to be able to navigate back from the login form step - maybe a specific Onboarding.Form step that does this for us?
export function OnboardingActions() {
  const { api } = useContext(OnboardingContext);

  return (
    <div>
      <button onClick={() => api.previousStep()}>Previous</button>
      <button type="submit">Next</button>
    </div>
  );
}
