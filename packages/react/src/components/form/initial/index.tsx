import React, { useCallback, useMemo } from "react";
import { Factor } from "@slashid/slashid";

import { Text } from "../../text";
import { InitialState } from "../flow";
import { useConfiguration } from "../../../hooks/use-configuration";
import { FactorLabeledOIDC, Handle, LoginOptions } from "../../../domain/types";
import { isFactorOidc } from "../../../domain/handles";

import { Logo } from "./logo";
import { Oidc } from "./oidc";
import { ConfiguredHandleForm } from "./configured-handle-form";

type Props = {
  flowState: InitialState;
  lastHandle?: Handle;
  middleware?: LoginOptions["middleware"];
};

export const Initial: React.FC<Props> = ({
  flowState,
  lastHandle,
  middleware,
}) => {
  const { factors, logo } = useConfiguration();

  const oidcFactors: FactorLabeledOIDC[] = useMemo(
    () => factors.filter(isFactorOidc),
    [factors]
  );

  const handleSubmit = useCallback(
    (factor: Factor, handle?: Handle) => {
      flowState.logIn(
        {
          factor,
          handle,
        },
        { middleware }
      );
    },
    [flowState, middleware]
  );

  return (
    <article data-testid="sid-form-initial-state">
      <Logo logo={logo} />
      <Text
        as="h1"
        variant={{ size: "2xl-title", weight: "bold" }}
        t="initial.title"
      />
      <Text variant={{ color: "tertiary" }} as="h2" t="initial.subtitle" />
      <ConfiguredHandleForm
        lastHandle={lastHandle}
        handleSubmit={handleSubmit}
      />
      <Oidc providers={oidcFactors} handleClick={handleSubmit} />
    </article>
  );
};
