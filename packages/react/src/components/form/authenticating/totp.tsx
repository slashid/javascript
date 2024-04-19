import { useCallback, useEffect, useRef, useState } from "react";
import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { Props } from "./authenticating.types";
import { BackButton, Prompt } from "./authenticating.components";
import { Text } from "../../text";
import { TextConfigKey } from "../../text/constants";
import { Loader } from "./icons";
import {
  TOTPStatus,
  isInputState,
  isRegisterTotpAuthenticatorState,
  isSaveRecoveryCodesState,
} from "../ui-state-machine";
import {
  Button,
  OtpInput,
  sprinkles,
  ReadOnly,
  Download,
} from "@slashid/react-primitives";
import { useSlashID } from "../../../main";
import { OTP_CODE_LENGTH, isValidOTPCode } from "./validation";
import { ErrorMessage } from "../error-message";

import * as styles from "./authenticating.css";

function getTextKeys(flowState: Props["flowState"]) {
  const TEXT_KEYS: Record<
    TOTPStatus,
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
    saveRecoveryCodes: {
      title: "authenticating.saveRecoveryCodes.totp.title",
      message: "authenticating.saveRecoveryCodes.totp.message",
      submit: "authenticating.continue",
    },
  };

  const status = flowState.getChildState().status as TOTPStatus;

  return TEXT_KEYS[status];
}

export function TOTPState({ flowState }: Props) {
  const { sid } = useSlashID();
  const { text } = useConfiguration();
  const { values, registerField, registerSubmit, setError, clearError } =
    useForm();
  const { title, message, submit } = getTextKeys(flowState);
  const uiState = flowState.getChildState();
  const [showUri, setShowUri] = useState(false);
  const submitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => {
      setError("totp", {
        message: text["authenticating.otpInput.submit.error"],
      });
      values["totp"] = "";
    };
    sid?.subscribe("otpIncorrectCodeSubmitted", handler);

    return () => sid?.unsubscribe("otpIncorrectCodeSubmitted", handler);
  }, [setError, sid, text, values]);

  const handleChange = useCallback(
    (otp: string) => {
      const onChange = registerField("totp", {
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

      clearError("totp");
      onChange(event as never);
    },
    [clearError, registerField, text]
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
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      {flowState.matches("initial") && <Loader />}
      {isRegisterTotpAuthenticatorState(uiState) && (
        <form
          onSubmit={registerSubmit((e) => {
            e.preventDefault();
            uiState.confirm();
          })}
          className={styles.registerAuthenticatorForm}
        >
          <img
            src={`data:image/png;base64, ${uiState.qrCode}`}
            alt="QR Code"
            className={styles.qrCode}
          />
          <Prompt
            prompt="authenticating.registerAuthenticator.totp.prompt"
            cta="authenticating.registerAuthenticator.totp.cta"
            onClick={() => setShowUri(true)}
          />
          {showUri && (
            <ReadOnly
              id="uri"
              value={uiState.uri}
              label="Set up URI"
              copy
              className={styles.readOnly}
            />
          )}
          <Submit textKey={submit} />
        </form>
      )}
      {isInputState(uiState) && (
        <form
          onSubmit={registerSubmit((e) => {
            e.preventDefault();
            uiState.submit(values["totp"]);
          })}
          className={styles.otpForm}
        >
          <div className={styles.formInner}>
            <OtpInput
              shouldAutoFocus
              inputType="number"
              value={values["totp"] ?? ""}
              onChange={handleChange}
              numInputs={OTP_CODE_LENGTH}
            />
            <input hidden type="submit" ref={submitInputRef} />
            <ErrorMessage name="totp" />
          </div>
        </form>
      )}
      {flowState.matches("submitting") ? <Loader /> : null}
      {isSaveRecoveryCodesState(uiState) && (
        <form
          onSubmit={registerSubmit((e) => {
            e.preventDefault();
            uiState.confirm();
          })}
        >
          <ReadOnly
            id="recoveryCodes"
            as="textarea"
            value={uiState.recoveryCodes.join(String.fromCharCode(13, 10))}
            rows={8}
            copy
            className={styles.readOnly}
          />
          <DownloadCodes codes={uiState.recoveryCodes} />
          <Submit textKey={submit} />
        </form>
      )}
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

function DownloadCodes({ codes }: { codes: string[] }) {
  const { text } = useConfiguration();

  const handleDownloadCodes = () => {
    const download = document.createElement("a");
    download.setAttribute(
      "href",
      `data:text/plain;charset=utf8,${encodeURIComponent(codes.join("\n"))}`
    );
    download.setAttribute("download", "recovery-codes.txt");

    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  };

  return (
    <Button
      className={sprinkles({
        marginTop: "6",
      })}
      type="button"
      variant="secondary"
      testId="sid-form-authenticating-download-codes-button"
      onClick={handleDownloadCodes}
      icon={<Download />}
    >
      {text["authenticating.downloadCodes"]}
    </Button>
  );
}
