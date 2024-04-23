import { Factor } from "@slashid/slashid";
import { clsx } from "clsx";
import { FormProvider } from "../../context/form-context";
import { useCallback } from "react";
import { Handle, LoginOptions } from "../../domain/types";
import { CreateFlowOptions } from "../form/flow.types";
import { useFlowState } from "../form/use-flow-state";
import { Authenticating } from "../form/authenticating";
import { Success } from "../form/success";
import { Error } from "../form/error";

import * as styles from "./dynamic-flow.css";
import { Initial } from "./initial";

type Props = {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  getFactor: (handle?: Handle) => Factor;
  middleware?: LoginOptions["middleware"];
};

/**
 * This is a variant of the <Form> component that allows you to dynamically change the factor based on the handle that was used.
 * The initial form will ask for a handle, and then the factor will be determined based on the handle that was entered.
 * This behaviour is controlled by the `getFactor` prop - it receives the handle that was entered and should return the factor that should be used.
 */
export const DynamicFlow = ({
  getFactor,
  className,
  onSuccess,
  middleware,
}: Props) => {
  const flowState = useFlowState({ onSuccess });

  const handleSubmit = useCallback(
    (_: Factor, handle?: Handle) => {
      if (flowState.status === "initial") {
        const factor = getFactor(handle);
        flowState.logIn(
          {
            factor,
            handle,
          },
          { middleware }
        );
      }
    },
    [getFactor, flowState, middleware]
  );

  return (
    <div className={clsx("sid-dynamic-flow", styles.form, className)}>
      {flowState.status === "initial" && (
        <Initial handleSubmit={handleSubmit} flowState={flowState} />
      )}
      {flowState.status === "authenticating" && (
        <FormProvider>
          <Authenticating flowState={flowState} />
        </FormProvider>
      )}
      {flowState.status === "error" && <Error />}
      {flowState.status === "success" && <Success flowState={flowState} />}
    </div>
  );
};
