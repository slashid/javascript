import type { Factor } from "@slashid/slashid";
import React from "react";
import ReactDOM from "react-dom/client";
import { MFA } from "./components/mfa";
import { SlashIDProvider } from "./context/slash-id-context";
import { ConfigurationProvider } from "./context/config-context";

import "./dev.css";

const factors = [
  { method: "email_link" },
  { method: "webauthn" },
  { method: "otp_via_sms" },
  {
    method: "oidc",
    options: {
      provider: "google",
      client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
    },
  },
  { method: "oidc", options: { provider: "facebook" } },
  { method: "oidc", options: { provider: "github" } },
];

const mfaFactors: Factor[] = [{ method: "otp_via_sms" }];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid={import.meta.env.VITE_ORG_ID}>
      <ConfigurationProvider
        theme="dark"
        // @ts-expect-error TODO fix the enum related problems
        factors={factors}
        storeLastHandle={true}
      >
        <div className="formWrapper">
          <MFA factors={mfaFactors} />
        </div>
      </ConfigurationProvider>
    </SlashIDProvider>
  </React.StrictMode>
);
