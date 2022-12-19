import { getHandleTypes } from "./handles";

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
});
