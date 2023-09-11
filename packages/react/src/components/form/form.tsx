import { clsx } from "clsx";
import { useFlowState } from "./useFlowState";
import { CreateFlowOptions } from "./flow";
import { Initial, InitialSlot } from "./initial";
import type { Props as InitialProps } from "./initial";
import { Authenticating } from "./authenticating";
import { Error } from "./error";
import { Success } from "./success";
import * as styles from "./form.css";
import { Footer } from "./footer";
import { useConfiguration } from "../../hooks/use-configuration";
import { FormProvider } from "../../context/form-context";
import { useLastHandle } from "../../hooks/use-last-handle";
import {
  ConfigurationOverrides,
  ConfigurationOverridesProps,
} from "../configuration-overrides";
import { LoginOptions } from "../../domain/types";
import React from "react";

export type Props = ConfigurationOverridesProps & {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  middleware?: LoginOptions["middleware"];
  children?: React.ReactElement<FooterProps | InitialProps>[];
};

export const Form = ({
  className,
  onSuccess,
  factors,
  text,
  middleware,
  children,
}: Props) => {
  const flowState = useFlowState({ onSuccess });
  const { showBanner } = useConfiguration();
  const { lastHandle } = useLastHandle();

  const slots = React.useMemo(() => {
    const renderedSlots: Record<string, React.ReactNode | null> = {
      footer: showBanner ? <Footer /> : null,
      initial: flowState.status === "initial" && (
        <Initial
          flowState={flowState}
          lastHandle={lastHandle}
          middleware={middleware}
        />
      ),
    };

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      switch (child.type) {
        case Form.Initial:
          renderedSlots.initial = child;
          break;
        case Form.Footer:
          renderedSlots.footer = child;
          break;
        default:
          break;
      }
    });

    return renderedSlots;
  }, [children, flowState, lastHandle, middleware, showBanner]);

  return (
    <div className={clsx("sid-form", styles.form, className)}>
      <ConfigurationOverrides text={text} factors={factors}>
        {flowState.status === "initial" && (
          <FormProvider>
            {slots.initial}
          </FormProvider>
        )}
        {flowState.status === "authenticating" && (
          <FormProvider>
            <Authenticating flowState={flowState} />
          </FormProvider>
        )}
        {flowState.status === "error" && <Error flowState={flowState} />}
        {flowState.status === "success" && <Success flowState={flowState} />}
        {slots.footer}
      </ConfigurationOverrides>
    </div>
  );
};

type FooterProps = {
  className?: string;
  children: React.ReactNode;
};

type FooterSlot = (props: FooterProps) => JSX.Element;
type InitialSlot = (props: InitialProps) => JSX.Element;

type Slots = FooterSlot | InitialSlot;

type Component = {
  displayName?: string;
} & Slots;

const footerSlot: Component = ({ children, className }: FooterProps) => {
  return <div className={className}>{children}</div>;
};

Form.Footer = footerSlot;
Form.Footer.displayName = "Form.Footer";
Form.Initial = InitialSlot;
