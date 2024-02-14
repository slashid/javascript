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
import { useSlashID } from "../../../main";
import { Props } from "./authenticating.types";
import { getAuthenticatingMessage } from "./messages";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";
import { ErrorMessage } from "../error-message";
import { Text } from "../../text";

import * as styles from "./authenticating.css";
import { isFactorOTPEmail, isFactorOTPSms } from "../../../domain/handles";
import { EmailIcon, SmsIcon, Loader } from "./icons";
import { BackButton, RetryPrompt } from "./authenticating.components";

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
  const { sid } = useSlashID();
  const { values, registerField, registerSubmit, setError, clearError } =
    useForm();
  const [formState, setFormState] = useState<
    "initial" | "input" | "submitting"
  >("initial");
  const submitInputRef = useRef<HTMLInputElement>(null);

  const factor = flowState.context.config.factor;
  const hasRetried = flowState.context.attempt > 1;
  const { title, message } = getAuthenticatingMessage(factor, {
    isSubmitting: formState === "submitting",
    hasRetried,
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      setFormState("submitting");
      sid?.publish("otpCodeSubmitted", values["otp"]);
    },
    [sid, values]
  );

  useEffect(() => {
    const handler = () => {
      setError("otp", {
        message: text["authenticating.otpInput.submit.error"],
      });
      values["otp"] = "";
    };
    sid?.subscribe("otpIncorrectCodeSubmitted", handler);

    return () => sid?.unsubscribe("otpIncorrectCodeSubmitted", handler);
  }, [setError, sid, text, values]);

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
    setFormState("submitting");
  };

  useEffect(() => {
    if (isValidOTPCode(values["otp"])) {
      // Automatically submit the form when the OTP code is valid
      submitInputRef.current?.click();
    }
  }, [values]);

  useEffect(() => {
    const onOtpCodeSent = () => setFormState("input");
    if (formState === "initial") {
      sid?.subscribe("otpCodeSent", onOtpCodeSent);
    }
  }, [formState, sid]);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      {formState === "initial" && <FactorIcon factor={factor} />}
      {formState === "input" && (
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
      {formState === "submitting" ? (
        hasRetried ? (
          <EmailIcon />
        ) : (
          <Loader />
        )
      ) : null}
      {formState === "input" && (
        // fallback to prevent layout shift
        <Delayed
          delayMs={BASE_RETRY_DELAY * flowState.context.attempt}
          fallback={<div style={{ height: 16 }} />}
        >
          <div className={styles.wrapper}>
            <RetryPrompt onRetry={handleRetry} />
          </div>
        </Delayed>
      )}
    </>
  );
};
