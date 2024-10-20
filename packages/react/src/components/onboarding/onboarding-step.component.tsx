// are onboarding steps self registering?
// it would be easier to pass a config which specifies the order exactly
// we could also infer the order from the children, have the wrapper self register
// keeps track of being registered or not

import { useContext, useEffect, useState } from "react";
import { OnboardingContext } from "./onboarding.component";

export type OnboardingStepProps = {
  id: string;
  children: React.ReactNode;
};

export function OnboardingStep({ id, children }: OnboardingStepProps) {
  const { state, api } = useContext(OnboardingContext);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered) {
      api.registerStep(id);
      setRegistered(true);
    }
  }, [api, id, registered]);

  if (!registered) {
    return null;
  }

  if (state.currentStepId !== id) {
    return null;
  }

  return children;
}
