import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { Props } from "./authenticating.types";
import {
  AuthenticatingSubtitle,
  BackButton,
  Prompt,
} from "./authenticating.components";
import { Text } from "../../text";
import { TextConfigKey } from "../../text/constants";
import { Loader } from "./icons";
import {
  Button,
  OtpInput,
  sprinkles,
  ReadOnlyField,
  Input,
  LinkButton,
} from "@slashid/react-primitives";
import { useSlashID } from "../../../main";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";
import { ErrorMessage } from "../error-message";

import * as styles from "./authenticating.css";
import { TotpKeyGenerated } from "@slashid/slashid";

type FormState = "initial" | "registerAuthenticator" | "input" | "submitting";

function getTextKeys(formState: FormState) {
  const TEXT_KEYS: Record<
    FormState,
    Record<"title" | "message" | "submit", TextConfigKey>
  > = {
    initial: {
      title: "authenticating.initial.totp.title",
      message: "authenticating.initial.totp.message",
      submit: "",
    },
    registerAuthenticator: {
      title: "authenticating.registerAuthenticator.totp.title",
      message: "authenticating.registerAuthenticator.totp.message",
      submit: "authenticating.continue",
    },
    input: {
      title: "authenticating.input.totp.title",
      message: "authenticating.input.totp.message",
      submit: "authenticating.confirm",
    },
    submitting: {
      title: "authenticating.input.totp.title",
      message: "authenticating.input.totp.message",
      submit: "authenticating.confirm",
    },
  };

  return TEXT_KEYS[formState];
}

export function TOTPState({ flowState, performLogin }: Props) {
  const { sid } = useSlashID();
  const { text } = useConfiguration();
  const { values, registerField, registerSubmit, setError, clearError } =
    useForm();
  const [formState, setFormState] = useState<FormState>("initial");
  const { title, message, submit } = getTextKeys(formState);
  const [showUri, setShowUri] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [isRegisterFlow, setIsRegisterFlow] = useState(false);
  const submitInputRef = useRef<HTMLInputElement>(null);

  const [qrCode, setQrCode] = useState("");
  const [uri, setUri] = useState("");

  useEffect(() => {
    const otpIncorrectCodeSubmittedHandler = () => {
      setError("totp", {
        message: text["authenticating.otpInput.submit.error"],
      });
      values["totp"] = "";
      setFormState("input");
    };

    const totpKeyGeneratedHandler = (e: TotpKeyGenerated) => {
      if (!isRegisterFlow) {
        setQrCode(e.qrCode);
        setUri(e.uri);
        flowState.setRecoveryCodes(e.recoveryCodes);
        setIsRegisterFlow(true);
        setFormState("registerAuthenticator");
      }
    };

    const totpCodeRequestedHandler = () => {
      setFormState("input");
    };

    sid?.subscribe(
      "otpIncorrectCodeSubmitted",
      otpIncorrectCodeSubmittedHandler
    );
    sid?.subscribe("totpCodeRequested", totpCodeRequestedHandler);
    sid?.subscribe("totpKeyGenerated", totpKeyGeneratedHandler);

    performLogin();

    return () => {
      sid?.unsubscribe(
        "otpIncorrectCodeSubmitted",
        otpIncorrectCodeSubmittedHandler
      );
      sid?.unsubscribe("totpCodeRequested", totpCodeRequestedHandler);
      sid?.unsubscribe("totpKeyGenerated", totpKeyGeneratedHandler);
    };
  }, [
    formState,
    setError,
    sid,
    text,
    values,
    performLogin,
    flowState,
    isRegisterFlow,
  ]);

  const handleChange = useCallback(
    (otp: string) => {
      const onChange = registerField("totp", {
        validator: (value) => {
          if (useRecoveryCode) return;
          if (!useRecoveryCode && !isValidOTPCode(value)) {
            return { message: text["validationError.otp"] };
          }
        },
      });

      const event = {
        target: {
          value: otp,
        },
      };

      clearError("totp");
      onChange(event as never);
    },
    [clearError, registerField, text, useRecoveryCode]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      setFormState("submitting");
      sid?.publish("otpCodeSubmitted", values["totp"]);
    },
    [sid, values]
  );

  useEffect(() => {
    if (isValidOTPCode(values["totp"])) {
      // Automatically submit the form when the TOTP code is valid
      submitInputRef.current?.click();
    }
  }, [values]);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text
        as="h1"
        className="sid-form-authenticating-title sid-form-authenticating-title-totp"
        t={title}
        variant={{ size: "2xl-title", weight: "bold" }}
      />
      <AuthenticatingSubtitle />
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      {formState === "initial" && <Loader />}
      {formState === "registerAuthenticator" && (
        <form
          onSubmit={registerSubmit((e) => {
            e.preventDefault();
            setFormState("input");
          })}
          className={styles.registerAuthenticatorForm}
        >
          <img
            src={`data:image/png;base64, ${qrCode}`}
            alt="QR Code"
            className={styles.qrCode}
          />
          <Prompt
            prompt="authenticating.registerAuthenticator.totp.prompt"
            cta="authenticating.registerAuthenticator.totp.cta"
            onClick={() => setShowUri(true)}
          />
          {showUri && (
            <ReadOnlyField
              id="uri"
              value={uri}
              label="Set up URI"
              copy
              className={styles.readOnly}
            />
          )}
          <Submit textKey={submit} />
        </form>
      )}
      {formState === "input" && (
        <form
          onSubmit={registerSubmit(handleSubmit)}
          className={styles.otpForm}
        >
          <div className={styles.formInner}>
            {useRecoveryCode ? (
              <Input
                id="totp"
                name="totp"
                label="Recovery code"
                placeholder="Log in with recovery code"
                type="text"
                value={values["totp"] ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            ) : (
              <div
                className={sprinkles({
                  gap: "12",
                })}
              >
                <OtpInput
                  shouldAutoFocus
                  inputType="number"
                  value={values["totp"] ?? ""}
                  onChange={handleChange}
                  numInputs={OTP_CODE_LENGTH}
                />
                {!isRegisterFlow && (
                  <div className={styles.prompt}>
                    <LinkButton
                      className={sprinkles({
                        marginTop: "4",
                      })}
                      type="button"
                      onClick={() => {
                        clearError("totp");
                        setUseRecoveryCode(true);
                      }}
                    >
                      {text["authenticating.input.totp.cta"]}
                    </LinkButton>
                  </div>
                )}
              </div>
            )}

            <input hidden type="submit" ref={submitInputRef} />
            <ErrorMessage name="totp" />
            <Submit textKey={submit} />
          </div>
        </form>
      )}
      {formState === "submitting" ? <Loader /> : null}
    </>
  );
}

type SubmitProps = {
  textKey: TextConfigKey;
  disabled?: boolean;
};

function Submit({ textKey, disabled }: SubmitProps) {
  const { text } = useConfiguration();

  return (
    <Button
      className={sprinkles({
        marginTop: "6",
      })}
      type="submit"
      variant="primary"
      testId="sid-form-authenticating-submit-button"
      disabled={disabled}
    >
      {text[textKey]}
    </Button>
  );
}
