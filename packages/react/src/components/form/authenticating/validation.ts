import { InvalidPasswordSubmittedEvent } from "@slashid/slashid";
import { TextConfigKey } from "../../text/constants";

type ValidatorFn<T> = (value: T) => boolean;

const EMAIL_REGEX = new RegExp(
  "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"
);

export const OTP_CODE_LENGTH = 6;

export const isValidPhoneNumber: ValidatorFn<string> = (value) => {
  if (typeof value !== "string" || value === "") {
    return false;
  }

  return true;
};

export const isValidEmail: ValidatorFn<string> = (value) => {
  if (typeof value !== "string" || value === "") {
    return false;
  }

  return EMAIL_REGEX.test(value);
};

export const isValidOTPCode: ValidatorFn<string> = (value) => {
  if (Number.isNaN(Number(value)) || value.length !== OTP_CODE_LENGTH) {
    return false;
  }

  return true;
};

// TODO copied from the core SDK - consider exposing from there
export const PasswordValidationRuleName = {
  Length: "length",
  PasswordVariants: "password_variants",
  AdminVariants: "admin_variants",
  UserVariants: "user_variants",
  AlphanumericSequences1: "alphanumeric_sequences_1",
  AlphanumericSequences2: "alphanumeric_sequences_2",
  NumericSequencesAscending: "numeric_sequences_ascending",
  NumericSequencesDescending: "numeric_sequences_descending",
  NumericSubsequencesAscending: "numeric_subsequences_ascending",
  NumericSubsequencesDescending: "numeric_subsequences_descending",
  CommonPasswordXkcd: "common_password_xkcd",
} as const;

export function getValidationMessageKey(
  errorEvent: InvalidPasswordSubmittedEvent
): TextConfigKey {
  const textKey = `authenticating.setPassword.validation.${errorEvent.failedRules[0].name}`;

  // prefer the first error
  return textKey as TextConfigKey;
}
