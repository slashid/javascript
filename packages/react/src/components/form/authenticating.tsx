import { clsx } from "clsx";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { getAuthenticatingMessage, isFactorOTP } from "../../domain/handles";
import { useConfiguration } from "../../hooks/use-configuration";
import { useForm } from "../../hooks/use-form";
import { useSlashID } from "../../main";
import { centered, sprinkles } from "../../theme/sprinkles.css";
import { LinkButton } from "../button/link-button";
import { OtpInput } from "../otp-input";
import { Circle } from "../spinner/circle";
import { Spinner } from "../spinner/spinner";
import { Text } from "../text";
import * as styles from "./authenticating.css";
import { ErrorMessage } from "./error-message";
import { AuthenticatingState } from "./flow";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";

const Loader = () => (
  <div className={clsx(sprinkles({ marginY: "12" }), centered)}>
    <Circle>
      <Spinner />
    </Circle>
  </div>
);

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

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      setFormState("submitting");
      sid?.publish("otpCodeSubmitted", values["otp"]);
      console.log("OTP submitted: ", values["otp"]);
    },
    [sid, values]
  );

  useEffect(() => {
    const onOtpCodeSent = () => setFormState("input");
    if (formState === "initial") {
      sid?.subscribe("otpCodeSent", onOtpCodeSent);
    }
  }, [formState, sid]);

  // TODO: only for testing, revert when done testing
  // if (formState !== "input") {
  //   return <Loader />;
  // }

  return (
    <form onSubmit={registerSubmit(handleSubmit)} className={styles.otpForm}>
      {/* TODO: test in mobile and SSR */}
      <OtpInput
        shouldAutoFocus
        inputType="number"
        value={values["otp"] ?? ""}
        onChange={(otp) => {
          const onChangeHandler = registerField("otp", {
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

          // TODO: revisit this logic
          onChangeHandler(event as never);
        }}
        numInputs={OTP_CODE_LENGTH}
      />
      <input type="submit" hidden />
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
      <Text as="h1" t={title} variant={{ size: "2xl-title" }}>
        {factor.method === "oidc" ? (
          <span className={styles.oidcTitle}>
            {factor.options?.provider as unknown as string}
          </span>
        ) : undefined}
      </Text>
      <Text t={message} variant={{ color: "contrast" }} />
      {isFactorOTP(factor) ? <OtpForm /> : <Loader />}
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
