import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { Stack } from "@slashid/react-primitives";

import { Loader } from "./flow.loader";
import type { FlowType } from "./flow.types";
import { Text } from "../text";
import { useAppContext } from "../app/app.context";
import { Recover } from "./flow.recover";
import { ensureError } from "../../domain/errors";

export type Props = {
  flowType: FlowType;
  onSuccess: () => void;
  onError: ({ error }: { error: Error }) => void;
};

export function Progress({ onSuccess, onError, flowType }: Props) {
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
  }, [flowType, onError, onSuccess, sdk]);

  if (flowType === "password-recovery") {
    return <Recover />;
  }

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
