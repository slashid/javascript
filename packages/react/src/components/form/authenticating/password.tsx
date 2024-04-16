import { FormEventHandler, useCallback, useEffect } from "react";

import { useForm } from "../../../hooks/use-form";
import { useSlashID } from "../../../main";
import { Props } from "./authenticating.types";
import { ErrorMessage } from "../error-message";
import { Text } from "../../text";

import * as styles from "./authenticating.css";
import { EmailIcon, Loader, SmsIcon } from "./icons";
import { BackButton } from "./authenticating.components";
import {
  Button,
  LinkButton,
  sprinkles,
  PasswordInput,
  interpolate,
} from "@slashid/react-primitives";
import { TextConfigKey } from "../../text/constants";
import { useConfiguration } from "../../../hooks/use-configuration";
import { AuthenticatingState } from "../flow";
import { HandleType } from "../../../domain/types";
import { InvalidPasswordSubmittedEvent } from "@slashid/slashid";
import {
  getValidationMessageKey,
  getValidationInterpolationTokens,
} from "./validation";
import {
  PasswordStatus,
  isInputState,
  isVerifyPasswordState,
} from "../ui-state-machine";

const PasswordRecoveryPrompt = ({
  onRecoverClick,
}: {
  onRecoverClick: () => void;
}) => {
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
        onClick={onRecoverClick}
      >
        {text["authenticating.verifyPassword.recover.cta"]}
      </LinkButton>
    </div>
  );
};

const ProgressIndicator = ({
  flowState,
  handleType,
}: {
  flowState: AuthenticatingState;
  handleType?: HandleType;
}) => {
  if (flowState.hasUIState("submitting")) {
    return <Loader />;
  }

  if (flowState.hasUIState("recoverPassword")) {
    if (handleType === "email_address") {
      return <EmailIcon />;
    }

    if (handleType === "phone_number") {
      return <SmsIcon />;
    }
  }

  return null;
};

function getTextKeys(flowState: AuthenticatingState): {
  title: TextConfigKey;
  message: TextConfigKey;
} {
  const TEXT_KEYS: Record<
    PasswordStatus,
    Record<"title" | "message", TextConfigKey>
  > = {
    initial: {
      title: "authenticating.initial.password.title",
      message:
        flowState.context.config.handle?.type === "email_address"
          ? "authenticating.initial.password.message.email"
          : "authenticating.initial.password.message.phone",
    },
    setPassword: {
      title: "authenticating.setPassword.title",
      message: "authenticating.setPassword.message",
    },
    verifyPassword: {
      title: "authenticating.verifyPassword.title",
      message: "authenticating.verifyPassword.message",
    },
    recoverPassword:
      flowState.context.config.handle?.type === "email_address"
        ? {
            title: "authenticating.recoverPassword.title.email",
            message: "authenticating.recoverPassword.message.email",
          }
        : {
            title: "authenticating.recoverPassword.title.phone",
            message: "authenticating.recoverPassword.message.phone",
          },
    submitting: {
      title: "authenticating.submitting.password.title",
      message: "authenticating.submitting.password.message",
    },
  };

  return TEXT_KEYS[flowState.getChildState().status as PasswordStatus];
}

/**
 * Renders a form that enables authentication via a password.
 * Handles retries in case of submitting an invalid/incorrect password.
 */
