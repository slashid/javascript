import { Stack } from "@slashid/react-primitives";
import * as Sentry from "@sentry/react";
import { Loader } from "./flow.loader";
import { Text } from "../text";
import { useEffect } from "react";
import { useAppContext } from "../app/app.context";

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

function ensureError(value: unknown): Error {
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

export type Props = {
  onSuccess: () => void;
  onError: ({ error }: { error: Error }) => void;
};

export function Progress({ onSuccess, onError }: Props) {
  const { sdk } = useAppContext();
  useEffect(() => {
    if (!sdk) return;

    async function authenticate() {
      try {
        await sdk?.getUserFromURL();
        onSuccess();
      } catch (e: unknown) {
        const safeError = ensureError(e);
        Sentry.captureException(safeError);
        onError({ error: safeError });
      }
    }

    authenticate();
  }, [onError, onSuccess, sdk]);

  return (
    <>
      <Stack space="0.25">
        <Text
          as="h1"
          variant={{ size: "2xl-title", weight: "bold" }}
          t="initial.title"
        />
        <Text
          variant={{ color: "contrast", weight: "semibold" }}
          as="h2"
          t="initial.details"
        />
      </Stack>
      <Loader />
    </>
  );
}
