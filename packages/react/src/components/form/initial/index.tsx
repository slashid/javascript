import { Factor } from "@slashid/slashid";
import React, { useCallback } from "react";

import { isFactorOidc } from "../../../domain/handles";
import { FactorLabeledOIDC, Handle, LoginOptions } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "../../text";
import { InitialState } from "../flow";

import { ConfiguredHandleForm } from "./configured-handle-form";
import * as styles from "./initial.css";
import { Logo } from "./logo";
import type { Props as LogoProps } from "./logo";
import { Oidc } from "./oidc";
import { TextConfig } from "../../text/constants";
import { InternalFormContext } from "../form";

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

const ControlsSlot = () => {
  // break down the form controls into separate slots

  // tabs should only control the form fields

  // the rest of the form should be a wrapper

  // when tabs change value, the form also renders again

  // return the form and then render the controls

  /* 
  
  <Form.Initial.Controls> // prepares the form
    <Form.Initial.Controls.Input/> // adds the form fields
    <Form.Initial.Controls.Submit/> // adds the submit button
  </Form.Initial.Controls>
  
  */
  return null;
};

export type Props = {
  flowState: InitialState;
  lastHandle?: Handle;
  middleware?: LoginOptions["middleware"];
};

export const Initial = ({ flowState, lastHandle, middleware }: Props) => {
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
      <LogoSlot />
      <HeadingSlot />
      <ConfiguredHandleForm
        lastHandle={lastHandle}
        handleSubmit={handleSubmit}
      />
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

export const InitialSlot = initialSlot;

// expose the form controls as separate items from the form buttons
