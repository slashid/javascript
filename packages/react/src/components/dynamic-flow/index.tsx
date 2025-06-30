import { Factor } from "@slashid/slashid";
import { clsx } from "clsx";
import { FormProvider } from "../../context/form-context";
import { useCallback, useRef } from "react";
import { Handle, LoginOptions } from "../../domain/types";
import { CreateFlowOptions } from "../form/flow/flow.common";
import { useFlowState } from "../form/useFlowState";
import { AuthenticatingImplementation as Authenticating } from "../form/authenticating";
import { Success } from "../form/success";
import { Error } from "../form/error";

import * as styles from "./dynamic-flow.css";
import { Initial } from "./initial";
import { InternalFormContext } from "../form/internal-context";
import { PayloadOptions } from "../form/types";
import { useLastHandle } from "../../hooks/use-last-handle";
import { useLastFactor } from "../../hooks/use-last-factor";

type Props = {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  onError?: CreateFlowOptions["onError"];
  getFactors: (handle?: Handle) => Promise<Factor[]> | Factor[];
  middleware?: LoginOptions["middleware"];
};

/**
 * This is a variant of the <Form> component that allows you to dynamically change the factor based on the handle that was used.
 * The initial form will ask for a handle, and then the factor will be determined based on the handle that was entered.
 * This behaviour is controlled by the `getFactor` prop - it receives the handle that was entered and should return the factor that should be used.
 */
export const DynamicFlow = ({
  getFactors,
  className,
  onSuccess,
  onError,
  middleware,
}: Props) => {
  const flowState = useFlowState({ onSuccess, onError });
  const { lastHandle } = useLastHandle();
  const { lastFactor } = useLastFactor();

  const submitPayloadRef = useRef<PayloadOptions>({
    handleType: undefined,
    handleValue: undefined,
    flag: undefined,
  });
  const handleSubmit = useCallback(
    (factor: Factor, handle?: Handle) => {
      if (flowState.status === "initial") {
        flowState.logIn(
          {
            factor,
            handle,
          },
          { middleware }
        );
      }
    },
    [flowState, middleware]
  );

  return (
    <InternalFormContext.Provider
      value={{
        flowState,
        handleSubmit,
        submitPayloadRef,
        setSelectedFactor: () => {},
        lastHandle,
        lastFactor,
      }}
    >
      <div className={clsx("sid-dynamic-flow", styles.form, className)}>
        {flowState.status === "initial" && (
          <Initial
            handleSubmit={handleSubmit}
            flowState={flowState}
            getFactors={getFactors}
          />
        )}
        {flowState.status === "authenticating" && (
          <FormProvider>
            <Authenticating flowState={flowState} />
          </FormProvider>
        )}
        {flowState.status === "error" && <Error />}
        {flowState.status === "success" && <Success flowState={flowState} />}
      </div>
    </InternalFormContext.Provider>
  );
};
