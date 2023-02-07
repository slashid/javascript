import { centered, sprinkles } from "../../theme/sprinkles.css";
import { AuthenticatingState } from "./flow";
import { Text } from "../text";
import { LinkButton } from "../button/link-button";
import * as styles from "./authenticating.css";
import { useConfiguration } from "../../hooks/use-configuration";
import { getAuthenticatingMessage } from "../../domain/handles";
import { Circle } from "../spinner/circle";
import { Spinner } from "../spinner/spinner";
import { clsx } from "clsx";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { Input } from "../input";
import { Button } from "../button";
import { ErrorMessage } from "./error-message";
import { useSlashID } from "../../main";
import { isValidOTPCode } from "./validation";
import { useForm } from "../../hooks/use-form";

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
  const { values, registerField, registerSubmit, resetForm, status } =
    useForm();
  const [formState, setFormState] = useState<
    "initial" | "input" | "submitting"
  >("initial");

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      setFormState("submitting");
      sid?.publish("otpCodeSubmitted", values["otp"]);
    },
    [sid, values]
  );

  useEffect(() => {
    const onOtpSmsSent = () => setFormState("input");
    if (formState === "initial") {
      sid?.subscribe("otpSmsSent", onOtpSmsSent);
    }
  }, [formState, sid]);

  useEffect(() => {
    return resetForm;
  }, [resetForm]);

  if (formState !== "input") {
    return <Loader />;
  }

  return (
    <form onSubmit={registerSubmit(handleSubmit)} className={styles.otpForm}>
      <section className={styles.otpFormSection}>
        <Input
          id="sid-otp-input"
          name="otp"
          label={text["authenticating.otpInput"]}
          type="text"
          value={values["otp"] ?? ""}
          onChange={registerField("otp", (value) => {
            if (!isValidOTPCode(value)) {
              return { message: text["validationError.otp"] };
            }
          })}
        />
        <Button type="submit" variant="primary" disabled={status === "invalid"}>
          {text["authenticating.otpInput.submit"]}
        </Button>
      </section>
      <ErrorMessage name="otp" />
    </form>
  );
};

export const Authenticating: React.FC<Props> = ({ flowState }) => {
  const { text } = useConfiguration();
  const { title, message } = getAuthenticatingMessage(
    flowState.context.options.factor
  );
  const factor = flowState.context.options.factor;

  return (
    <article data-testid="sid-form-authenticating-state">
      <LinkButton
        className={sprinkles({ marginBottom: "6" })}
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
      {factor.method === "otp_via_sms" ? <OtpForm /> : <Loader />}
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
