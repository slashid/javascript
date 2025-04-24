import {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Factor } from "@slashid/slashid";
import { OtpInput, Delayed } from "@slashid/react-primitives";

import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { useSlashID } from "../../../main";
import { Props } from "./authenticating.types";
import {
  AuthenticatingMessageOptions,
  getAuthenticatingMessage,
} from "./messages";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";
import { ErrorMessage } from "../error-message";
import { Text } from "../../text";

import * as styles from "./authenticating.css";
import { isFactorOTPEmail, isFactorOTPSms } from "../../../domain/handles";
import { EmailIcon, SmsIcon, Loader } from "./icons";
import {
  AuthenticatingSubtitle,
  BackButton,
  DelayedPrompt,
  Prompt,
} from "./authenticating.components";
import { TIME_MS } from "../types";

const DELAY_BEFORE_RESEND = TIME_MS.second * 30;

const FactorIcon = ({ factor }: { factor: Factor }) => {
  if (isFactorOTPEmail(factor)) {
    return <EmailIcon />;
  }

  if (isFactorOTPSms(factor)) {
    return <SmsIcon />;
  }

  return <Loader />;
};

type FormState = "initial" | "input" | "submitting" | "retrying";

function mapFormStateToMessageState(
  formState: FormState
): AuthenticatingMessageOptions["state"] {
  switch (formState) {
    case "submitting":
      return "submitting";
    case "retrying":
      return "retrying";
    default:
      return undefined;
  }
}

/**
 * Presents the user with a form to enter an OTP code.
 * Handles retries in case of submitting an incorrect OTP code.
 */
export const OTPState = ({ flowState }: Props) => {
  const { text } = useConfiguration();
  const { sid, subscribe, unsubscribe } = useSlashID();
  const {
    values,
    registerField,
    registerSubmit,
    setError,
    clearError,
    resetForm,
  } = useForm();
  const [formState, setFormState] = useState<FormState>("initial");
  const submitInputRef = useRef<HTMLInputElement>(null);

  const { factor, handle } = flowState.context.config;
  const { title, message, tokens } = useMemo(() => {
    return getAuthenticatingMessage(factor, handle, {
      state: mapFormStateToMessageState(formState),
    });
  }, [factor, formState, handle]);

  const onOtpCodeSent = useCallback(() => setFormState("input"), []);
  const onOtpIncorrectCodeSubmitted = useCallback(() => {
    resetForm();
    setError("otp", {
      message: text["authenticating.otpInput.submit.error"],
    });
    setFormState("input");
  }, [resetForm, setError, text]);

  useEffect(() => {
    subscribe("otpCodeSent", onOtpCodeSent);
    subscribe("otpIncorrectCodeSubmitted", onOtpIncorrectCodeSubmitted);

    return () => {
      unsubscribe("otpCodeSent", onOtpCodeSent);
      unsubscribe("otpIncorrectCodeSubmitted", onOtpIncorrectCodeSubmitted);
    };
  }, [onOtpCodeSent, onOtpIncorrectCodeSubmitted, subscribe, unsubscribe]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      setFormState("submitting");
      sid?.publish("otpCodeSubmitted", values["otp"]);
    },
    [sid, values]
  );

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
    setFormState("retrying");
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
      <Text
        as="h1"
        className="sid-form-authenticating-title sid-form-authenticating-title-otp"
        t={title}
        variant={{ size: "2xl-title", weight: "bold" }}
      />
      <AuthenticatingSubtitle />
      <Text
        t={message}
        variant={{ color: "contrast", weight: "semibold" }}
        tokens={tokens}
      />
      {formState === "initial" && <FactorIcon factor={factor} />}
      {formState === "input" && (
        <form
          onSubmit={registerSubmit(handleSubmit)}
          className={styles.otpForm}
        >
          <div
            className={styles.formInner}
            data-testid="sid-form-authenticating-otp"
          >
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
      {formState === "submitting" ? <Loader /> : null}
      {formState === "retrying" ? <FactorIcon factor={factor} /> : null}
      {["input", "initial"].includes(formState) && (
        // fallback to prevent layout shift
        <Delayed
          delayMs={DELAY_BEFORE_RESEND}
          fallback={({ secondsRemaining }) => (
            <div className={styles.wrapper}>
              <DelayedPrompt
                prompt="authenticating.retryPrompt"
                cta="authenticating.retry"
                secondsRemaining={secondsRemaining}
              />
            </div>
          )}
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
