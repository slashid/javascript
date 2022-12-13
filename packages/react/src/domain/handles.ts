import { Handle } from "./types";
import { Factor } from "@slashid/slashid";

type HandleType = Handle["type"];

const FACTORS_WITH_EMAIL = ["webauthn", "email_link"];
const FACTORS_WITH_PHONE = ["otp_via_sms", "sms_link"];

/**
 * Returns the handle types to be used based on the given factors.
 */
export function getHandleTypes(factors: Factor[]): HandleType[] {
  const handleTypes = new Set<HandleType>();

  factors.forEach((f) => {
    if (FACTORS_WITH_EMAIL.includes(f.method)) {
      handleTypes.add("email_address");
    }

    if (FACTORS_WITH_PHONE.includes(f.method)) {
      handleTypes.add("phone_number");
    }
  });

  return Array.from(handleTypes);
}