export const PasswordState = ({ flowState }: Props) => {
  const { sid } = useSlashID();
  const { text } = useConfiguration();
  const {
    values,
    registerField,
    setError,
    hasError,
    clearError,
    registerSubmit,
  } = useForm();

  const { title, message } = getTextKeys(flowState);
  const interpolationTokens = flowState.hasUIState("recoverPassword")
    ? {
        ...(flowState.context.config.handle?.type === "email_address" && {
          EMAIL_ADDRESS: flowState.context.config.handle.value,
        }),
        ...(flowState.context.config.handle?.type === "phone_number" && {
          PHONE_NUMBER: flowState.context.config.handle.value,
        }),
      }
    : undefined;

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (!values["password"]) {
        setError("password", {
          message: text["authenticating.setPassword.validation.required"],
        });
        return;
      }

      if (
        flowState.hasUIState("setPassword") &&
        values["password"] !== values["passwordConfirm"]
      ) {
        setError("password", {
          message: text["authenticating.setPassword.validation.mismatch"],
        });
        return;
      }

      const uiState = flowState.getChildState();
      if (isInputState(uiState)) {
        uiState.submit(values["password"]);
      }
    },
    [flowState, setError, text, values]
  );

  const handlePasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const onChange = registerField("password", {});

      onChange(event);
      clearError("password");
    },
    [clearError, registerField]
  );

  const handleConfirmPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const onChange = registerField("passwordConfirm", {});

      onChange(event);
      clearError("password");
    },
    [clearError, registerField]
  );

  const handleRecovery = useCallback(async () => {
    const uiState = flowState.getChildState();
    if (!isVerifyPasswordState(uiState)) return;

    uiState.recoverPassword();
  }, [flowState]);

  useEffect(() => {
    const onIncorrectPassword = () =>
      setError("password", {
        message: text["authenticating.setPassword.validation.incorrect"],
      });
    const onInvalidPassword = (
      invalidPasswordEvent: InvalidPasswordSubmittedEvent
    ) =>
      setError("password", {
        message: interpolate(
          text[getValidationMessageKey(invalidPasswordEvent)],
          getValidationInterpolationTokens({
            errorEvent: invalidPasswordEvent,
            password: values["password"],
          })
        ),
      });

    sid?.subscribe("incorrectPasswordSubmitted", onIncorrectPassword);
    sid?.subscribe("invalidPasswordSubmitted", onInvalidPassword);

    return () => {
      sid?.unsubscribe("incorrectPasswordSubmitted", onIncorrectPassword);
      sid?.unsubscribe("invalidPasswordSubmitted", onInvalidPassword);
    };
  }, [setError, sid, text, values]);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text
        t={message}
        variant={{ color: "contrast", weight: "semibold" }}
        tokens={interpolationTokens}
      />
      {flowState.hasUIState("initial") && <Loader />}
      {(flowState.hasUIState("setPassword") ||
        flowState.hasUIState("verifyPassword")) && (
        <form onSubmit={registerSubmit(handleSubmit)}>
          {/* TODO support password managers by rendering a read only field */}
          <input
            type="hidden"
            name="username"
            value={flowState.context.config.handle?.value}
            autoComplete="username"
          />
          <div className={styles.formInputs}>
            <PasswordInput
              id="password-input"
              label={text["authenticating.password.label"]}
              placeholder={text["authenticating.password.placeholder"]}
              name="password"
              value={values["password"] ?? ""}
              onChange={handlePasswordChange}
              error={hasError("password")}
              autoComplete={
                flowState.hasUIState("setPassword")
                  ? "new-password"
                  : "current-password"
              }
            />
            {flowState.hasUIState("setPassword") && (
              <PasswordInput
                id="password-input-confirm"
                label={text["authenticating.passwordConfirm.label"]}
                placeholder={text["authenticating.password.placeholder"]}
                name="passwordConfirm"
                value={values["passwordConfirm"] ?? ""}
                onChange={handleConfirmPasswordChange}
                error={hasError("password")}
                className={sprinkles({ marginTop: "4" })}
              />
            )}
            <ErrorMessage name="password" />
            {flowState.hasUIState("verifyPassword") && (
              <PasswordRecoveryPrompt onRecoverClick={handleRecovery} />
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            testId="sid-form-initial-submit-button"
          >
            {text["authenticating.password.submit"]}
          </Button>
        </form>
      )}
      <ProgressIndicator
        flowState={flowState}
        handleType={flowState.context.config.handle?.type}
      />
    </>
  );
};
