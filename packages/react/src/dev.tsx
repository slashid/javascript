import { type Factor } from "@slashid/slashid";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { GDPRConsentDialog } from "./components/gdpr-consent-dialog";
import "./dev.css";
import { FactorConfiguration, Handle } from "./domain/types";
import {
  ConfigurationProvider,
  DynamicFlow,
  Form,
  LoggedIn,
  LoggedOut,
  OrganizationSwitcher,
  SlashIDLoaded,
  SlashIDProvider,
  useOrganizations,
  useSlashID,
} from "./main";
import { defaultOrganization } from "./middleware/default-organization";
import { Slot } from "./components/slot";

const rootOid = "b6f94b67-d20f-7fc3-51df-bf6e3b82683e";

const initialFactors: Factor[] = [
  { method: "email_link" },
  { method: "otp_via_sms" },
  {
    method: "oidc",
    options: {
      provider: "google",
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "test_oidc",
    },
  },
];

const withWan: FactorConfiguration[] = [
  { method: "webauthn", options: { attachment: "platform" } },
  { method: "email_link" },
  { method: "otp_via_sms" },
  {
    method: "oidc",
    options: {
      provider: "google",
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "test_oidc_1",
    },
  },
  {
    method: "oidc",
    label: "Google SSO - label test",
    options: {
      provider: "google",
      client_id: "test_oidc_2",
    },
  },
];

