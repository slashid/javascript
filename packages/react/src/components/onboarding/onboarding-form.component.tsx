import { useEffect, useState } from "react";
import { useSlashID } from "../../main";
import { Form } from "../form";
import { useOnboarding } from "./onboarding-context.hook";

export function OnboardingForm() {
  const id = "onboarding-login-form";
  // wrapper for the login/signup form
  const { state, api } = useOnboarding();
  const { isLoading, isAuthenticated } = useSlashID();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered) {
      api.registerStep(id);
      setRegistered(true);
    }
  }, [api, registered]);

  if (!registered || state.completionState === "complete") {
    return null;
  }

  if (state.currentStepId !== id) {
    return null;
  }

  // skip this step if the user is already logged in
  if (isLoading || isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    // we can keep using the anonymous user as it is the same one that is used for onboarding
    api.nextStep();
  };

  return <Form onSuccess={handleLogin} />;
}
