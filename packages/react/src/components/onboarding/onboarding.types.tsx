import { JsonObject } from "@slashid/slashid";

export type OnboardingState = {
  currentStepId: string;
  attributes: JsonObject;
};

export type OnboardingAPI = {
  nextStep: () => void;
  previousStep: () => void;
  registerStep: (stepId: string) => void;
  updateAttributes: (newAttributes: JsonObject) => Promise<void>;
};
