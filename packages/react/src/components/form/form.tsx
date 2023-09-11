/* eslint-disable @typescript-eslint/no-unused-vars */
import { clsx } from "clsx";
import { useFlowState } from "./useFlowState";
import { AuthenticatingState, CreateFlowOptions } from "./flow";
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
import { LoginOptions } from "../../domain/types";

export type Props = ConfigurationOverridesProps & {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  middleware?: LoginOptions["middleware"];
};

export const Form: React.FC<Props> = ({
  className,
  onSuccess,
  factors,
  text,
  middleware,
}) => {
  const flowState = useFlowState({ onSuccess });
  const { showBanner } = useConfiguration();
  const { lastHandle } = useLastHandle();

  return (
    <div className={clsx("sid-form", styles.form, className)}>
      <ConfigurationOverrides text={text} factors={factors}>
        {flowState.status === "initial" && (
          <FormProvider>
            <Initial
              flowState={flowState}
              lastHandle={lastHandle}
              middleware={middleware}
            />
          </FormProvider>
        )}
        {flowState.status === "authenticating" && (
          <FormProvider>
            <Authenticating flowState={flowState} />
          </FormProvider>
        )}
        {flowState.status === "error" && <Error flowState={flowState} />}
        {flowState.status === "success" && <Success flowState={flowState} />}
        {showBanner ? <Footer /> : null}
      </ConfigurationOverrides>
    </div>
  );
};
