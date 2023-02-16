import {
  getHandleTypes,
  hasOidcAndNonOidcFactors,
  parsePhoneNumber,
  ParsedPhoneNumber,
} from "./handles";

const phoneNumbersTestData: {
  raw: string;
  parsed: ParsedPhoneNumber | undefined;
}[] = [
  {
    raw: "+48123123123",
    parsed: { dialCode: "+48", number: "123123123", countryCode: "PL" },
  },
  {
    raw: "+14155552671",
    parsed: { dialCode: "+1", number: "4155552671", countryCode: "US" },
  },
  {
    raw: "+447912345678",
    parsed: { dialCode: "+44", number: "7912345678", countryCode: "GB" },
  },
  {
    raw: "+81312345678",
    parsed: { dialCode: "+81", number: "312345678", countryCode: "JP" },
  },
  {
    raw: "+85261234567",
    parsed: { dialCode: "+852", number: "61234567", countryCode: "HK" },
  },
  { raw: "48123123123", parsed: undefined },
  { raw: "test", parsed: undefined },
];

describe("handles", () => {
  describe("getHandleTypes", () => {
    test("should include email address only once if multiple factors with email are present", () => {
      const handleTypes = getHandleTypes([
        { method: "webauthn" },
        { method: "email_link" },
      ]);

      expect(handleTypes).toEqual(["email_address"]);
    });

    test("should include phone number only once if multiple factors with phone number are present", () => {
      const handleTypes = getHandleTypes([
        { method: "sms_link" },
        { method: "otp_via_sms" },
      ]);

      expect(handleTypes).toEqual(["phone_number"]);
    });

    test("should include both phone number and email address given the factors", () => {
      const handleTypes = getHandleTypes([
        { method: "sms_link" },
        { method: "email_link" },
      ]);

      expect(handleTypes).toEqual(["phone_number", "email_address"]);
    });

    test("should ignore OIDC as it does not require a handle", () => {
      const handleTypes = getHandleTypes([
        { method: "oidc" },
        { method: "email_link" },
      ]);

      expect(handleTypes).toEqual(["email_address"]);
    });
  });

  describe("hasOidcAndNonOidcFactors", () => {
    test("should return false when only non-OIDC factors are present", () => {
      const factors = [{ method: "email_link" }, { method: "webauthn" }];

      // @ts-expect-error
      expect(hasOidcAndNonOidcFactors(factors)).toBe(false);
    });

    test("should return false when only OIDC factors are present", () => {
      const factors = [
        { method: "oidc", options: { provider: "facebook" } },
        { method: "oidc", options: { provider: "github" } },
      ];

      // @ts-expect-error
      expect(hasOidcAndNonOidcFactors(factors)).toBe(false);
    });

    test("should return true when both OIDC and non-OIDC factors are present", () => {
      const factors = [
        { method: "email_link" },
        { method: "webauthn" },
        { method: "oidc", options: { provider: "facebook" } },
        { method: "oidc", options: { provider: "github" } },
      ];

      // @ts-expect-error
      expect(hasOidcAndNonOidcFactors(factors)).toBe(true);
    });
  });

  describe("parsePhoneNumber", () => {
    test("should be parsed to expected values", () => {
      phoneNumbersTestData.forEach(({ raw, parsed }) => {
        expect(parsePhoneNumber(raw)).toStrictEqual(parsed);
      });
    });
  });
});
