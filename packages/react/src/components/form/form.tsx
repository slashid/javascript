import { clsx } from "clsx";
import { useFlowState } from "./useFlowState";
import { CreateFlowOptions } from "./flow";
import { Initial } from "./initial";
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
import { Slots, useSlots } from "../slot";
import { Factor } from "@slashid/slashid";
import { Flag } from "../input";

export type Props = ConfigurationOverridesProps & {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  onError?: CreateFlowOptions["onError"];
  middleware?: LoginOptions["middleware"];
  children?: Slots<
    "initial" | "authenticating" | "success" | "error" | "footer"
  >; // TS does not enforce this, but it is used for documentation
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

/**
 * Render a form that can be used to sign in or sign up a user.
 * The form can be customized significantly using the built-in slots and CSS custom properties.
 * Check the documentation for more information.
 */
export const Form = ({
  className,
  onSuccess,
  onError,
  factors,
  text,
  middleware,
  children,
}: Props) => {
  const flowState = useFlowState({ onSuccess, onError });
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
  const { status } = flowState;

  const defaultSlots = React.useMemo(() => {
    const slots = {
      footer: showBanner ? <Footer /> : null,
      initial: status === "initial" ? <Initial /> : undefined,
      authenticating:
        status === "authenticating" ? (
          <Authenticating flowState={flowState} />
        ) : undefined,
      success:
        status === "success" ? <Success flowState={flowState} /> : undefined,
      error:
        status === "error" ? (
          <div>
            defue
            <Error />
          </div>
        ) : undefined,
    };

    return slots;
  }, [status, showBanner, flowState, children]);

  console.log({children})
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
            <FormProvider>{slots.authenticating}</FormProvider>
          )}
          {flowState.status === "success" && slots.success}
          {flowState.status === "error" && slots.error}
          {slots.footer}
        </ConfigurationOverrides>
      </div>
    </InternalFormContext.Provider>
  );
};

Form.Initial = Initial;
