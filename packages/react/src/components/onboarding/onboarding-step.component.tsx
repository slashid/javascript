// are onboarding steps self registering?
// it would be easier to pass a config which specifies the order exactly
// we could also infer the order from the children, have the wrapper self register
// keeps track of being registered or not

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
