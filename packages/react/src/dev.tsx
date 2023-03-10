import React from "react";
import ReactDOM from "react-dom/client";
import { Form } from "./components/form";
import { SlashIDProvider, LoggedIn, LoggedOut } from "./main";
import { ConfigurationProvider, MFAProvider } from "./context/config-context";

import type { Factor } from "@slashid/slashid";

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

const mfaFactors: Factor[] = [
  {method: "sms_link"}
]

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
          <LoggedOut>
          <Form />
          </LoggedOut>
          <LoggedIn>
            <MFAProvider 
            text={{
              "initial.title": "MFA"
            }}
            factors={mfaFactors}
            >
              <Form />
            </MFAProvider>
          </LoggedIn>
        </div>
      </ConfigurationProvider>
    </SlashIDProvider>
  </React.StrictMode>
);
