type SlashIDErrorMessage = { message: string };

class SlashIDError extends Error {
  errors: SlashIDErrorMessage[];

  constructor(errors: SlashIDErrorMessage[]) {
    super(errors.length > 0 ? errors[0].message : "Unknown SlashID error");
    this.errors = errors;
  }
}

function isSlashIDError(e: unknown): e is SlashIDError {
  if (
    typeof e === "object" &&
    e !== null &&
    "errors" in e &&
    Array.isArray(e.errors)
  ) {
    return true;
  }

  return false;
}

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  // special case - sometimes the core SDK throws a non-error object
  if (isSlashIDError(value)) {
    const error = new SlashIDError(value.errors);
    return error;
  }

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
