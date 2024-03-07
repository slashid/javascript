import { Factor, OAuthProvider } from "@slashid/slashid";
import {
  Button,
  AzureAD,
  Bitbucket,
  Facebook,
  Github,
  Gitlab,
  Google,
  Line,
  Okta,
  sprinkles,
  otherPublicVariables,
} from "@slashid/react-primitives";
import clsx from "clsx";

import {
  FactorCustomizableSAML,
  FactorLabeledOIDC,
} from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";

import * as styles from "./initial.css";

const PROVIDER_TO_ICON: Record<OAuthProvider, React.ReactNode> = {
  google: <Google />,
  facebook: <Facebook />,
  github: <Github />,
  gitlab: <Gitlab />,
  line: <Line />,
  bitbucket: <Bitbucket />,
  azuread: <AzureAD />,
  okta: <Okta />,
};

const PROVIDER_TO_PRETTY_NAME: Record<OAuthProvider, string> = {
  google: "Google",
  facebook: "Facebook",
  github: "GitHub",
  gitlab: "GitLab",
  line: "LINE",
  bitbucket: "Bitbucket",
  azuread: "Azure AD",
  okta: "Okta",
};

export type SAMLProviderProps = {
  provider: FactorCustomizableSAML;
  handleClick: (factor: Factor) => void;
};

export function SAMLProvider({ provider: p, handleClick }: SAMLProviderProps) {
  const { text } = useConfiguration();

  if (!p.options?.provider_credentials_id) {
    return null;
  }

  return (
    <Button
      onClick={() => handleClick({ method: "saml", options: p.options })}
      variant="secondary"
      icon={<Logo logo={p.logo} id={p.options.provider_credentials_id} />}
      className={clsx("sid-saml--button")}
    >
      {text["initial.sso"]}
      <span className={styles.ssoProvider}>{p.label || "SAML"}</span>
    </Button>
  );
}

type LogoProps = {
  id: string;
  logo?: FactorCustomizableSAML["logo"];
};

function Logo({ logo, id }: LogoProps) {
  if (!logo) return null;

  if (typeof logo === "string") {
    return (
      <img
        className={clsx("sid-sso-logo", `sid-sso-logo--${id}`, styles.ssoLogo)}
        src={logo}
        alt="SSO provider logo"
      />
    );
  }

  return (
    <div
      className={clsx("sid-sso-logo", `sid-sso-logo--${id}`, styles.ssoLogo)}
    >
      {logo}
    </div>
  );
}

export type OIDCProviderProps = {
  provider: FactorLabeledOIDC;
  handleClick: (factor: Factor) => void;
};

export function OIDCProvider({ provider: p, handleClick }: OIDCProviderProps) {
  const { text } = useConfiguration();

  if (!p.options?.provider) {
    return null;
  }

  return (
    <Button
      onClick={() => handleClick({ method: "oidc", options: p.options })}
      variant="secondary"
      icon={PROVIDER_TO_ICON[p.options?.provider]}
      className={clsx("sid-oidc--button")}
    >
      {text["initial.oidc"]}
      <span className={styles.oidcProvider}>
        {p.label || PROVIDER_TO_PRETTY_NAME[p.options?.provider]}
      </span>
    </Button>
  );
}

type Props = {
  providers: Array<FactorLabeledOIDC | FactorCustomizableSAML>;
  handleClick: (factor: Factor) => void;
};

export function SSOProviders({ providers, handleClick }: Props) {
  if (!providers.length) {
    return null;
  }

  return (
    <div
      className={clsx(
        "sid-form-sso",
        sprinkles({ marginTop: "4" }),
        styles.oidcList
      )}
      style={{
        marginTop: otherPublicVariables.formSsoMarginTop,
      }}
    >
      {providers.map((p) => {
        switch (p.method) {
          case "oidc":
            return (
              <OIDCProvider
                key={p.options?.client_id}
                provider={p}
                handleClick={handleClick}
              />
            );
          case "saml":
            return (
              <SAMLProvider
                key={p.options?.provider_credentials_id}
                provider={p}
                handleClick={handleClick}
              />
            );
          default:
            throw new Error("unsupported SSO method");
        }
      })}
    </div>
  );
}
