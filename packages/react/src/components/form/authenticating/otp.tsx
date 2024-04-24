import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Factor } from "@slashid/slashid";
import { OtpInput, Delayed } from "@slashid/react-primitives";

import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { Props } from "./authenticating.types";
import { getAuthenticatingMessage } from "./messages";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";
import { ErrorMessage } from "../error-message";
import { Text } from "../../text";

import * as styles from "./authenticating.css";
import { isFactorOTPEmail, isFactorOTPSms } from "../../../domain/handles";
import { EmailIcon, SmsIcon, Loader } from "./icons";
import { BackButton, Prompt } from "./authenticating.components";
import { isInputState } from "../state/ui-state-machine.types";

const FactorIcon = ({ factor }: { factor: Factor }) => {
  if (isFactorOTPEmail(factor)) {
    return <EmailIcon />;
  }

  if (isFactorOTPSms(factor)) {
    return <SmsIcon />;
  }

  return <Loader />;
};

const BASE_RETRY_DELAY = 2000;

/**
 * Presents the user with a form to enter an OTP code.
 * Handles retries in case of submitting an incorrect OTP code.
 */
export const OTPState = ({ flowState }: Props) => {
  const { text } = useConfiguration();
  const { values, registerField, registerSubmit, setError, clearError } =
    useForm();
  const submitInputRef = useRef<HTMLInputElement>(null);

  const factor = flowState.context.config.factor;
  const hasRetried = flowState.context.attempt > 1;
  const { title, message } = getAuthenticatingMessage(factor, {
    isSubmitting: flowState.matches("submitting"),
    hasRetried,
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const uiState = flowState.getChildState();
      if (!isInputState(uiState)) return;
      uiState.submit(values["otp"]);
      setHasSubmitted(true);
    },
    [values, flowState]
  );

  useEffect(() => {
    const uiState = flowState.getChildState();

    if (isInputState(uiState) && uiState.error && hasSubmitted) {
      setHasSubmitted(false);
      setError("otp", {
        message: text["authenticating.otpInput.submit.error"],
      });
      values["otp"] = "";
    }
  }, [flowState, setError, values, text, hasSubmitted]);

  const handleChange = useCallback(
    (otp: string) => {
      const onChange = registerField("otp", {
        validator: (value) => {
          if (!isValidOTPCode(value)) {
            return { message: text["validationError.otp"] };
          }
        },
      });
      const event = {
        target: {
          value: otp,
        },
      };

      clearError("otp");
      onChange(event as never);
    },
    [clearError, registerField, text]
  );

  const handleRetry = () => {
    flowState.retry();
    clearError("otp");
  };

  useEffect(() => {
    if (isValidOTPCode(values["otp"])) {
      // Automatically submit the form when the OTP code is valid
      submitInputRef.current?.click();
    }
  }, [values]);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      {flowState.matches("initial") && <FactorIcon factor={factor} />}
      {flowState.matches("input") && (
        <form
          onSubmit={registerSubmit(handleSubmit)}
          className={styles.otpForm}
        >
          <div className={styles.formInner}>
            <OtpInput
              shouldAutoFocus
              inputType="number"
              value={values["otp"] ?? ""}
              onChange={handleChange}
              numInputs={OTP_CODE_LENGTH}
            />
            <input hidden type="submit" ref={submitInputRef} />
            <ErrorMessage name="otp" />
          </div>
        </form>
      )}
      {flowState.matches("submitting") ? (
        hasRetried ? (
          <EmailIcon />
        ) : (
          <Loader />
        )
      ) : null}
      {flowState.matches("input") && (
        // fallback to prevent layout shift
        <Delayed
          delayMs={BASE_RETRY_DELAY * flowState.context.attempt}
          fallback={<div style={{ height: 16 }} />}
        >
          <div className={styles.wrapper}>
            <Prompt
              prompt="authenticating.retryPrompt"
              cta="authenticating.retry"
              onClick={handleRetry}
            />
          </div>
        </Delayed>
      )}
    </>
  );
};
