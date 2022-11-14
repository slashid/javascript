import Spinner, { SpinnerColorType } from "../Spinner";
import { Action, AuthMethod } from "./state";
import css from "./slashidform.module.css";
import Input from "../Input";
import Button from "../Button";
import { Dispatch, useState } from "react";

const getMethodText = (method: string) => {
  switch (method) {
    case "webauthn":
      return "You'll be prompted to validate your login via your device! If you are registering for the first time, you will receive an email to verify your email address.";
    case "webauthn_via_sms":
      return "You'll be prompted to validate your login via your device!";
    case "webauthn_via_email":
    case "email_link":
    default:
      return "We have sent you a link via email. Follow the link provided to complete your registration.";
    case "sms_link":
      return "We have sent you a link via text. Follow the link provided to complete your registration.";
    case "otp_via_sms":
      return "We sent you a code via text. Please insert it.";
    case "oidc":
      return "Please proceed with the authentication in the newly opened window.";
  }
};

type Props = {
  dispatch: Dispatch<Action>;
  authMethod: AuthMethod;
};

export const Authenticating: React.FC<Props> = ({ dispatch, authMethod }) => {
  const [otpValue, setOtpValue] = useState("");
  const [canResendEmail, setCanResendEmail] = useState(true);

  return (
    <>
      <div className={css.spinner}>
        <Spinner color={SpinnerColorType.Blue} isBig size={48} />
      </div>

      <>
        <p className={css.title}>Credentials confirmation</p>
        <p className={css.description}>{getMethodText(authMethod!)}</p>
        <p className={css.description}>
          After interacting with the confirmation, please come back to this
          screen to proceed.
        </p>
      </>
      {authMethod == "otp_via_sms" && (
        <>
          <div style={{ width: "100%", paddingBottom: "24px" }} />
          <div className={css.otpButtonContainer}>
            <Input
              id="otp_value"
              placeholder="Insert your OTP here"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              autoFocus={true}
            />
            <Button isDisabled={otpValue === ""} label="Submit OTP" id="otp" />
          </div>
        </>
      )}

      <div className={css.divider} />
      <p className={css.verificationInfo}>
        Confirmation not received?{" "}
        <button
          onClick={() => {
            setCanResendEmail(false);
            dispatch({ type: "RESTART_AUTH" });
            setTimeout(() => setCanResendEmail(true), 10000);
          }}
          className={canResendEmail ? css.resendButton : css.disabled}
        >
          Send again.
        </button>
      </p>
    </>
  );
};
