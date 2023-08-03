import { Factor } from "@slashid/slashid";
import { clsx } from "clsx";
import { FormProvider } from "../../context/form-context";
import { useCallback } from "react";
import { FactorOIDC, Handle } from "../../domain/types";
import { CreateFlowOptions } from "../form/flow";
import { useFlowState } from "../form/useFlowState";
import { Authenticating } from "../form/authenticating";
import { Success } from "../form/success";
import { Error } from "../form/error";

import * as styles from "../form/form.css";
import { Initial } from "./initial";

type Props = {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  getFactor: (handle?: Handle) => Factor;
  oidcFactors?: FactorOIDC[];
};

export const DynamicFlow = ({ getFactor, className, onSuccess }: Props) => {
  const flowState = useFlowState({ onSuccess });

  const handleSubmit = useCallback(
    (_: Factor, handle?: Handle) => {
      if (flowState.status === "initial") {
        const factor = getFactor(handle);
        flowState.logIn({
          factor,
          handle,
        });
      }
    },
    [getFactor, flowState]
  );

  return (
    <div
      className={clsx(
        "sid-form",
        `sid-form--dynamic-flow`,
        styles.form,
        className
      )}
    >
      <article data-testid="sid-dynamic-flow--initial-state">
        {flowState.status === "initial" && (
          <Initial handleSubmit={handleSubmit} flowState={flowState} />
        )}
        {flowState.status === "authenticating" && (
          <FormProvider>
            <Authenticating flowState={flowState} />
          </FormProvider>
        )}
        {flowState.status === "error" && <Error flowState={flowState} />}
        {flowState.status === "success" && <Success flowState={flowState} />}
      </article>
    </div>
  );
};
