import { Errors } from "@slashid/slashid";

/**
 * Ensure that a valid Error instance is returned, since in JS you can throw anything.
 */
export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {
    // ignore
  }

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`
  );
  return error;
}

export const ERROR_NAMES = {
  recoverNonReachableHandleType: "recoverNonReachableHandleType",
} as const;

type NonReachableHandleTypeError = Error &
  typeof Errors.SlashIDError & {
    name: typeof ERROR_NAMES.recoverNonReachableHandleType;
  };

export function isNonReachableHandleTypeError(
  error: Error
): error is NonReachableHandleTypeError {
  return (
    Errors.isSlashIDError(error) &&
    error.name === ERROR_NAMES.recoverNonReachableHandleType
  );
}

type NoPasswordSetError = Error &
  typeof Errors.SlashIDError & {
    name: typeof Errors.ERROR_NAMES.noPasswordSet;
  };

export function isNoPasswordSetError(
  error: Error
): error is NoPasswordSetError {
  return (
    Errors.isSlashIDError(error) &&
    error.name === Errors.ERROR_NAMES.noPasswordSet
  );
}

type FlowCancelledError = Error &
  typeof Errors.SlashIDError & {
    // TODO this should probably be exported from the SDK - we should establish a naming convention.
    name: "FlowCancelledError";
  };

export function isFlowCancelledError(
  error: Error
): error is FlowCancelledError {
  return Errors.isSlashIDError(error) && error.name == "FlowCancelledError";
}
