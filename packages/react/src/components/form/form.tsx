import { clsx } from "clsx";
import { useFlowState } from "./useFlowState";
import { Initial } from "./initial";
import { Authenticating } from "./authenticating";
import { Error } from "./error";
import { Success } from "./success";
import { themeClass, darkTheme } from "../../theme/theme.css";
import * as styles from "./form.css";
import { Footer } from "./footer";

export type Props = {
  className?: string;
};

export const Form: React.FC<Props> = ({ className }) => {
  const flowState = useFlowState();

  return (
    <div
      className={clsx(
        "sid-theme-root",
        themeClass,
        darkTheme,
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
