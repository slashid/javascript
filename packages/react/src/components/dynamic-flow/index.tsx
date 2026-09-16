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
  /**
   * Submit the `hook` factor for email identifiers before calling `getFactors`, so the
   * organization's identify_user webhook can pick the factor (one-step SSO). When the API
   * resolves nothing the flow continues with `getFactors` for the same identifier.
   */
  attemptSSO?: boolean;
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
  attemptSSO,
}: Props) => {
  // useFlowState creates the flow once, so these callbacks must stay stable and read through refs
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const handleSuccess = useCallback<
    NonNullable<CreateFlowOptions["onSuccess"]>
  >((user) => onSuccessRef.current?.(user), []);
  const handleError = useCallback<NonNullable<CreateFlowOptions["onError"]>>(
    (error, context) => onErrorRef.current?.(error, context),
    []
  );

  const flowState = useFlowState({
    onSuccess: handleSuccess,
    onError: handleError,
  });
  const { lastHandle } = useLastHandle();
  const { lastFactor } = useLastFactor();

  const flowStateRef = useRef(flowState);
  flowStateRef.current = flowState;
  const middlewareRef = useRef(middleware);
  middlewareRef.current = middleware;

  const submitPayloadRef = useRef<PayloadOptions>({
    handleType: undefined,
    handleValue: undefined,
    flag: undefined,
  });

  // stable so that effects in <Initial> do not re-run on every flow transition
  // or on every parent render that passes an inline getFactors
  const handleSubmit = useCallback((factor: Factor, handle?: Handle) => {
    const current = flowStateRef.current;
    if (current.status !== "initial") return;
    current.logIn({ factor, handle }, { middleware: middlewareRef.current });
  }, []);
  const getFactorsRef = useRef(getFactors);
  getFactorsRef.current = getFactors;
  const resolveFactors = useCallback(
    (handle: Handle) => getFactorsRef.current(handle),
    []
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
            getFactors={resolveFactors}
            middleware={middleware}
            attemptSSO={attemptSSO}
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
