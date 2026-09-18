import {
  AuthnContextUpdateChallengeReceivedEvent,
  User,
} from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect } from "vitest";
import { Form } from "..";
import { TextConfig } from "../../text/constants";
import { createTestUser, MockSlashID } from "../../test-utils";
import { TestSlashIDProvider } from "../../../context/test-providers";
import { ConfigurationProvider } from "../../../context/config-context";
import { FactorConfiguration } from "../../../domain/types";

function renderForm(
  factors: FactorConfiguration[],
  text?: Partial<TextConfig>
) {
  let resolveLogin: ((u: User) => void) | undefined;
  const sid = new MockSlashID({ oid: "oid", analyticsEnabled: false });
  const logIn = vi.fn(() => {
    sid.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "oid",
      factor: factors[0] as AuthnContextUpdateChallengeReceivedEvent["factor"],
    });
    return new Promise<User>((resolve) => {
      resolveLogin = resolve;
    });
  });

  render(
    <TestSlashIDProvider sid={sid} sdkState="ready" logIn={logIn}>
      <ConfigurationProvider factors={factors} text={text}>
        <Form />
      </ConfigurationProvider>
    </TestSlashIDProvider>
  );

  return { finishLogin: () => resolveLogin?.(createTestUser()) };
}

async function clickAndReadAuthenticatingTitle(buttonName: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: buttonName }));
  return screen.findByRole("heading", { level: 1 });
}

const github: FactorConfiguration = {
  method: "oidc",
  options: { provider: "github", client_id: "github" },
};

const saml: FactorConfiguration = {
  method: "saml",
  options: { provider_credentials_id: "saml-1" },
};

describe("SSO provider names", () => {
  test("renders the default OIDC provider name on the initial button and the authenticating title", async () => {
    const { finishLogin } = renderForm([github]);

    expect(
      screen.getByRole("button", { name: "Sign in with GitHub" })
    ).toBeInTheDocument();

    const title = await clickAndReadAuthenticatingTitle("Sign in with GitHub");
    expect(title).toHaveTextContent("Sign in with GitHub");

    finishLogin();
  });

  test("renders an overridden OIDC provider name in both places", async () => {
    const { finishLogin } = renderForm([github], {
      "provider.github": "Octocat",
    });

    expect(
      screen.getByRole("button", { name: "Sign in with Octocat" })
    ).toBeInTheDocument();

    const title = await clickAndReadAuthenticatingTitle("Sign in with Octocat");
    expect(title).toHaveTextContent("Sign in with Octocat");

    finishLogin();
  });

  test("prefers the factor label over the overridden provider name", async () => {
    const { finishLogin } = renderForm([{ ...github, label: "Work GitHub" }], {
      "provider.github": "Octocat",
    });

    expect(
      screen.getByRole("button", { name: "Sign in with Work GitHub" })
    ).toBeInTheDocument();

    const title = await clickAndReadAuthenticatingTitle(
      "Sign in with Work GitHub"
    );
    expect(title).toHaveTextContent("Sign in with Work GitHub");

    finishLogin();
  });

  test("renders the default SAML name in both places", async () => {
    const { finishLogin } = renderForm([saml]);

    expect(
      screen.getByRole("button", { name: "Sign in with SAML" })
    ).toBeInTheDocument();

    const title = await clickAndReadAuthenticatingTitle("Sign in with SAML");
    expect(title).toHaveTextContent("Sign in with SAML");

    finishLogin();
  });

  test("renders an overridden SAML name in both places", async () => {
    const { finishLogin } = renderForm([saml], { "provider.saml": "Corp SSO" });

    expect(
      screen.getByRole("button", { name: "Sign in with Corp SSO" })
    ).toBeInTheDocument();

    const title = await clickAndReadAuthenticatingTitle(
      "Sign in with Corp SSO"
    );
    expect(title).toHaveTextContent("Sign in with Corp SSO");

    finishLogin();
  });

  test("prefers the SAML factor label over the overridden SAML name", async () => {
    const { finishLogin } = renderForm([{ ...saml, label: "Acme" }], {
      "provider.saml": "Corp SSO",
    });

    expect(
      screen.getByRole("button", { name: "Sign in with Acme" })
    ).toBeInTheDocument();

    const title = await clickAndReadAuthenticatingTitle("Sign in with Acme");
    expect(title).toHaveTextContent("Sign in with Acme");

    finishLogin();
  });
});
