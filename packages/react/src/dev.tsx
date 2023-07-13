import type { Factor } from "@slashid/slashid";
import React from "react";
import ReactDOM from "react-dom/client";
import { SlashIDProvider } from "./context/slash-id-context";

import "./dev.css";
import { DynamicFlow } from "./main";

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
  console.log({ email, domain });

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

const DynamicConfig = () => {
  return <DynamicFlow className="formWrapper" getFactor={getFactor} />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid={import.meta.env.VITE_ORG_ID}>
      <DynamicConfig />
    </SlashIDProvider>
  </React.StrictMode>
);
