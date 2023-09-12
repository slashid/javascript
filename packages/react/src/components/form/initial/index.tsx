import { Factor } from "@slashid/slashid";
import React from "react";

import { isFactorOidc } from "../../../domain/handles";
import { FactorLabeledOIDC, Handle, LoginOptions } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "../../text";
import { InitialState } from "../flow";

import * as styles from "./initial.css";
import { Logo } from "./logo";
import type { Props as LogoProps } from "./logo";
import { Oidc } from "./oidc";
import { TextConfig } from "../../text/constants";
import { InternalFormContext } from "../form";
import { Controls } from "./controls";

const LogoSlot = ({
  children,
}: {
  children?: (props: LogoProps) => React.ReactNode;
}) => {
  const { logo } = useConfiguration();

  if (typeof children !== "function") {
    return <Logo logo={logo} />;
  }

  return <>{children({ logo })}</>;
};

LogoSlot.displayName = "Logo";

type HeadingProps = {
  text: TextConfig;
};
const HeadingSlot = ({
  children,
}: {
  children?: (props: HeadingProps) => React.ReactNode;
}) => {
  const { text } = useConfiguration();

  const Heading = React.useMemo(() => {
    return (
      <div className={styles.header}>
        <Text
          as="h1"
          variant={{ size: "2xl-title", weight: "bold" }}
          t="initial.title"
        />
        <Text variant={{ color: "tertiary" }} as="h2" t="initial.subtitle" />
      </div>
    );
  }, []);

  if (typeof children !== "function") {
    return Heading;
  }

  return <>{children({ text })}</>;
};

HeadingSlot.displayName = "Heading";

export type OIDCSlotProps = {
  factors: FactorLabeledOIDC[];
  handleClick: (factor: Factor, handle?: Handle) => void;
};
const OIDCSlot = ({
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

  if (typeof children !== "function") {
    return OIDC;
  }

  return <>{children({ factors: oidcFactors, handleClick: handleSubmit })}</>;
};

OIDCSlot.displayName = "OIDC";

export type Props = {
  flowState: InitialState;
  lastHandle?: Handle;
  middleware?: LoginOptions["middleware"];
};

export const Initial = () => {
  return (
    <article data-testid="sid-form-initial-state">
      <LogoSlot />
      <HeadingSlot />
      <Controls />
      <OIDCSlot />
    </article>
  );
};

const initialSlot = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
initialSlot.displayName = "Initial";

initialSlot.Logo = LogoSlot;
initialSlot.Heading = HeadingSlot;
initialSlot.OIDC = OIDCSlot;
initialSlot.Controls = Controls;

export const InitialSlot = initialSlot;

// expose the form controls as separate items from the form buttons
