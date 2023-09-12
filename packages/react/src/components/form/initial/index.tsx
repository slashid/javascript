import { useMemo } from "react";

import {
  hasOidcAndNonOidcFactors,
  isFactorOidc,
} from "../../../domain/handles";
import { FactorLabeledOIDC, Handle, LoginOptions } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { InitialState } from "../flow";

import { Oidc } from "./oidc";
import { Controls } from "./controls";
import { Divider } from "../../divider";
import { LogoSlot } from "./logo";
import { HeaderSlot } from "./header";
import { Factor } from "@slashid/slashid";
import React from "react";
import { InternalFormContext } from "../form";

// TODO does not work as a standalone module?
export type OIDCSlotProps = {
  factors: FactorLabeledOIDC[];
  handleClick: (factor: Factor, handle?: Handle) => void;
};

export const OIDCSlot = ({
  children,
}: {
  children?: (props: OIDCSlotProps) => React.ReactNode;
}) => {
  const { factors } = useConfiguration();
  const { handleSubmit } = React.useContext(InternalFormContext);
  const oidcFactors: FactorLabeledOIDC[] = factors.filter(isFactorOidc);

  const OIDC = React.useMemo(() => {
    return <Oidc providers={oidcFactors} handleClick={handleSubmit} />;
  }, [handleSubmit, oidcFactors]);

  if (typeof children === "function") {
    return <>{children({ factors: oidcFactors, handleClick: handleSubmit })}</>;
  }

  if (React.Children.count(children) > 0) {
    return <>{children}</>;
  }

  return OIDC;
};

OIDCSlot.displayName = "OIDC";

export type Props = {
  flowState: InitialState;
  lastHandle?: Handle;
  middleware?: LoginOptions["middleware"];
};

export const Initial = () => {
  const { factors, text } = useConfiguration();

  const shouldRenderDivider = useMemo(
    () => hasOidcAndNonOidcFactors(factors),
    [factors]
  );

  return (
    <article data-testid="sid-form-initial-state">
      <LogoSlot />
      <HeaderSlot />
      <Controls />
      {shouldRenderDivider && <Divider>{text["initial.divider"]}</Divider>}
      <OIDCSlot />
    </article>
  );
};

Initial.Logo = LogoSlot;
Initial.Header = HeaderSlot;
Initial.Controls = Controls;
Initial.OIDC = OIDCSlot;
