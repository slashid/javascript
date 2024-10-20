export type OnboardingState = {
  currentStepId: string;
};

export type OnboardingAPI = {
  nextStep: () => void;
  previousStep: () => void;
  registerStep: (stepId: string) => void;
};
