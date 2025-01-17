import { clsx } from "clsx";
import { useOrgSwitchingFlowState } from "./useOrgSwitchingFlowState";
import { CreateFlowOptions } from "./org-switching-flow";
import { Authenticating } from "../authenticating";
import { Error } from "../error";
import { Success } from "../success";
import { Footer } from "../footer";
import { useConfiguration } from "../../../hooks/use-configuration";
import { FormProvider } from "../../../context/form-context";
import {
  ConfigurationOverrides,
  ConfigurationOverridesProps,
} from "../../configuration-overrides";
import { LoginOptions } from "../../../domain/types";
import { useRef, useMemo, useCallback } from "react";
import { Slots, useSlots } from "../../slot";
import { PayloadOptions } from "../types";
import { InternalFormContext } from "../internal-context";
import { StoreRecoveryCodes } from "../store-recovery-codes";
import { Card } from "@slashid/react-primitives";

export type Props = ConfigurationOverridesProps & {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  onError?: CreateFlowOptions["onError"];
  middleware?: LoginOptions["middleware"];
  children?: Slots<"authenticating" | "success" | "error" | "footer">; // TS does not enforce this, but it is used for documentation
};

/**
 * Render a form that can be used to complete the challenges for organization switching .
 * The form can be customized significantly using the built-in slots and CSS custom properties.
 * Check the documentation for more information.
 */
export const OrgSwitchingForm = ({
  className,
  onSuccess,
  onError,
  factors,
  text,
  children,
}: Props) => {
  const flowState = useOrgSwitchingFlowState({ onSuccess, onError });
  const { showBanner } = useConfiguration();

  const submitPayloadRef = useRef<PayloadOptions>({
    handleType: undefined,
    handleValue: undefined,
    flag: undefined,
  });

  const { status } = flowState;

  const defaultSlots = useMemo(() => {
    const slots = {
      footer: showBanner ? <Footer /> : null,
      authenticating:
        status === "authenticating" ? <Authenticating /> : undefined,
      success:
        status === "success" ? <Success flowState={flowState} /> : undefined,
      error: status === "error" ? <Error /> : undefined,
    };

    return slots;
  }, [status, showBanner, flowState]);

  const slots = useSlots({ children, defaultSlots });

  const _ = useCallback(() => {}, []);

  return (
    <InternalFormContext.Provider
      value={{
        flowState,
        submitPayloadRef,
        handleSubmit: _,
        setSelectedFactor: _,
      }}
    >
      <Card className={clsx("sid-form", className)}>
        <ConfigurationOverrides text={text} factors={factors}>
          {flowState.status === "authenticating" && (
            <FormProvider>{slots.authenticating}</FormProvider>
          )}
          {flowState.status === "storeRecoveryCodes" && (
            <StoreRecoveryCodes flowState={flowState} />
          )}
          {flowState.status === "success" && slots.success}
          {flowState.status === "error" && slots.error}
          {slots.footer}
        </ConfigurationOverrides>
      </Card>
    </InternalFormContext.Provider>
  );
};

OrgSwitchingForm.Error = Error;
OrgSwitchingForm.Authenticating = Authenticating;
