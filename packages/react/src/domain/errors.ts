import { SlashIDError } from "@slashid/slashid";

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
  nonReachableHandleType: "NonReachableHandleType",
};

type NonReachableHandleTypeError = SlashIDError & {
  name: "NonReachableHandleType";
};

export function isNonReachableHandleTypeError(
  error: Error
): error is NonReachableHandleTypeError {
  return (
    error instanceof SlashIDError &&
    error.name === ERROR_NAMES.nonReachableHandleType
  );
}
