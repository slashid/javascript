import { Factor } from "@slashid/slashid";
import { TextConfigKey } from "../../text/constants";
import { Handle } from "../../../domain/types";

export type AuthenticatingMessageOptions = {
  state?: "submitting" | "retrying";
};

type HandleTextTokens = Partial<
  Record<"EMAIL_ADDRESS" | "PHONE_NUMBER", string>
>;

/**
 *  Helper function to extract phone number or email address if either is present in the handle.
 *
 * @param {Handle | undefined} handle Handle used for authentication. Can be undefined (e.g. when
 * authenticating with OIDC).
 * @returns {HandleTextTokens | undefined} tokens map or undefined
 */
export function getTextTokensFromHandle(
  handle: Handle | undefined
): HandleTextTokens | undefined {
  if (handle && handle.type === "email_address") {
    return {
      EMAIL_ADDRESS: handle.value,
    };
  }

  if (handle && handle.type === "phone_number") {
    return {
      PHONE_NUMBER: handle.value,
    };
  }

  return undefined;
}

// TODO add case for password
export function getAuthenticatingMessage(
  factor: Factor,
  handle: Handle | undefined,
  { state }: AuthenticatingMessageOptions = {}
): {
  title: TextConfigKey;
  message: TextConfigKey;
  tokens?: HandleTextTokens;
} {
  switch (factor.method) {
    case "oidc":
    case "saml":
      return {
        message: "authenticating.message.oidc",
        title: "authenticating.title.oidc",
      };
    case "webauthn":
      return {
        message: "authenticating.message.webauthn",
        title: "authenticating.title.webauthn",
        tokens: getTextTokensFromHandle(handle),
      };

    case "sms_link":
      return {
        message: "authenticating.message.smsLink",
        title: "authenticating.title.smsLink",
        tokens: getTextTokensFromHandle(handle),
      };
    case "otp_via_sms": {
      if (state === "retrying") {
        return {
          message: "authenticating.retry.message.smsOtp",
          title: "authenticating.retry.title.smsOtp",
          tokens: getTextTokensFromHandle(handle),
        };
      }
      if (state === "submitting") {
        return {
          message: "authenticating.submitting.message.smsOtp",
          title: "authenticating.submitting.title.smsOtp",
          tokens: getTextTokensFromHandle(handle),
        };
      }
      return {
        message: "authenticating.message.smsOtp",
        title: "authenticating.title.smsOtp",
        tokens: getTextTokensFromHandle(handle),
      };
    }
    case "otp_via_email":
      if (state === "retrying") {
        return {
          message: "authenticating.retry.message.emailOtp",
          title: "authenticating.retry.title.emailOtp",
          tokens: getTextTokensFromHandle(handle),
        };
      }
      if (state === "submitting") {
        return {
          message: "authenticating.submitting.message.emailOtp",
          title: "authenticating.submitting.title.emailOtp",
          tokens: getTextTokensFromHandle(handle),
        };
      }
      return {
        message: "authenticating.message.emailOtp",
        title: "authenticating.title.emailOtp",
        tokens: getTextTokensFromHandle(handle),
      };
    case "email_link":
    default:
      return {
        message: "authenticating.message.emailLink",
        title: "authenticating.title.emailLink",
        tokens: getTextTokensFromHandle(handle),
      };
  }
}
