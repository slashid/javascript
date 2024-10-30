import { useCallback, useEffect, useState } from "react";
import { ensureError } from "../../domain/errors";
import { JsonObject } from "@slashid/slashid";
import { useOnboarding } from "./onboarding-context.hook";

import * as styles from "./onboarding.css";
import { Card } from "@slashid/react-primitives";

export type OnboardingStepProps = {
  id: string;
  children: React.ReactNode;
  beforeNext: (formValues: JsonObject) => Promise<void>;
};

/**
 * Wrap any onboarding step with this component. It needs to have an ID.
 * The order the steps are rendered is the order they will be displayed.
 * Use OnboardingActions to render the controls that allow navigating the flow back and forth.
 * If you want to store attributes as part of onboarding, follow this example:
 * 
 * const { state, api } = useOnboarding();

  const handleSubmit = async (formValues: JsonObject) => {
    // store object as attributes
    return api.updateAttributes(formValues);
  };

  Then pass this function as the beforeNext prop to the OnboardingStep component.
 */
export function OnboardingStep({
  id,
  children,
  beforeNext,
}: OnboardingStepProps) {
  const { state, api } = useOnboarding();
  const [registered, setRegistered] = useState(false);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const formValues: JsonObject = {};
      formData.forEach((value, key) => {
        if (!(value instanceof File)) {
          formValues[key] = value;
        }
      });

      try {
        await beforeNext(formValues);
        api.nextStep();
      } catch (e) {
        console.log(ensureError(e));
      }
    },
    [api, beforeNext]
  );

  useEffect(() => {
    if (!registered) {
      api.registerStep(id);
      setRegistered(true);
    }
  }, [api, id, registered]);

  if (!registered || state.completionState === "complete") {
    return null;
  }

  if (state.currentStepId !== id) {
    return null;
  }

  return (
    <Card className="sid-onboarding">
      <form className={styles.stack} onSubmit={onSubmit}>
        {children}
      </form>
    </Card>
  );
}
