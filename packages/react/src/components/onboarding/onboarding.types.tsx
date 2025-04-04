import { JsonObject } from "@slashid/slashid";

export type OnboardingState = {
  currentStepId: string;
  stepIndex: number;
  attributes: JsonObject;
  completionState: "incomplete" | "complete";
};

export type OnboardingAPI = {
  nextStep: () => void;
  previousStep: () => void;
  registerStep: (stepId: string) => void;
  updateAttributes: (newAttributes: JsonObject) => Promise<void>;
};
