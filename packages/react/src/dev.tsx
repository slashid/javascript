import type { Factor } from "@slashid/slashid";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { MultiFactorAuth } from "./components/multi-factor-auth";
import { SlashIDProvider } from "./context/slash-id-context";
import { ConfigurationProvider } from "./context/config-context";

import "./dev.css";
import { useOrganizations } from "./hooks/use-organizations";
import { SlashIDLoaded } from "./main";

const Orgs = () => {
  const { status, data } = useOrganizations();

  // this will display the loading indicator even before the data fetches, can be fixed easily with a more accurate rendering condition
  if (status !== "success") {
    return <div>Loading...</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

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
      theme="dark"
      factors={factors}
      storeLastHandle={true}
    >
      <div className="formWrapper">
        <MultiFactorAuth
          steps={[{ factors: factors }, { factors: mfaFactors }]}
        />
      </div>
    </ConfigurationProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid={import.meta.env.VITE_ORG_ID}>
      <Config />
      <SlashIDLoaded>
        <Orgs />
      </SlashIDLoaded>
    </SlashIDProvider>
  </React.StrictMode>
);
