import { Factor } from "@slashid/slashid";
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
import { useLastHandle } from "../../hooks/use-last-handle";
import { TextConfig } from "../text/constants";
import { ConfigurationProvider } from "../../main";

export type Props = {
  factors?: Factor[];
  text?: Partial<TextConfig>;
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
  const config = useConfiguration();
  const { theme } = config;
  const { lastHandle } = useLastHandle();

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
      <ConfigurationProvider
        {...config}
        text={{
          ...config.text,
          ...text,
        }}
        factors={factors ? factors : config.factors}
      >
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
        <Footer />
      </ConfigurationProvider>
    </div>
  );
};
