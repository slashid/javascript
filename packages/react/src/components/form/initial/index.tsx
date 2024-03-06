import React, { ReactNode } from "react";
import { Factor } from "@slashid/slashid";

import {
  isFactorOidc,
  isFactorSSO,
} from "../../../domain/handles";
import {
  FactorCustomizableSAML,
  FactorLabeledOIDC,
  FactorSSO,
  Handle,
  LoginOptions,
} from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { InitialState } from "../flow";

import { Controls } from "./controls";
import { LogoSlot } from "./logo";
import { HeaderSlot } from "./header";
import { useInternalFormContext } from "../internal-context";
import { SSOProviders } from "./sso";
import { Divider } from "./divider";

// TODO does not work as a standalone module?
export type OIDCSlotProps = {
  factors: FactorLabeledOIDC[];
  handleClick: (factor: Factor, handle?: Handle) => void;
};

// TODO: backwards compatiblility layer, deprecate with the next change
export const OIDCSlot = ({
  children,
}: {
  children?: (props: OIDCSlotProps) => React.ReactNode;
}) => {
  const { factors } = useConfiguration();
  const { handleSubmit } = useInternalFormContext();
  const oidcFactors: FactorLabeledOIDC[] = factors.filter(isFactorOidc);

  const OIDC = React.useMemo(() => {
    return <SSOProviders providers={oidcFactors} handleClick={handleSubmit} />;
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

export type SSOSlotProps = {
  factors: Array<FactorLabeledOIDC | FactorCustomizableSAML>;
  handleClick: (factor: Factor, handle?: Handle) => void;
};

const SSOSlot = ({
  children,
}: {
  children?: (props: SSOSlotProps) => ReactNode;
}) => {
  const { factors } = useConfiguration();
  const { handleSubmit } = useInternalFormContext();
  const ssoFactors: FactorSSO[] = factors.filter(isFactorSSO);

  const SSO = React.useMemo(() => {
    return <SSOProviders providers={ssoFactors} handleClick={handleSubmit} />;
  }, [handleSubmit, ssoFactors]);

  if (typeof children === "function") {
    return <>{children({ factors: ssoFactors, handleClick: handleSubmit })}</>;
  }

  if (React.Children.count(children) > 0) {
    return <>{children}</>;
  }

  return SSO;
};

SSOSlot.displayName = "SSO";

export type Props = {
  flowState: InitialState;
  lastHandle?: Handle;
  middleware?: LoginOptions["middleware"];
};

const Initial = () => {
  return (
    <article data-testid="sid-form-initial-state">
      <LogoSlot />
      <HeaderSlot />
      <Controls />
      <Divider />
      <SSOSlot />
    </article>
  );
};

Initial.Logo = LogoSlot;
Initial.Header = HeaderSlot;
Initial.Controls = Controls;
Initial.Divider = Divider
/** @deprecated Use `Initial.SSO` instead. */
Initial.OIDC = OIDCSlot;
Initial.SSO = SSOSlot;

export { Initial };
