import { useContext } from "react";
import { OnboardingContext } from "./onboarding.component";
import { Button } from "@slashid/react-primitives";

import * as styles from "./onboarding.css";

// TODO you still need to be able to navigate back from the login form step - maybe a specific Onboarding.Form step that does this for us?
export function OnboardingActions() {
  const { api, state } = useContext(OnboardingContext);

  const isFirst = state.stepIndex === 0;

  return (
    <div className={styles.stack}>
      <Button type="submit">Continue</Button>
      {isFirst ? null : (
        <Button variant="secondary" onClick={() => api.previousStep()}>
          Previous
        </Button>
      )}
    </div>
  );
}
