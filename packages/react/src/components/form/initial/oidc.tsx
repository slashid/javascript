import { Factor, OAuthProvider } from "@slashid/slashid";
import clsx from "clsx";
import { FactorLabeledOIDC } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { sprinkles } from "../../../theme/sprinkles.css";
import { Button } from "../../button";
import { Apple } from "../../icon/apple";
import { AzureAD } from "../../icon/azuread";
import { Bitbucket } from "../../icon/bitbucket";
import { Facebook } from "../../icon/facebook";
import { Github } from "../../icon/github";
import { Gitlab } from "../../icon/gitlab";
import { Google } from "../../icon/google";
import { Line } from "../../icon/line";

import * as styles from "./initial.css";

const PROVIDER_TO_ICON: Record<OAuthProvider, React.ReactNode> = {
  google: <Google />,
  // apple: <Apple />,
  facebook: <Facebook />,
  github: <Github />,
  gitlab: <Gitlab />,
  line: <Line />,
  bitbucket: <Bitbucket />,
  azuread: <AzureAD />,
};

const PROVIDER_TO_PRETTY_NAME: Record<OAuthProvider, string> = {
  google: "Google",
  // apple: "Apple",
  facebook: "Facebook",
  github: "GitHub",
  gitlab: "GitLab",
  line: "LINE",
  bitbucket: "Bitbucket",
  azuread: "Azure AD"
}

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
