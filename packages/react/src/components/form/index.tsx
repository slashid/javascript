import { styles } from "./form.css";
import { themeClass } from "../../theme/theme.css";
import { useFlowState } from "./useFlowState";
import { Initial } from "./initial";
import { Authenticating } from "./authenticating";
import { Error } from "./error";
import { Success } from "./success";

export const Form = () => {
  const flowState = useFlowState();

  return (
    <div className={themeClass}>
      <div className={styles.form}>Form</div>
      <p>Flow state: {flowState.status}</p>
      {flowState.status === "initial" && <Initial flowState={flowState} />}
      {flowState.status === "authenticating" && (
        <Authenticating flowState={flowState} />
      )}
      {flowState.status === "error" && <Error flowState={flowState} />}
      {flowState.status === "success" && <Success flowState={flowState} />}
    </div>
  );
};
