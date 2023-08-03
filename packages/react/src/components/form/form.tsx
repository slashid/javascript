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
import { darkTheme, autoTheme, lightThemeVars } from "../../theme/theme.css";

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
  // TODO remove after deprecating the theme prop
  const { showBanner, theme } = useConfiguration();
  const { lastHandle } = useLastHandle();

  return (
    <div
      className={clsx(
        styles.form,
        {
          [darkTheme]: theme === "dark",
          [autoTheme]: theme === "auto",
          [lightThemeVars]: theme === "light",
        },
        className
      )}
    >
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
    </div>
  );
};
