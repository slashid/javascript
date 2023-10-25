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
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
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
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
    },
  },
  {
    method: "oidc",
    label: "Google SSO - label test",
    options: {
      provider: "google",
      client_id: "TEST",
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
        client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
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
        { method: "email_link" },
        { method: "otp_via_email" },
        { method: "webauthn" },
        { method: "otp_via_sms" },
        {
          method: "oidc",
          options: {
            provider: "okta",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
          },
        },
      ]}
    >
      <SlashIDLoaded>
        <>
          <LoggedIn>Logged in!</LoggedIn>
          <LoggedOut>
            <Form />
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
        { method: "email_link" },
        { method: "otp_via_email" },
        { method: "otp_via_sms" },
        {
          method: "oidc",
          options: {
            provider: "google",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
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
                <Form.Initial.OIDC />
                <p>Some text below the form</p>
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider
      oid="00000000-0000-0000-1400-000000000000"
      themeProps={{ theme: "dark", className: "testClass" }}
      baseApiUrl="https://slashid.local"
    >
      <div className="layout">
        <div>
          <div>
            <h2>Basic form</h2>
            <BasicForm />
          </div>
          <div>
            <h2>Composed form</h2>
            <ComposedForm />
          </div>
        </div>
        <div>
          <div>
            <h2>Switch to default org</h2>
            <Config />
          </div>
          <div>
            <h2>Dynamic flow - factor based on handle</h2>
            <ConfiguredDynamicFlow />
          </div>
        </div>
      </div>
    </SlashIDProvider>
  </React.StrictMode>
);
