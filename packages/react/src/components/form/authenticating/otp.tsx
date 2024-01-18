import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Factor } from "@slashid/slashid";

import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { useSlashID } from "../../../main";
import { Props } from "./authenticating.types";
import { getAuthenticatingMessage } from "./messages";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";
import { OtpInput } from "../../otp-input";
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

// special case handling for OTPs - exists, needs to be refactored
export const OTPState = ({ flowState }: Props) => {
  const { text } = useConfiguration();
  const { sid } = useSlashID();
  const { values, registerField, registerSubmit } = useForm();
  const [formState, setFormState] = useState<
    "initial" | "input" | "submitting"
  >("initial");
  const submitInputRef = useRef<HTMLInputElement>(null);

  const factor = flowState.context.config.factor;
  const { title, message } = getAuthenticatingMessage(
    factor,
    formState === "submitting"
  );

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

      onChange(event as never);
    },
    [registerField, text]
  );

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
          <OtpInput
            shouldAutoFocus
            inputType="number"
            value={values["otp"] ?? ""}
            onChange={handleChange}
            numInputs={OTP_CODE_LENGTH}
          />
          <input hidden type="submit" ref={submitInputRef} />
          <ErrorMessage name="otp" />
        </form>
      )}
      {formState === "submitting" ? (
        <Loader />
      ) : (
        <RetryPrompt onRetry={() => flowState.retry()} />
      )}
    </>
  );
};
