import { Factor } from "@slashid/slashid";
import {
  findFlagByDialCode,
  getList,
} from "country-list-with-dial-code-and-flag";
import { TextConfigKey } from "../components/text/constants";
import {
  FactorEmailLink,
  FactorNonOIDC,
  FactorOIDC,
  FactorOTP,
  FactorOTPEmail,
  FactorOTPSms,
  FactorSmsLink,
  Handle,
  HandleType,
} from "./types";

const FACTORS_WITH_EMAIL = ["webauthn", "otp_via_email", "email_link"];
const FACTORS_WITH_PHONE = ["otp_via_sms", "sms_link"];

function getHandleType(factor: Factor): HandleType | null {
  if (FACTORS_WITH_EMAIL.includes(factor.method)) {
    return "email_address";
  }

  if (FACTORS_WITH_PHONE.includes(factor.method)) {
    return "phone_number";
  }

  return null;
}

/**
 * Returns the handle types to be used based on the given factors.
 */
export function getHandleTypes(factors: Factor[]): HandleType[] {
  const handleTypes = new Set<HandleType>();

  factors.forEach((f) => {
    const handleType = getHandleType(f);
    if (handleType) {
      handleTypes.add(handleType);
    }
  });

  return Array.from(handleTypes);
}

/**
 * Returns the auth methods that require the provided handle type
 */
export function filterFactors(factors: Factor[], handleType: HandleType) {
  return factors.filter((f) => getHandleType(f) === handleType);
}

export function isFactorOTPEmail(factor: Factor): factor is FactorOTPEmail {
  return factor.method === "otp_via_email";
}

export function isFactorOTPSms(factor: Factor): factor is FactorOTPSms {
  return factor.method === "otp_via_sms";
}

export function isFactorOTP(factor: Factor): factor is FactorOTP {
  return isFactorOTPEmail(factor) || isFactorOTPSms(factor);
}

export function isFactorOidc(factor: Factor): factor is FactorOIDC {
  return factor.method === "oidc";
}

export function isFactorEmailLink(factor: Factor): factor is FactorEmailLink {
  return factor.method === "email_link";
}

export function isFactorSmsLink(factor: Factor): factor is FactorSmsLink {
  return factor.method === "sms_link";
}

export function isFactorNonOidc(factor: Factor): factor is FactorNonOIDC {
  return factor.method !== "oidc";
}

export function hasOidcAndNonOidcFactors(factors: Factor[]): boolean {
  return factors.some(isFactorOidc) && factors.some((f) => !isFactorOidc(f));
}

export function resolveLastHandleValue(
  handle: Handle | undefined,
  handleType: HandleType
): string | undefined {
  if (!handle || handle.type !== handleType) {
    return undefined;
  }

  return handle.value;
}

export type ParsedPhoneNumber = {
  dialCode: string;
  number: string;
  countryCode: string;
};

export function parsePhoneNumber(
  number: string
): ParsedPhoneNumber | undefined {
  for (const flag of getList()) {
    if (number.startsWith(flag.dial_code)) {
      return {
        dialCode: flag.dial_code,
        number: number.substring(flag.dial_code.length).trim(),
        countryCode: findFlagByDialCode(flag.dial_code).code,
      };
    }
  }
}

export type AuthenticatingMessage = {
  title: TextConfigKey;
  message: TextConfigKey;
};
export function getAuthenticatingMessage(
  factor: Factor,
  isSubmitting = false
): AuthenticatingMessage {
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
