import { Factor } from "@slashid/slashid";
import { Handle } from "../../domain/types";

export type FailureReason = "no_factors" | "resolve_error";

/**
 * `picking` is only reachable with two or more factors - a single factor is
 * submitted directly and none is a failure - so an empty picker cannot be
 * represented. `resolving_factors` has no transition to `attempting_sso`,
 * which is what stops a resumed step from attempting SSO a second time.
 */
export type Step =
  | { step: "idle" }
  | { step: "attempting_sso"; handle: Handle }
  | { step: "resolving_factors"; handle: Handle }
  | { step: "picking"; handle: Handle; factors: Factor[] }
  | { step: "failed"; handle: Handle; reason: FailureReason };

export type Action =
  | { type: "submit_handle"; handle: Handle; attemptSSO: boolean }
  | { type: "factors_resolved"; factors: Factor[] }
  | { type: "resolve_failed"; reason: FailureReason }
  | { type: "retry_resolution" }
  | { type: "reset"; resumedHandle?: Handle };

export function init(resumedHandle?: Handle): Step {
  return resumedHandle
    ? { step: "resolving_factors", handle: resumedHandle }
    : { step: "idle" };
}

export function shouldAttemptSSO(
  handle: Handle,
  attemptSSO: boolean | undefined
): boolean {
  return !!attemptSSO && handle.type === "email_address";
}

export function reducer(state: Step, action: Action): Step {
  switch (action.type) {
    case "submit_handle":
      return shouldAttemptSSO(action.handle, action.attemptSSO)
        ? { step: "attempting_sso", handle: action.handle }
        : { step: "resolving_factors", handle: action.handle };

    case "factors_resolved":
      if (state.step !== "resolving_factors") return state;
      return {
        step: "picking",
        handle: state.handle,
        factors: action.factors,
      };

    case "resolve_failed":
      if (state.step !== "resolving_factors") return state;
      return { step: "failed", handle: state.handle, reason: action.reason };

    case "retry_resolution":
      if (state.step !== "failed") return state;
      return { step: "resolving_factors", handle: state.handle };

    case "reset":
      return init(action.resumedHandle);
  }
}
