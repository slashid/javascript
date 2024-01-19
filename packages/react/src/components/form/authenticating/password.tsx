import { FormEventHandler, useCallback, useEffect, useState } from "react";

import { useForm } from "../../../hooks/use-form";
import { useSlashID } from "../../../main";
import { Props } from "./authenticating.types";
import { ErrorMessage } from "../error-message";
import { Text } from "../../text";

import * as styles from "./authenticating.css";
import { Loader } from "./icons";
import { BackButton } from "./authenticating.components";
import { Input } from "../../../../../react-primitives/src/components/input";
import { Button } from "../../../../../react-primitives/src/components/button";
import { TextConfigKey } from "../../text/constants";
import { useConfiguration } from "../../../hooks/use-configuration";
import { sprinkles } from "../../../../../react-primitives/src/theme/sprinkles.css";
import { LinkButton } from "../../../../../react-primitives/src/components/button/link-button";

const PasswordRecoveryPrompt = () => {
  const { text } = useConfiguration();
  return (
    <div className={styles.passwordRecoveryPrompt}>
      <Text
        variant={{ size: "sm", color: "tertiary", weight: "semibold" }}
        t="authenticating.verifyPassword.recover.prompt"
      />
      <LinkButton
        className={sprinkles({ marginLeft: "1" })}
        type="button"
        testId="sid-form-authenticating-retry-button"
        onClick={() => {
          console.log("TODO enter the recovery flow");
        }}
      >
        {text["authenticating.verifyPassword.recover.cta"]}
      </LinkButton>
    </div>
  );
};

type FormState = "initial" | "setPassword" | "verifyPassword" | "submitting";

function getTextKeys(formState: FormState): {
  title: TextConfigKey;
  message: TextConfigKey;
} {
  const TEXT_KEYS: Record<
    FormState,
    Record<"title" | "message", TextConfigKey>
  > = {
    initial: {
      title: "authenticating.initial.password.title",
      message: "authenticating.initial.password.message",
    },
    setPassword: {
      title: "authenticating.setPassword.title",
      message: "authenticating.setPassword.message",
    },
    verifyPassword: {
      title: "authenticating.verifyPassword.title",
      message: "authenticating.verifyPassword.message",
    },
    submitting: {
      title: "authenticating.submitting.password.title",
      message: "authenticating.submitting.password.message",
    },
  };

  return TEXT_KEYS[formState];
}

/**
 * Renders a form that enables authentication via a password.
 * Handles retries in case of submitting an invalid/incorrect password.
 */
export const PasswordState = ({ flowState }: Props) => {
  const { sid } = useSlashID();
  const { text } = useConfiguration();
  const { values, registerField, registerSubmit } = useForm();
  const [formState, setFormState] = useState<FormState>("initial");

  // TODO handle needs to be verified in case of registration
  // render the correct message in that case (e.g. "Please verify your email address")

  const { title, message } = getTextKeys(formState);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      setFormState("submitting");
      sid?.publish("passwordSubmitted", values["password"]);
    },
    [sid, values]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const onChange = registerField("password", {});

      onChange(event);
    },
    [registerField]
  );

  const handleConfirmPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const onChange = registerField("passwordConfirm", {});

      onChange(event);
    },
    [registerField]
  );

  useEffect(() => {
    const onSetPassword = () => setFormState("setPassword");
    const onVerifyPassword = () => setFormState("verifyPassword");

    if (formState === "initial") {
      sid?.subscribe("passwordSetReady", onSetPassword);
      sid?.subscribe("passwordVerifyReady", onVerifyPassword);
    }

    return () => {
      sid?.unsubscribe("passwordSetReady", onSetPassword);
      sid?.unsubscribe("passwordVerifyReady", onVerifyPassword);
    };
  }, [formState, sid]);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      {formState === "initial" && <Loader />}
      {(formState === "setPassword" || formState === "verifyPassword") && (
        <form onSubmit={registerSubmit(handleSubmit)}>
          <div className={styles.formInputs}>
            <Input
              id="password-input"
              label={text["authenticating.password.label"]}
              placeholder={text["authenticating.password.placeholder"]}
              name="password"
              type="password"
              value={values["password"] ?? ""}
              onChange={handleChange}
            />
            {formState === "verifyPassword" && <PasswordRecoveryPrompt />}
            {formState === "setPassword" && (
              <Input
                id="password-input-confirm"
                label={text["authenticating.passwordConfirm.label"]}
                placeholder={text["authenticating.password.placeholder"]}
                name="passwordConfirm"
                type="password"
                value={values["passwordConfirm"] ?? ""}
                onChange={handleConfirmPasswordChange}
                className={sprinkles({ marginTop: "4" })}
              />
            )}
            {/* TODO figure out how to display errors based on useForm */}
            <ErrorMessage name="password" />
          </div>

          <Button
            type="submit"
            variant="primary"
            testId="sid-form-initial-submit-button"
            // TODO - only when the two passwords are not the same
            disabled={
              formState === "setPassword" &&
              values["password"] !== values["passwordConfirm"]
            }
          >
            {text["authenticating.password.submit"]}
          </Button>
        </form>
      )}
      {formState === "submitting" ? <Loader /> : null}
    </>
  );
};
