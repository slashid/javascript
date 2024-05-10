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

export const isValidUsername: ValidatorFn<string> = (value) => {
  if (typeof value !== "string" || value === "") {
    return false;
  }

  // TODO get this in sync with the BE
  return value.length <= 128;
};

export const isValidOTPCode: ValidatorFn<string> = (value) => {
  if (Number.isNaN(Number(value)) || value.length !== OTP_CODE_LENGTH) {
    return false;
  }

  return true;
};

export function getValidationMessageKey(
  errorEvent: InvalidPasswordSubmittedEvent
): TextConfigKey {
  const textKey = `authenticating.setPassword.validation.${errorEvent.failedRules[0].name}`;

  // prefer the first error
  return textKey as TextConfigKey;
}

export function getValidationInterpolationTokens({
  errorEvent,
  password,
}: {
  errorEvent: InvalidPasswordSubmittedEvent;
  password: string;
}): Record<string, string> {
  const firstRuleToFail = errorEvent.failedRules[0];
  let failingValue = "";

  if (firstRuleToFail.matchType === "must_not_match") {
    const matchResult = firstRuleToFail.regexp.exec(password);
    failingValue = matchResult !== null ? matchResult[0] : "";
  }

  if (!failingValue) {
    return {};
  }

  return {
    ILLEGAL_SEQUENCE: failingValue,
  };
}
