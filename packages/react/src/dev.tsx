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
      logo="https://membersapp.checkatrade.com/static/media/logo.e930e0049182a5b0e5bf.png"
      factors={[
        // { method: "webauthn" },
        // { method: "email_link" },
        // { method: "otp_via_email" },
        // { method: "otp_via_sms" },
        { method: "password",  },
        {
          method: "oidc",
          label: "Facebook",
          options: {
            provider: "facebook",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "text2",
          },
        },
        {
          method: "oidc",
          options: {
            provider: "google",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID ?? "test_oidc",
          },
        },
        // {
        //   method: "saml",
        //   options: {
        //     provider_credentials_id: "test_saml",
        //   },
        //   label: "SAML test",
        //   logo: "https://www.oasis-open.org/committees/download.php/29723/draft-saml-logo-03.png",
        // },
      ]}
    >
      <SlashIDLoaded>
        <>
          <LoggedIn>Logged in!</LoggedIn>
          <LoggedOut>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""></link>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"></link>
            <style>{`
              // body {
              //   --sid-form-logo-margin-bottom: default 16px;
              //   --sid-form-logo-width: auto;
              //   --sid-form-border-radius: 32px;
              //   --sid-form-button-primary-color: #2A6AFF;
              //   --sid-form-button-border-radius: 16px;
              //   --sid-form-sso-margin-top: 16px;

              //   /*input*/
              //   --sid-input-border-radius: 16px;
              //   --sid-input-border-color: #F1F2F4;
              //   --sid-input-label-color: #454C6B;

              //   /*root*/
              //   --sid-form-font-family: 'Inter', sans-serif;
              //   --sid-form-color-foreground: #142049;
              // }

              .sid-form {
                /*form and sub-elements*/
                --sid-form-logo-margin-bottom: 32px;
                --sid-form-logo-width: 150px;
                --sid-form-border-radius: 0;
                --sid-form-button-primary-color: #0058A2;
                --sid-form-button-border-radius: 4px;
                --sid-form-sso-margin-top: 240px;
                --sid-form-font-family: 'Open Sans', sans-serif;
                --sid-form-color-foreground: #171717;
                --sid-form-divider-display: none;

                /*input*/
                --sid-input-border-radius: 4px;
                --sid-input-border-color: #EDEDED;
                --sid-input-label-color: #62687A;
              }
            `}</style>
            <Form text={{
              "initial.title": "Create Trade Account",
              "initial.subtitle": "",
              "initial.submit": "Create account",
              "footer.branding": "",
              "initial.handle.email.placeholder": ""
            }}>
            </Form>
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
      themeProps={{ theme: "light" }}
      baseApiUrl="https://api.slashid.com"
      sdkUrl="https://cdn.slashid.com/sdk.html"
      tokenStorage="memory"
      analyticsEnabled
    >
      <LogOut />
      <div className="layout">
        <div>
          <div>
            <h2>Basic form</h2>
            <BasicForm />
          </div>
          {/* <div>
            <h2>Composed form</h2>
            <ComposedForm />
          </div> */}
        </div>
        {/* <div>
          <div>
            <h2>Switch to default org</h2>
            <Config />
          </div>
          <div>
            <h2>Dynamic flow - factor based on handle</h2>
            <ConfiguredDynamicFlow />
          </div>
        </div> */}
      </div>
    </SlashIDProvider>
  </React.StrictMode>
);
