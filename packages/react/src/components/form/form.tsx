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
import { Handle, HandleType, LoginOptions } from "../../domain/types";
import React, { useCallback } from "react";
import { useSlots } from "../slot";
import { Factor } from "@slashid/slashid";
import { Flag } from "../input";

export type Props = ConfigurationOverridesProps & {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  middleware?: LoginOptions["middleware"];
  children?: React.ReactElement<FooterProps | InitialProps>[];
};

type PayloadOptions = {
  handleType?: HandleType;
  handleValue?: string;
  flag?: Flag;
};

export type InternalFormContextType = {
  flowState: ReturnType<typeof useFlowState> | null;
  lastHandle?: Handle;
  submitPayloadRef: React.MutableRefObject<PayloadOptions>;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  selectedFactor?: Factor;
  setSelectedFactor: React.Dispatch<React.SetStateAction<Factor | undefined>>;
};
export const InternalFormContext = React.createContext<InternalFormContextType>(
  {
    flowState: null,
    lastHandle: undefined,
    submitPayloadRef: { current: {} },
    handleSubmit: () => null,
    selectedFactor: undefined,
    setSelectedFactor: () => null,
  }
);
export const useInternalFormContext = () => {
  return React.useContext(InternalFormContext);
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
  const submitPayloadRef = React.useRef<PayloadOptions>({
    handleType: undefined,
    handleValue: undefined,
    flag: undefined,
  });
  const [selectedFactor, setSelectedFactor] = React.useState<
    Factor | undefined
  >();

  const defaultSlots = React.useMemo(() => {
    const slots = {
      footer: showBanner ? <Footer /> : null,
      initial: flowState.status === "initial" && <Initial />,
    };

    return slots;
  }, [flowState, showBanner]);

  const slots = useSlots({ children, defaultSlots });

  const handleSubmit = useCallback(
    (factor: Factor, handle?: Handle) => {
      if (flowState.status !== "initial") return;

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
    <InternalFormContext.Provider
      value={{
        flowState,
        lastHandle,
        handleSubmit,
        submitPayloadRef,
        selectedFactor,
        setSelectedFactor,
      }}
    >
      <div className={clsx("sid-form", styles.form, className)}>
        <ConfigurationOverrides text={text} factors={factors}>
          {flowState.status === "initial" && (
            <FormProvider>{slots.initial}</FormProvider>
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
    </InternalFormContext.Provider>
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
