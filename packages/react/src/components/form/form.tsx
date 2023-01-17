import { clsx } from "clsx";
import { useFlowState } from "./useFlowState";
import { Initial } from "./initial";
import { Authenticating } from "./authenticating";
import { Error } from "./error";
import { Success } from "./success";
import { themeClass, darkTheme, autoTheme } from "../../theme/theme.css";
import * as styles from "./form.css";
import { Footer } from "./footer";
import { useConfiguration } from "../../hooks/use-configuration";

export type Props = {
  className?: string;
};

export const Form: React.FC<Props> = ({ className }) => {
  const flowState = useFlowState();
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
      {flowState.status === "initial" && <Initial flowState={flowState} />}
      {flowState.status === "authenticating" && (
        <Authenticating flowState={flowState} />
      )}
      {flowState.status === "error" && <Error flowState={flowState} />}
      {flowState.status === "success" && <Success flowState={flowState} />}
      <Footer />
    </div>
  );
};
