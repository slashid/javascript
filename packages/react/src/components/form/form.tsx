import { clsx } from "clsx";
import { FormProvider } from "../../context/form-context";
import { useConfiguration } from "../../hooks/use-configuration";
import { useLastHandle } from "../../hooks/use-last-handle";
import { ThemeRoot } from "../../theme/theme-root";
import {
  ConfigurationOverrides,
  ConfigurationOverridesProps,
} from "../configuration-overrides";
import { Authenticating } from "./authenticating";
import { Error } from "./error";
import { CreateFlowOptions } from "./flow";
import { Footer } from "./footer";
import * as styles from "./form.css";
import { Initial } from "./initial";
import { Success } from "./success";
import { useFlowState } from "./useFlowState";

export type Props = ConfigurationOverridesProps & {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
};

export const Form: React.FC<Props> = ({
  className,
  onSuccess,
  factors,
  text,
}) => {
  const flowState = useFlowState({ onSuccess });
  const { theme, showBanner } = useConfiguration();
  const { lastHandle } = useLastHandle();

  return (
    <ThemeRoot theme={theme} className={clsx(styles.form, className)}>
      <ConfigurationOverrides text={text} factors={factors}>
        {flowState.status === "initial" && (
          <FormProvider>
            <Initial flowState={flowState} lastHandle={lastHandle} />
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
    </ThemeRoot>
  );
};
