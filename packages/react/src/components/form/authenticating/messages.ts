import { Factor } from "@slashid/slashid";
import { TextConfigKey } from "../../text/constants";

type AuthenticatingMessageOptions = {
  isSubmitting: boolean;
  hasRetried: boolean;
};

// TODO add case for password
export function getAuthenticatingMessage(
  factor: Factor,
  { isSubmitting, hasRetried }: AuthenticatingMessageOptions = {
    isSubmitting: false,
    hasRetried: false,
  }
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
      if (isSubmitting && hasRetried) {
        return {
          message: "authenticating.retry.message.smsOtp",
          title: "authenticating.retry.title.smsOtp",
        };
      }
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
      if (isSubmitting && hasRetried) {
        return {
          message: "authenticating.retry.message.emailOtp",
          title: "authenticating.retry.title.emailOtp",
        };
      }
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
