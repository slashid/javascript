import { describe, test, expect } from "vitest";
import { TEXT } from "./constants";
import { getProviderName } from "./provider-name";

describe("getProviderName", () => {
  test("uses the factor label when present", () => {
    expect(
      getProviderName(TEXT, {
        method: "oidc",
        options: { provider: "github", client_id: "id" },
        label: "Work GitHub",
      })
    ).toBe("Work GitHub");
  });

  test("uses the provider text key when there is no label", () => {
    expect(
      getProviderName(
        { ...TEXT, "provider.github": "Octocat" },
        { method: "oidc", options: { provider: "github", client_id: "id" } }
      )
    ).toBe("Octocat");
  });

  test("falls back to the raw provider id for an unknown provider", () => {
    expect(
      getProviderName(TEXT, {
        method: "oidc",
        // @ts-expect-error unknown provider id
        options: { provider: "unknown-idp", client_id: "id" },
      })
    ).toBe("unknown-idp");
  });

  test("uses the saml text key for saml factors", () => {
    expect(
      getProviderName(
        { ...TEXT, "provider.saml": "Corp SSO" },
        { method: "saml", options: { provider_credentials_id: "id" } }
      )
    ).toBe("Corp SSO");
  });
});