function Config() {
  const { currentOrganization } = useOrganizations();
  const [factors, setFactors] = useState<Factor[]>(initialFactors);

  useEffect(() => {
    const checkPlatformAuthenticator = async () => {
      try {
        const hasPlatformAuthenticator =
          await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (hasPlatformAuthenticator) {
          setFactors(withWan);
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkPlatformAuthenticator();
  }, []);

  return (
    <ConfigurationProvider factors={factors} storeLastHandle={true}>
      {/* <div className="formWrapper">
        <MultiFactorAuth
          steps={[
            { factors: [{ method: "email_link" }] },
            {
              factors: [{ method: "otp_via_sms" }],
              text: {
                "initial.title": "TEST TITLE MFA",
              },
            },
          ]}
        />
      </div> */}
      <LoggedOut>
        <div className="formWrapper">
          <Form
            middleware={[
              defaultOrganization(({ organizations }) => {
                const preferred = organizations.find(
                  (org) => org.org_name === "MyOrg/abc2"
                );
                if (preferred) return preferred.id;

                return rootOid;
              }),
            ]}
          />
        </div>
      </LoggedOut>
      <LoggedIn>
        <>
          Current org: {currentOrganization?.org_name}
          <OrganizationSwitcher
            filter={(org) =>
              org.org_name.includes("abc") || org.org_name === "MyOrg"
            }
          />
        </>
      </LoggedIn>
      <GDPRConsentDialog
        forceConsent
        necessaryCookiesRequired
        defaultRejectAllLevels={["none", "necessary"]}
        className="gdprConsentDialogClass"
        triggerClassName="gdprConsentDialogTriggerClass"
        onSuccess={(consents) => console.log("onSuccess - consents:", consents)}
        onError={(error) => console.error(error)}
      />
    </ConfigurationProvider>
  );
}

const getFactor = (handle?: Handle) => {
  if (!handle || handle.type !== "email_address") {
    throw new Error("Only use email for demo!");
  }

  const email = handle?.value;
  const domain = email.split("@")[1];

  if (domain === "slashid.dev") {
    const oidcFactor: Factor = {
      method: "oidc",
      options: {
        provider: "google",
        client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "test_oidc",
      },
    };
    return oidcFactor;
  } else {
    const emailLinkFactor: Factor = { method: "email_link" };
    return emailLinkFactor;
  }
};

const ConfiguredDynamicFlow = () => {
  return (
    <ConfigurationProvider text={{ "initial.oidc": "Continue with" }}>
      <DynamicFlow className="formWrapper" getFactor={getFactor} />
    </ConfigurationProvider>
  );
};

const BasicForm = () => {
  return (
    <ConfigurationProvider
      factors={[
        { method: "webauthn" },
        { method: "email_link" },
        { method: "otp_via_email" },
        { method: "otp_via_sms" },
        { method: "password" },
        {
          method: "oidc",
          options: {
            provider: "okta",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "test_oidc",
          },
        },
        {
          method: "oidc",
          options: {
            provider: "apple",
            client_id: "test_apple_id",
          },
        },
        {
          method: "saml",
          options: {
            provider_credentials_id: "test_saml",
          },
          label: "SAML test",
          logo: "https://www.oasis-open.org/committees/download.php/29723/draft-saml-logo-03.png",
        },
      ]}
    >
      <SlashIDLoaded>
        <>
          <LoggedIn>Logged in!</LoggedIn>
          <LoggedOut>
            <Form
              onError={(error, context) =>
                console.log("onError", { error, context })
              }
            />
          </LoggedOut>
        </>
      </SlashIDLoaded>
    </ConfigurationProvider>
  );
};

const ComposedForm = () => {
  return (
    <ConfigurationProvider
      factors={[
        { method: "webauthn" },
        { method: "email_link" },
        { method: "otp_via_email" },
        { method: "otp_via_sms" },
        {
          method: "oidc",
          options: {
            provider: "google",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "test_oidc",
          },
        },

        {
          method: "saml",
          options: {
            provider_credentials_id: "test_saml",
          },
        },
      ]}
    >
      <SlashIDLoaded>
        <>
          <LoggedIn>Logged in!</LoggedIn>
          <LoggedOut>
            <Form>
              <Slot name="initial">
                <Form.Initial.Logo />
                <Form.Initial.Header />
                <h1>What a mess!</h1>
                <p>Some text on top of the form</p>
                <Form.Initial.Controls>
                  <h2>Controls should be here</h2>
                  <Form.Initial.Controls.Input />
                  <p>Text below controls, on top of the submit button</p>
                  <Form.Initial.Controls.Submit />
                  <p>Text right below the submit button</p>
                </Form.Initial.Controls>
                <Form.Initial.SSO />
                <p>Some text below the form</p>
              </Slot>
              <Slot name="error">
                <Form.Error>
                  {({ context, retry, cancel }) => (
                    <div>
                      <h1>{context.error.message}</h1>
                      <button onClick={retry}>Retry</button>
                      <button onClick={cancel}>Cancel</button>
                    </div>
                  )}
                </Form.Error>
              </Slot>
              <Slot name="footer">
                <p>
                  Some footer text with a{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.google.com"
                  >
                    link
                  </a>
                </p>
              </Slot>
            </Form>
          </LoggedOut>
        </>
      </SlashIDLoaded>
    </ConfigurationProvider>
  );
};

const vars = {
  "--sid-input-border-radius": "32px",
  "--sid-input-label-color": "yellow",
  "--sid-button-border-radius": "32px",
  "--sid-input-border-color": "red",
  "--sid-color-primary": "red",
} as React.CSSProperties;

/* const checkatradeVars = {
  "--sid-color-primary": "#0058A2",
  "--sid-button-border-radius": "4px",
  "--sid-input-border-radius": "4px",
  "--sid-input-border-color": "#EDEDED",
  "--sid-input-label-color": "#62687A",
  "--sid-form-logo-width": "150px",
  "--sid-form-border-radius": "0px",
} as React.CSSProperties; */

const LogOut = () => {
  const { logOut } = useSlashID();
  return (
    <LoggedIn>
      <button onClick={() => logOut()}>Log out</button>
    </LoggedIn>
  );
};

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <SlashIDProvider
      oid={import.meta.env.VITE_ORG_ID}
      themeProps={{ theme: "dark" }}
      tokenStorage="memory"
      analyticsEnabled
      anonymousUsersEnabled
      environment="sandbox"
    >
      <LogOut />
      <div className="layout">
        <div>
          <div>
            <h2>Basic form</h2>
            <BasicForm />
          </div>
        </div>
        <div></div>
      </div>
    </SlashIDProvider>
  </React.StrictMode>
);
