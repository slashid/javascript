import type { InvalidPasswordSubmittedEvent } from "@slashid/slashid";
import { useEffect, useState } from "react";
import {
  Input,
  Stack,
  Text,
  Button,
  sprinkles,
} from "@slashid/react-primitives";

import * as styles from "./flow.css";
import { useI18n } from "../text/use-i18n";
import { useAppContext } from "../app/app.context";
import type { TranslationKeys } from "../../domain/i18n";

function getValidationI18nKey(
  errorEvent: InvalidPasswordSubmittedEvent
): TranslationKeys {
  const textKey = `authenticating.setPassword.validation.${errorEvent.failedRules[0].name}`;

  // prefer the first error
  return textKey as TranslationKeys;
}

function ErrorMessage({ message }: { message: string }) {
  return <span className={styles.errorMessage}>{message}</span>;
}

export function Recover() {
  const i18n = useI18n();
  const { sdk } = useAppContext();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onInvalidPassword = (
      invalidPasswordEvent: InvalidPasswordSubmittedEvent
    ) => {
      console.log("onInvalidPassword", invalidPasswordEvent);
      setError(i18n(getValidationI18nKey(invalidPasswordEvent)));
    };

    sdk?.subscribe("invalidPasswordSubmitted", onInvalidPassword);

    return () => {
      sdk?.unsubscribe("invalidPasswordSubmitted", onInvalidPassword);
    };
  }, [i18n, sdk, setError]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sdk) {
      return;
    }

    sdk.publish("passwordSubmitted", password);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(event.target.value);
  };

  return (
    <>
      <Stack space="0.25">
        <Text
          as="h1"
          variant={{ size: "2xl-title", weight: "bold" }}
          t="recover.password.title"
        />
        <Text
          variant={{ color: "contrast", weight: "semibold" }}
          as="h2"
          t="recover.password.details"
        />
      </Stack>
      <form onSubmit={handleSubmit}>
        <div className={styles.formInputs}>
          {/* TODO add an error state to the input (change border color) */}
          <Input
            id="password-input"
            label={i18n("recover.password.input.password.label")}
            placeholder={i18n("recover.password.input.placeholder")}
            name="password"
            type="password"
            value={password ?? ""}
            onChange={handlePasswordChange}
          />
          <Input
            id="password-input-confirm"
            label={i18n("recover.password.input.confirmPassword.label")}
            placeholder={i18n("recover.password.input.placeholder")}
            name="passwordConfirm"
            type="password"
            value={passwordConfirm ?? ""}
            onChange={handleConfirmPasswordChange}
            className={sprinkles({ marginTop: "4" })}
          />
          {error && <ErrorMessage message={error} />}
        </div>

        <Button
          type="submit"
          variant="primary"
          testId="sid-form-initial-submit-button"
          disabled={!password || password !== passwordConfirm}
        >
          {i18n("recover.password.submit")}
        </Button>
      </form>
    </>
  );
}
