import { createContext, useEffect, useMemo, useState } from "react";
import { OnboardingAPI, OnboardingState } from "./onboarding.types";
import { AnonymousUser, Errors, JsonObject } from "@slashid/slashid";
import { useSlashID } from "../../main";
import { ensureError } from "../../domain/errors";
import { Loading } from "@slashid/react-primitives";

const initialOnboardingState: OnboardingState = {
  currentStepId: "",
  attributes: {},
  stepIndex: 0,
  completionState: "incomplete",
};

const initialOnboardingContext: OnboardingContextType = {
  state: initialOnboardingState,
  api: {
    nextStep: () => {},
    previousStep: () => {},
    registerStep: () => {},
    updateAttributes: async () => {},
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
  onError?: () => void;
};

type Result<T> =
  | { error: undefined; value: T }
  | { error: Error; value: undefined };

type UiState = "initial" | "loadingAttributes" | "ready" | "error";

async function fetchAttributes(
  user: AnonymousUser
): Promise<Result<JsonObject>> {
  // TODO use an onboarding bucket to namespace the values
  try {
    const attributes = await user.getBucket().get();
    return { error: undefined, value: attributes };
  } catch (e) {
    const error = Errors.createSlashIDError({
      message: "Failed fetching user attributes during onboarding",
      name: "APIResponseError",
      cause: ensureError(e),
    });
    return { error, value: undefined };
  }
}

async function updateAttributes({
  user,
  newAttributes,
  oldAttributes,
}: {
  user: AnonymousUser;
  newAttributes: JsonObject;
  oldAttributes: JsonObject;
}): Promise<Result<JsonObject>> {
  // TODO use an onboarding bucket to namespace the values
  try {
    const attributes = { ...oldAttributes, ...newAttributes };
    await user.getBucket().set(attributes);
    return { error: undefined, value: attributes };
  } catch (e) {
    const error = Errors.createSlashIDError({
      message: "Failed updating user attributes during onboarding",
      name: "APIResponseError",
      cause: ensureError(e),
    });
    return { error, value: undefined };
  }
}

function getSetItemByIndex<T>(set: Set<T>, index: number): T | undefined {
  if (index < 0 || index >= set.size) {
    return undefined;
  }
  return Array.from(set)[index];
}

/**
 * Renders the onboarding flow based on the children provided.
 * Wrap any step you want to render in the <OnboardgingStep> component.
 * They will be rendered in the order they are provided.
 */
export function Onboarding({ children, onError }: OnboardingProps) {
  const { anonymousUser } = useSlashID();
  const [steps, setSteps] = useState<Set<string>>(new Set());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [attributes, setAttributes] = useState<JsonObject>({});
  const [uiState, setUiState] = useState<UiState>("initial");
  const [completionState, setCompletionState] = useState<
    "incomplete" | "complete"
  >("incomplete");

  useEffect(() => {
    async function loadAttributes(user: AnonymousUser) {
      const result = await fetchAttributes(user);

      if (result.error) {
        setUiState("error");
        return;
      }

      setAttributes(result.value);
      setUiState("ready");
    }

    if (uiState === "initial" && anonymousUser) {
      setUiState("loadingAttributes");
      loadAttributes(anonymousUser);
    }
  }, [anonymousUser, uiState]);

  useEffect(() => {
    if (uiState === "error" && typeof onError === "function") {
      onError();
    }
  }, [onError, uiState]);

  const contextValue = useMemo(() => {
    const state: OnboardingState = {
      currentStepId:
        steps.size > 0 ? getSetItemByIndex(steps, stepIndex) || "" : "",
      attributes,
      completionState,
      stepIndex,
    };

    const api: OnboardingAPI = {
      nextStep: () => {
        if (stepIndex + 1 >= steps.size) {
          setCompletionState("complete");
        } else {
          setStepIndex((index) => index + 1);
        }
      },
      previousStep: () => {
        setStepIndex((index) => index - 1);
      },
      registerStep: (stepId: string) => {
        setSteps((steps) => new Set(steps).add(stepId));
      },
      updateAttributes: async (newAttributes: JsonObject) => {
        if (!anonymousUser) {
          return;
        }

        const result = await updateAttributes({
          user: anonymousUser,
          newAttributes,
          oldAttributes: attributes,
        });

        if (result.error) {
          setUiState("error");
          return;
        }

        setAttributes(result.value);
      },
    };

    return {
      state,
      api,
    };
  }, [anonymousUser, attributes, completionState, stepIndex, steps]);

  return (
    <OnboardingContext.Provider value={contextValue}>
      {uiState === "loadingAttributes" && (
        <div className="sid-onboarding--loading">
          <Loading />
        </div>
      )}
      {uiState === "ready" && children}
    </OnboardingContext.Provider>
  );
}
