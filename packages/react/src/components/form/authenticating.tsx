import { Factor } from "@slashid/slashid";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getAuthenticatingMessage,
  isFactorEmailLink,
  isFactorOTP,
  isFactorSmsLink,
} from "../../domain/handles";
import { useConfiguration } from "../../hooks/use-configuration";
import { useForm } from "../../hooks/use-form";
import { useSlashID } from "../../main";
import { sprinkles } from "../../theme/sprinkles.css";
import { LinkButton } from "../button/link-button";
import { Chat } from "../icon/chat";
import { Email } from "../icon/email";
import { OtpInput } from "../otp-input";
import { Circle } from "../spinner/circle";
import { Spinner } from "../spinner/spinner";
import { Text } from "../text";
import * as styles from "./authenticating.css";
import { ErrorMessage } from "./error-message";
import { AuthenticatingState } from "./flow";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";

const Loader = () => (
  <Circle>
    <Spinner />
  </Circle>
);

const AuthenticatingContent = ({ factor }: { factor: Factor }) => {
  if (isFactorOTP(factor)) {
    return <OtpForm />;
  }

  if (isFactorEmailLink(factor)) {
    return (
      <Circle>
        <Email />
      </Circle>
    );
  }

  if (isFactorSmsLink(factor)) {
    return (
      <Circle>
        <Chat />
      </Circle>
    );
  }

  return <Loader />;
};

type Props = {
  flowState: AuthenticatingState;
};

const OtpForm = () => {
  const { text } = useConfiguration();
  const { sid } = useSlashID();
  const { values, registerField, registerSubmit } = useForm();
  const [formState, setFormState] = useState<
    "initial" | "input" | "submitting"
  >("initial");
  const submitInputRef = useRef<HTMLInputElement>(null);

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

  if (formState !== "input") {
    return <Loader />;
  }

  return (
    <form onSubmit={registerSubmit(handleSubmit)} className={styles.otpForm}>
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
  );
};

export const Authenticating: React.FC<Props> = ({ flowState }) => {
  const { text } = useConfiguration();
  const { title, message } = getAuthenticatingMessage(
    flowState.context.config.factor
  );
  const factor = flowState.context.config.factor;

  return (
    <article data-testid="sid-form-authenticating-state">
      <LinkButton
        className={sprinkles({ marginBottom: "4" })}
        testId="sid-form-authenticating-cancel-button"
        variant="back"
        onClick={() => flowState.cancel()}
      >
        {text["authenticating.back"]}
      </LinkButton>
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }}>
        {factor.method === "oidc" ? (
          <span className={styles.oidcTitle}>
            {factor.options?.provider as unknown as string}
          </span>
        ) : undefined}
      </Text>
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      <AuthenticatingContent factor={factor} />
      <div className={styles.retryPrompt}>
        <Text
          variant={{ size: "sm", color: "tertiary", weight: "semibold" }}
          t="authenticating.retryPrompt"
        />
        <LinkButton
          className={sprinkles({ marginLeft: "1" })}
          type="button"
          testId="sid-form-authenticating-retry-button"
          onClick={() => flowState.retry()}
        >
          {text["authenticating.retry"]}
        </LinkButton>
      </div>
    </article>
  );
};
