import { useMemo } from "react";
import { Factor } from "@slashid/slashid";
import { Divider } from "@slashid/react-primitives";

import { FormProvider } from "../../context/form-context";
import { InitialState } from "../form/flow";
import { Logo } from "../form/initial/logo";
import { Oidc } from "../form/initial/oidc";
import { Text } from "../text";
import { useConfiguration } from "../../hooks/use-configuration";
import { ConfiguredHandleForm } from "./configured-handle-form";
import { FactorLabeledOIDC, Handle, LoginOptions } from "../../domain/types";
import { isFactorOidc } from "../../domain/handles";

import * as styles from "./dynamic-flow.css";

type Props = {
  flowState: InitialState;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  middleware?: LoginOptions["middleware"];
};

export const Initial = ({ flowState, handleSubmit, middleware }: Props) => {
  const { logo, text, factors } = useConfiguration();
  const oidcFactors: FactorLabeledOIDC[] = useMemo(
    () => factors.filter(isFactorOidc),
    [factors]
  );
  const shouldRenderDivider = oidcFactors.length > 0;

  return (
    <div
      data-testid="sid-dynamic-flow--initial-state"
      className="sid-dynamic-flow--initial-state"
    >
      <Logo logo={logo} />
      <div className={styles.header}>
        <Text
          as="h1"
          t="initial.title"
          variant={{ size: "2xl-title", weight: "bold" }}
        />
        <Text
          as="h2"
          t="initial.subtitle"
          variant={{ color: "contrast", weight: "semibold" }}
        />
      </div>
      <FormProvider>
        <ConfiguredHandleForm handleSubmit={handleSubmit} />
      </FormProvider>
      {shouldRenderDivider && <Divider>{text["initial.divider"]}</Divider>}
      <Oidc
        providers={oidcFactors}
        handleClick={(factor) =>
          flowState.logIn(
            {
              factor,
              handle: undefined,
            },
            { middleware }
          )
        }
      />
    </div>
  );
};
