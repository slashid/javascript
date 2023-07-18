import type { Factor } from "@slashid/slashid";
import React from "react";
import ReactDOM from "react-dom/client";
import { SlashIDProvider } from "./context/slash-id-context";

import "./dev.css";
import { ConfigurationProvider, DynamicFlow } from "./main";
import { FactorOIDC } from "./domain/types";

/* const initialFactors: Factor[] = [
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
} */

const getFactor = (email: string) => {
  const domain = email.split("@")[1];

  if (domain === "slashid.dev") {
    return {
      method: "oidc",
      options: {
        provider: "google",
        client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
      },
    } as Factor;
  } else {
    return { method: "email_link" } as Factor;
  }
};

const oidcFactors: FactorOIDC[] = [
  {
    method: "oidc",
    options: {
      provider: "google",
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
    },
  },
  {
    method: "oidc",
    options: {
      provider: "azuread",
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
    },
  },
];

const DynamicConfig = () => {
  return (
    <ConfigurationProvider text={{ "initial.oidc": "Continue with" }}>
      <DynamicFlow
        className="formWrapper"
        getFactor={getFactor}
        oidcFactors={oidcFactors}
      />
    </ConfigurationProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid={import.meta.env.VITE_ORG_ID}>
      <DynamicConfig />
    </SlashIDProvider>
  </React.StrictMode>
);
