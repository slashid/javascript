import { Factor } from "@slashid/slashid";
import clsx from "clsx";
import { FactorOIDC } from "../../../domain/types";
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
import { stack } from "../../stack/stack.css";

import * as styles from "./initial.css";

const PROVIDER_TO_ICON: Record<string, React.ReactNode> = {
  google: <Google />,
  apple: <Apple />,
  facebook: <Facebook />,
  github: <Github />,
  gitlab: <Gitlab />,
  line: <Line />,
  bitbucket: <Bitbucket />,
  azuread: <AzureAD />,
};

type Props = {
  providers: FactorOIDC[];
  handleClick: (factor: Factor) => void;
};

export const Oidc: React.FC<Props> = ({ providers, handleClick }) => {
  const { text } = useConfiguration();
  if (!providers.length) {
    return null;
  }

  return (
    <div className={clsx(stack, sprinkles({ marginTop: "4" }))}>
      {providers.map((p) => {
        if (!p.options?.provider) {
          return null;
        }

        return (
          <Button
            key={p.options?.provider}
            onClick={() => handleClick({ method: "oidc", options: p.options })}
            variant="secondary"
            icon={PROVIDER_TO_ICON[p.options?.provider]}
          >
            {text["initial.oidc"]}
            <span className={styles.oidcProvider}>{p.options?.provider}</span>
          </Button>
        );
      })}
    </div>
  );
};
