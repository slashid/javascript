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
  SlashIDProvider,
  useOrganizations,
} from "./main";
import { defaultOrganization } from "./middleware/default-organization";

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
        forceOpen
        necessaryCookiesRequired
        defaultRejectAllLevels={["none", "necessary"]}
        className="gdprConsentDialogClass"
        triggerClassName="gdprConsentDialogTriggerClass"
        onSuccess={(consentLevels) =>
          console.log("onSuccess - consentLevels:", consentLevels)
        }
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider
      oid={import.meta.env.VITE_ORG_ID}
      themeProps={{ theme: "dark", className: "testClass" }}
      tokenStorage="localStorage"
      baseApiUrl="https://api.slashid.com"
    >
      <div className="layout">
        <div>
          <h2>Switch to default org</h2>
          <Config />
        </div>
        <div>
          <h2>Dynamic flow - factor based on handle</h2>
          <ConfiguredDynamicFlow />
        </div>
      </div>
    </SlashIDProvider>
  </React.StrictMode>
);
