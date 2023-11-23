import { Stack } from "@slashid/react-primitives";
import { Loader } from "./flow.loader";
import { Text } from "../text";
import { useEffect } from "react";
import { useAppContext } from "../app/app.context";

function ensureError(value: unknown): Error {
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
        onError({ error: ensureError(e) });
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
