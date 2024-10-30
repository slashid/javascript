import { Button } from "@slashid/react-primitives";

import { useConfiguration } from "../../hooks/use-configuration";
import * as styles from "./onboarding.css";
import { useOnboarding } from "./onboarding-context.hook";

/**
 * Renders the onboading flow controls.
 */
export function OnboardingActions() {
  const { api, state } = useOnboarding();
  const { text } = useConfiguration();

  const isFirst = state.stepIndex === 0;

  return (
    <div className={styles.stack}>
      <Button type="submit">{text["onboarding.actions.continue"]}</Button>
      {isFirst ? null : (
        <Button variant="secondary" onClick={() => api.previousStep()}>
          {text["onboarding.actions.previous"]}
        </Button>
      )}
    </div>
  );
}
