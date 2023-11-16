import { Factor } from "@slashid/slashid";
import { LinkButton } from "@slashid/react-primitives";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  isFactorEmailLink,
  isFactorOTP,
  isFactorOTPEmail,
  isFactorOTPSms,
  isFactorSmsLink,
} from "../../domain/handles";
import { useConfiguration } from "../../hooks/use-configuration";
import { useForm } from "../../hooks/use-form";
import { useSlashID } from "../../main";
import { sprinkles } from "@slashid/react-primitives/src/theme/sprinkles.css";
import { Chat, Email } from "@slashid/react-primitives";
import { OtpInput } from "../otp-input";
import { Circle } from "../spinner/circle";
import { Spinner } from "../spinner/spinner";
import { Text } from "../text";
import { TextConfigKey } from "../text/constants";
import * as styles from "./authenticating.css";
import { ErrorMessage } from "./error-message";
import { AuthenticatingState } from "./flow";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";

function getAuthenticatingMessage(
  factor: Factor,
  isSubmitting = false
): { title: TextConfigKey; message: TextConfigKey } {
  switch (factor.method) {
    case "oidc":
      return {
        message: "authenticating.message.oidc",
        title: "authenticating.title.oidc",
      };
    case "webauthn":
      return {
        message: "authenticating.message.webauthn",
        title: "authenticating.title.webauthn",
      };

    case "sms_link":
      return {
        message: "authenticating.message.smsLink",
        title: "authenticating.title.smsLink",
      };
    case "otp_via_sms": {
      if (isSubmitting) {
        return {
          message: "authenticating.submitting.message.smsOtp",
          title: "authenticating.submitting.title.smsOtp",
        };
      }
      return {
        message: "authenticating.message.smsOtp",
        title: "authenticating.title.smsOtp",
      };
    }
    case "otp_via_email":
      if (isSubmitting) {
        return {
          message: "authenticating.submitting.message.emailOtp",
          title: "authenticating.submitting.title.emailOtp",
        };
      }
      return {
        message: "authenticating.message.emailOtp",
        title: "authenticating.title.emailOtp",
      };
    case "email_link":
    default:
      return {
        message: "authenticating.message.emailLink",
        title: "authenticating.title.emailLink",
      };
  }
}

const Loader = () => (
  <Circle>
    <Spinner />
  </Circle>
);

const EmailIcon = () => (
  <Circle>
    <Email />
  </Circle>
);

const SmsIcon = () => (
  <Circle>
    <Chat />
  </Circle>
);

const OTPIcon = ({ factor }: { factor: Factor }) => {
  if (isFactorOTPEmail(factor)) {
    return <EmailIcon />;
  }

  if (isFactorOTPSms(factor)) {
    return <SmsIcon />;
  }

  return <Loader />;
};

const NonOTPIcon = ({ factor }: { factor: Factor }) => {
  if (isFactorEmailLink(factor)) {
    return <EmailIcon />;
  }

  if (isFactorSmsLink(factor)) {
    return <SmsIcon />;
  }

  return <Loader />;
};

const BackButton = ({ onCancel }: { onCancel: () => void }) => {
  const { text } = useConfiguration();
  return (
    <LinkButton
      className={sprinkles({ marginBottom: "4" })}
      testId="sid-form-authenticating-cancel-button"
      variant="back"
      onClick={onCancel}
    >
      {text["authenticating.back"]}
    </LinkButton>
  );
};

const RetryPrompt = ({ onRetry }: { onRetry: () => void }) => {
  const { text } = useConfiguration();
  return (
    <div className={styles.retryPrompt}>
      <Text
        variant={{ size: "sm", color: "tertiary", weight: "semibold" }}
        t="authenticating.retryPrompt"
      />
      <LinkButton
        className={sprinkles({ marginLeft: "1" })}
        type="button"
        testId="sid-form-authenticating-retry-button"
        onClick={onRetry}
      >
        {text["authenticating.retry"]}
      </LinkButton>
    </div>
  );
};

type Props = {
  flowState: AuthenticatingState;
};

const OTPContent = ({ flowState }: Props) => {
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
      {formState === "initial" && <OTPIcon factor={factor} />}
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

const NonOTPContent = ({ flowState }: Props) => {
  const factor = flowState.context.config.factor;
  const { title, message } = getAuthenticatingMessage(factor);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }}>
        {factor.method === "oidc" ? (
          <span className={styles.oidcTitle}>
            {factor.options?.provider as unknown as string}
          </span>
        ) : undefined}
      </Text>
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      <NonOTPIcon factor={factor} />
      <RetryPrompt onRetry={() => flowState.retry()} />
    </>
  );
};

export const Authenticating = ({ flowState }: Props) => (
  <article data-testid="sid-form-authenticating-state">
    {isFactorOTP(flowState.context.config.factor) ? (
      <OTPContent flowState={flowState} />
    ) : (
      <NonOTPContent flowState={flowState} />
    )}
  </article>
);
