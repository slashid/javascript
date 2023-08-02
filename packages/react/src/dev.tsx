import type { Factor } from "@slashid/slashid";
import React, { Suspense, useEffect, useState } from "react";
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
  SlashIDLoaded,
  useSlashID,
} from "./main";

import { useAtom } from 'jotai'
import { user as userAtom } from './stores/user'
import { useOrganizationsA, useOrganizationsB } from "./hooks/poc";

const OrgsWithLoadable = () => {
  const { currentOrganization, isLoading } = useOrganizationsA();

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      A: {currentOrganization?.org_name}
    </div>
  )
};
const OrgsWithSuspense = () => {
  const { currentOrganization } = useOrganizationsB();

  return (
    <div>
      B: {currentOrganization?.org_name}
    </div>
  )
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

const SetUser = () => {
  const { user } = useSlashID()
  const [, set] = useAtom(userAtom)

  useEffect(() => {
    if (!user) return
    set(user)
  }, [user])

  return <></>
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
      {/* <Config /> */}
      <SetUser />
      <SlashIDLoaded>
        <>
          <OrgsWithLoadable />
          <Suspense fallback={<div>Loading...</div>}>
            <OrgsWithSuspense />
          </Suspense>
        </>
      </SlashIDLoaded>
    </SlashIDProvider>
  </React.StrictMode>
);
