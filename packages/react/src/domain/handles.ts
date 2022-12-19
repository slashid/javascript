import { HandleType } from "./types";
import { Factor } from "@slashid/slashid";

const FACTORS_WITH_EMAIL = ["webauthn", "email_link"];
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

export function isFactorOidc(factor: Factor) {
  return factor.method === "oidc";
}
