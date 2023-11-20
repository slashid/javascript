import React from "react";
import clsx from "clsx";
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
} from "@slashid/react-primitives";

import { FactorLabeledOIDC } from "../../../domain/types";
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
  // apple: "Apple",
  facebook: "Facebook",
  github: "GitHub",
  gitlab: "GitLab",
  line: "LINE",
  bitbucket: "Bitbucket",
  azuread: "Azure AD",
  okta: "Okta",
};

type Props = {
  providers: FactorLabeledOIDC[];
  handleClick: (factor: Factor) => void;
};

export const Oidc: React.FC<Props> = ({ providers, handleClick }) => {
  const { text } = useConfiguration();
  if (!providers.length) {
    return null;
  }

  return (
    <div className={clsx(sprinkles({ marginTop: "4" }), styles.oidcList)}>
      {providers.map((p) => {
        if (!p.options?.provider) {
          return null;
        }

        return (
          <Button
            key={p.options?.client_id}
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
      })}
    </div>
  );
};
