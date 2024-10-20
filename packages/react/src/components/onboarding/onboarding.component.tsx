import { createContext, useMemo, useState } from "react";
import { OnboardingAPI, OnboardingState } from "./onboarding.types";

const initialOnboardingState: OnboardingState = {
  currentStepId: "",
};

const initialOnboardingContext: OnboardingContextType = {
  state: initialOnboardingState,
  api: {
    nextStep: () => {},
    previousStep: () => {},
    registerStep: () => {},
  },
};

export type OnboardingContextType = {
  state: OnboardingState;
  api: OnboardingAPI;
};

export const OnboardingContext = createContext<OnboardingContextType>(
  initialOnboardingContext
);

export type OnboardingProps = {
  children: React.ReactNode;
};

export function Onboarding({ children }: OnboardingProps) {
  const [steps, setSteps] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // be smarter about the final step, either render nothing or a special step like Onboarding.Complete
  const contextValue = useMemo(() => {
    const state: OnboardingState = {
      currentStepId: steps.length > 0 ? steps[stepIndex] : "",
    };

    const api: OnboardingAPI = {
      // naive API
      nextStep: () => {
        setStepIndex((index) => index + 1);
      },
      // naive API
      previousStep: () => {
        setStepIndex((index) => index - 1);
      },
      registerStep: (stepId: string) => {
        setSteps((steps) => [...steps, stepId]);
      },
    };

    return {
      state,
      api,
    };
  }, [stepIndex, steps]);

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}
