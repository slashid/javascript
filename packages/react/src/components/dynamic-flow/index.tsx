import { Errors, Factor } from "@slashid/slashid";
import { clsx } from "clsx";
import { FormProvider } from "../../context/form-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, LoginOptions } from "../../domain/types";
import { CreateFlowOptions } from "../form/flow/flow.common";
import { useFlowState } from "../form/useFlowState";
import { AuthenticatingImplementation as Authenticating } from "../form/authenticating";
import { Success } from "../form/success";
import { Error } from "../form/error";
import { Loader } from "../form/authenticating/icons";

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

type Resume = { handle: Handle; id: number };

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
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const attemptedHandleRef = useRef<Handle | null>(null);
  const resumeCounter = useRef(0);
  const [resume, setResume] = useState<Resume | null>(null);

  // useFlowState creates the flow once, so this callback must stay stable and read through refs
  const handleError = useCallback<NonNullable<CreateFlowOptions["onError"]>>(
    (error, context) => {
      if (
        attemptedHandleRef.current &&
        Errors.isHookFactorUnresolvedError(error)
      ) {
        return;
      }
      onErrorRef.current?.(error, context);
    },
    []
  );

  const flowState = useFlowState({ onSuccess, onError: handleError });
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

  const handleSSOAttempt = useCallback((handle: Handle) => {
    attemptedHandleRef.current = handle;
  }, []);

  const isPendingResume =
    flowState.status === "error" &&
    attemptedHandleRef.current !== null &&
    Errors.isHookFactorUnresolvedError(flowState.context.error);

  useEffect(() => {
    if (!isPendingResume) return;

    const handle = attemptedHandleRef.current!;
    attemptedHandleRef.current = null;
    resumeCounter.current += 1;
    setResume({ handle, id: resumeCounter.current });
    flowState.cancel();
  }, [isPendingResume, flowState]);

  // the resumed instance is for one attempt; leaving the initial state discards it
  useEffect(() => {
    if (resume && flowState.status !== "initial") setResume(null);
  }, [resume, flowState.status]);

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
            key={resume?.id ?? "fresh"}
            handleSubmit={handleSubmit}
            flowState={flowState}
            getFactors={getFactors}
            middleware={middleware}
            attemptSSO={attemptSSO}
            onSSOAttempt={handleSSOAttempt}
            initialHandle={resume?.handle}
          />
        )}
        {flowState.status === "authenticating" && (
          <FormProvider>
            <Authenticating flowState={flowState} />
          </FormProvider>
        )}
        {flowState.status === "error" &&
          (isPendingResume ? <Loader /> : <Error />)}
        {flowState.status === "success" && <Success flowState={flowState} />}
      </div>
    </InternalFormContext.Provider>
  );
};
