import { Factor, RecoverableFactor } from "@slashid/slashid";
import {
  findFlagByDialCode,
  getList,
} from "country-list-with-dial-code-and-flag";
import {
  FactorEmailLink,
  FactorNonOIDC,
  FactorOIDC,
  FactorOTP,
  FactorOTPEmail,
  FactorOTPSms,
  FactorPassword,
  FactorSSO,
  FactorSmsLink,
  FactorTOTP,
  FactorWithAllowedHandleTypes,
  HANDLE_TYPES,
  Handle,
  HandleType,
} from "./types";

const FACTORS_WITH_EMAIL = [
  "webauthn",
  "otp_via_email",
  "email_link",
  "password",
  "totp",
];
const FACTORS_WITH_PHONE = ["otp_via_sms", "sms_link", "password"];
// TODO: add TOTP later when available
const FACTORS_WITH_USERNAME = ["password"];
const SSO_FACTORS = ["oidc", "saml"];

function isFactorWithAllowedHandleTypes(
  factor: Factor
): factor is FactorWithAllowedHandleTypes {
  // check if factor has `allowedHandleTypes` property
  if (!("allowedHandleTypes" in factor)) {
    return false;
  }

  // check if the values in `allowedHandleTypes` array are correct
  return (factor as FactorWithAllowedHandleTypes).allowedHandleTypes!.every(
    (handleType) => {
      return HANDLE_TYPES.includes(handleType);
    }
  );

  return true;
}

function isHandleTypeAllowed(
  factor: Factor | FactorWithAllowedHandleTypes,
  handleType: HandleType
): boolean {
  if (!isFactorWithAllowedHandleTypes(factor)) {
    // usernames are opt in so no allowed handle types means it's not allowed, eg email and phone handles are allowed
    return handleType !== "username";
  }

  return factor.allowedHandleTypes!.includes(handleType);
}

function getPossibleHandleTypes(
  factor: Factor | FactorWithAllowedHandleTypes
): Set<HandleType> {
  const handleTypes = new Set<HandleType>();

  if (
    FACTORS_WITH_EMAIL.includes(factor.method) &&
    isHandleTypeAllowed(factor, "email_address")
  ) {
    handleTypes.add("email_address");
  }

  if (
    FACTORS_WITH_PHONE.includes(factor.method) &&
    isHandleTypeAllowed(factor, "phone_number")
  ) {
    handleTypes.add("phone_number");
  }

  if (
    FACTORS_WITH_USERNAME.includes(factor.method) &&
    isHandleTypeAllowed(factor, "username")
  ) {
    handleTypes.add("username");
  }

  return handleTypes;
}

/**
 * Returns the handle types to be used based on the given factors.
 */
export function getHandleTypes(factors: Factor[]): HandleType[] {
  const handleTypes = new Set<HandleType>();

  factors.forEach((f) => {
    getPossibleHandleTypes(f).forEach((handleType) =>
      handleTypes.add(handleType)
    );
  });

  return Array.from(handleTypes);
}

/**
 * Returns the auth methods that require the provided handle type
 */
export function filterFactors(factors: Factor[], handleType: HandleType) {
  return factors.filter((factor) =>
    getHandleTypes([factor]).includes(handleType)
  );
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

export function isFactorRecoverable(
  factor: Factor
): factor is RecoverableFactor {
  // TODO check if this can be exposed from the core SDK or a better check can be made
  return isFactorPassword(factor);
}

export function isFactorPassword(factor: Factor): factor is FactorPassword {
  return factor.method === "password";
}

export function isFactorOidc(factor: Factor): factor is FactorOIDC {
  return factor.method === "oidc";
}

export function isFactorSSO(factor: Factor): factor is FactorSSO {
  return SSO_FACTORS.includes(factor.method);
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

export function isFactorTOTP(factor: Factor): factor is FactorTOTP {
  return factor.method === "totp";
}

export function hasOidcAndNonOidcFactors(factors: Factor[]): boolean {
  return factors.some(isFactorOidc) && factors.some((f) => !isFactorOidc(f));
}

export function hasSSOAndNonSSOFactors(factors: Factor[]): boolean {
  return factors.some(isFactorSSO) && factors.some((f) => !isFactorSSO(f));
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

export const NULL_FACTOR: Factor = {
  method: "email_link",
};
