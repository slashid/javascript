import type { Factor } from "@slashid/slashid";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import "./dev.css";
import {
  Form,
  LoggedIn,
  LoggedOut,
  ConfigurationProvider,
  OrganizationSwitcher,
  useOrganizations,
  SlashIDProvider,
} from "./main";

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

const withWan: Factor[] = [
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
];

const mfaFactors: Factor[] = [{ method: "otp_via_sms" }];

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
    <ConfigurationProvider
      theme="light"
      factors={factors}
      storeLastHandle={true}
    >
      <LoggedOut>
        <div className="formWrapper">
          {/* <MultiFactorAuth
            steps={[{ factors: factors }, { factors: mfaFactors }]}
          /> */}
          <Form />
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
    </ConfigurationProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider
      oid="b6f94b67-d20f-7fc3-51df-bf6e3b82683e"
      tokenStorage="localStorage"
      baseApiUrl="https://api.slashid.com"
      defaultOrganization={(orgs) => {
        const preferred = orgs.find((org) => org.org_name === "MyOrg/abc2");
        if (preferred) return preferred.id;

        return "b6f94b67-d20f-7fc3-51df-bf6e3b82683e"; // orgs[0].id
      }}
    >
      <Config />
    </SlashIDProvider>
  </React.StrictMode>
);
