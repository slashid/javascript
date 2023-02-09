import { clsx } from "clsx";
import { useFlowState } from "./useFlowState";
import { CreateFlowOptions } from "./flow";
import { Initial } from "./initial";
import { Authenticating } from "./authenticating";
import { Error } from "./error";
import { Success } from "./success";
import { themeClass, darkTheme, autoTheme } from "../../theme/theme.css";
import * as styles from "./form.css";
import { Footer } from "./footer";
import { useConfiguration } from "../../hooks/use-configuration";
import { FormProvider } from "../../context/form-context";

export type Props = {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
};

export const Form: React.FC<Props> = ({ className, onSuccess }) => {
  const flowState = useFlowState({ onSuccess });
  const { theme } = useConfiguration();

  return (
    <div
      className={clsx(
        "sid-theme-root",
        `sid-theme-root__${theme}`,
        themeClass,
        { [darkTheme]: theme === "dark", [autoTheme]: theme === "auto" },
        styles.form,
        className
      )}
    >
      {flowState.status === "initial" && (
        <FormProvider>
          <Initial flowState={flowState} />
        </FormProvider>
      )}
      {flowState.status === "authenticating" && (
        <FormProvider>
          <Authenticating flowState={flowState} />
        </FormProvider>
      )}
      {flowState.status === "error" && <Error flowState={flowState} />}
      {flowState.status === "success" && <Success flowState={flowState} />}
      <Footer />
    </div>
  );
};
